# app/routers/payouts.py
# Payouts router: manage payout recipients and artisan payouts via Paystack
from __future__ import annotations

from app.auth_utils import require_artisan_approved

import httpx
from httpx import AsyncClient, AsyncHTTPTransport

import os
import uuid
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth_utils import get_current_user, require_admin
from app.models import User
from app.models.payouts import PayoutRecipient, Payout
from app.config import PAYSTACK_SECRET, FEE_PAYOUT_NGN
from app.schemas.payout_schemas import (
    CreateRecipientIn,
    RecipientOut,
    PayoutRequestIn,
    PayoutOut,
)

router = APIRouter(prefix="/payouts", tags=["Payouts"])


# role helpers (handles enum or plain string)
def _is_artisan(user) -> bool:
    r = getattr(user, "role", None)
    if r is None:
        return False
    try:
        from app.models.enums import UserRole
        if r == UserRole.artisan:
            return True
        if isinstance(r, UserRole):
            return r.name.lower() == "artisan"
    except Exception:
        pass
    return str(r).split(".")[-1].lower() == "artisan"


# HTTP helpers to Paystack
async def _paystack_post(path: str, secret: str, payload: dict):
    headers = {"Authorization": f"Bearer {secret}", "Content-Type": "application/json"}
    transport = AsyncHTTPTransport(retries=2)  # retry transient TLS/NET errors
    # Force HTTP/1.1 (http2=False) to avoid INVALID_SESSION_ID on Windows
    async with AsyncClient(timeout=20, http2=False, transport=transport) as client:
        return await client.post(f"https://api.paystack.co{path}", json=payload, headers=headers)

async def _paystack_get(path: str, secret: str):
    headers = {"Authorization": f"Bearer {secret}"}
    transport = AsyncHTTPTransport(retries=2)
    async with AsyncClient(timeout=20, http2=False, transport=transport) as client:
        return await client.get(f"https://api.paystack.co{path}", headers=headers)


def _as_recipient_out(r: PayoutRecipient) -> RecipientOut:
    return RecipientOut(
        id=str(r.id),
        provider=r.provider,
        bank_code=r.bank_code,
        bank_name=r.bank_name,
        account_last4=r.account_last4,
        account_name=r.account_name,
        currency=r.currency,
        active=r.active,
    )


# Create/Update transfer recipient (artisan)
@router.post("/recipient", response_model=RecipientOut)
async def create_or_update_recipient(
    payload: CreateRecipientIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_artisan_approved),
):
    if not _is_artisan(current):
        raise HTTPException(status_code=403, detail="Artisans only")

    secret = PAYSTACK_SECRET or os.getenv("PAYSTACK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")

    body = {
        "type": "nuban",
        "name": payload.account_name or current.full_name,
        "account_number": payload.account_number,
        "bank_code": payload.bank_code,
        "currency": "NGN",
    }
    rsp = await _paystack_post("/transferrecipient", secret, body)
    if rsp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail=f"Paystack transferrecipient failed: {rsp.text}")

    data = (rsp.json() or {}).get("data") or {}
    recipient_code = data.get("recipient_code")
    bank_name = (data.get("details") or {}).get("bank_name") or data.get("name") or "Bank"
    acct = payload.account_number.strip()
    acct_last4 = acct[-4:] if len(acct) >= 4 else acct

    # Upsert locally
    rec = (
        db.query(PayoutRecipient)
        .filter(PayoutRecipient.user_id == current.id, PayoutRecipient.provider == "paystack")
        .first()
    )
    if rec:
        rec.recipient_code = recipient_code
        rec.bank_code = payload.bank_code
        rec.bank_name = bank_name
        rec.account_last4 = acct_last4
        rec.account_name = payload.account_name or current.full_name
        rec.active = True
    else:
        rec = PayoutRecipient(
            user_id=current.id,
            provider="paystack",
            recipient_code=recipient_code,
            bank_code=payload.bank_code,
            bank_name=bank_name,
            account_last4=acct_last4,
            account_name=payload.account_name or current.full_name,
            currency="NGN",
            active=True,
        )
        db.add(rec)

    db.commit()
    db.refresh(rec)
    return _as_recipient_out(rec)


# List NGN/NUBAN banks (pick a valid bank_code)
@router.get("/banks")
async def list_banks(current: User = Depends(get_current_user)):
    secret = PAYSTACK_SECRET or os.getenv("PAYSTACK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")
    rsp = await _paystack_get("/bank?currency=NGN&type=nuban", secret)
    if rsp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Paystack banks failed: {rsp.text}")
    return rsp.json()


# Request payout (artisan) -- create Payout & initiate Paystack transfer
@router.post("/request", response_model=PayoutOut)
async def request_payout(
    payload: PayoutRequestIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_artisan_approved),
):
    if not _is_artisan(current):
        raise HTTPException(status_code=403, detail="Artisans only")

    # Must have an active Paystack recipient
    rec = (
        db.query(PayoutRecipient)
        .filter(
            PayoutRecipient.user_id == current.id,
            PayoutRecipient.provider == "paystack",
            PayoutRecipient.active == True,  # noqa: E712
        )
        .first()
    )
    if not rec:
        raise HTTPException(status_code=400, detail="No active payout recipient for this artisan")

    # Create payout row
    ref = f"payout_{uuid.uuid4().hex[:18]}"
    p = Payout(
        user_id=current.id,
        amount=Decimal(payload.amount),
        currency="NGN",
        status="processing",
        reference=ref,
        reason=payload.reason or "Artisan payout",
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    # Apply Fixion payout fee (₦10) to the amount sent to bank
    transfer_amount = float(p.amount) - float(FEE_PAYOUT_NGN)
    if transfer_amount <= 0:
        p.status = "failed"
        db.add(p)
        db.commit()
        raise HTTPException(status_code=400, detail="Payout amount too small after ₦10 fee")

    amount_kobo = int(round(transfer_amount * 100))

    # Call Paystack transfer with fee-deducted amount
    secret = PAYSTACK_SECRET or os.getenv("PAYSTACK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")

    body = {
        "source": "balance",
        "reason": p.reason,
        "amount": amount_kobo,  # fee-deducted amount is sent to bank
        "recipient": rec.recipient_code,
        "reference": p.reference,
    }
    rsp = await _paystack_post("/transfer", secret, body)
    if rsp.status_code not in (200, 201):
        # Mark the payout as failed before raising
        p.status = "failed"
        db.add(p)
        db.commit()

        # Attempt to extract a meaningful error message from Paystack's JSON
        error_detail = None
        try:
            err_json = rsp.json() or {}
            # Paystack typically wraps details under "message" or nested "message"
            if isinstance(err_json, dict):
                error_detail = err_json.get("message") or err_json.get("status")
        except Exception:
            # fallback to raw text
            error_detail = None
        # Final fallback: use rsp.text
        if not error_detail:
            error_detail = rsp.text
        raise HTTPException(status_code=502, detail=f"Paystack transfer failed: {error_detail}")

    # Success: parse transfer details
    data = (rsp.json() or {}).get("data") or {}
    p.transfer_code = data.get("transfer_code") or p.transfer_code
    # Keep status "processing" until Paystack webhook updates success/failed
    db.add(p)
    db.commit()
    db.refresh(p)

    return PayoutOut(
        id=str(p.id),
        user_id=str(p.user_id),
        amount=p.amount,             # original requested amount
        currency=p.currency,
        status=p.status,
        reference=p.reference,
        transfer_code=p.transfer_code,
        reason=p.reason,
    )


# List my payouts (artisan)
@router.get("/my", response_model=dict)
async def my_payouts(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    q = db.query(Payout).filter(Payout.user_id == current.id).order_by(Payout.created_at.desc())
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    return {
        "total": total,
        "items": [
            {
                "id": str(r.id),
                "amount": float(r.amount),
                "currency": r.currency,
                "status": r.status,
                "reference": r.reference,
                "transfer_code": r.transfer_code,
                "reason": r.reason,
                "created_at": r.created_at,
            }
            for r in rows
        ],
    }


# Admin list payouts (optional)
@router.get("/admin/list", response_model=dict)
async def admin_list_payouts(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    status_eq: Optional[str] = Query(None),
    artisan_email: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    from sqlalchemy.orm import aliased

    Artisan = aliased(User)
    q = (
        db.query(Payout, Artisan.email.label("artisan_email"))
        .join(Artisan, Artisan.id == Payout.user_id)
        .order_by(Payout.created_at.desc())
    )
    if status_eq:
        q = q.filter(Payout.status == status_eq)
    if artisan_email:
        q = q.filter(Artisan.email == artisan_email)

    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    return {
        "total": total,
        "items": [
            {
                "id": str(p.id),
                "user_id": str(p.user_id),
                "artisan_email": email,
                "amount": float(p.amount),
                "currency": p.currency,
                "status": p.status,
                "reference": p.reference,
                "transfer_code": p.transfer_code,
                "reason": p.reason,
                "created_at": p.created_at,
            }
            for (p, email) in rows
        ],
    }
