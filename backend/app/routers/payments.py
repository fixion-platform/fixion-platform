# app/routers/payments.py
"""
Payment and wallet routes for the Fixion platform.

- Customer pays by card (Paystack) or wallet.
- On card success (webhook or manual verify), artisan's wallet is credited (full job amount).
- We add a customer-facing fee (₦10) at card checkout.
- We ALSO add a ₦10 fee when the customer pays via WALLET (Fixion gets the fee).
- Payout fees (₦10) are applied in payouts.py when transferring to bank; on webhook success
  we DEBIT artisan full payout amount and CREDIT Fixion ₦10 in-wallet.
"""

from __future__ import annotations

import os
import json
import hmac
import hashlib
import uuid
from typing import Optional

from decimal import Decimal
import httpx
from httpx import AsyncClient, AsyncHTTPTransport
from fastapi import APIRouter, Depends, HTTPException, Header, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, case

from app.db.database import get_db
from app.auth_utils import get_current_user, require_verified_contact, require_artisan_approved
from app.security.rbac import require_payment_access_by_path, require_payment_access_by_query
from app.models import User, Job
from app.models.payments import Payment, WalletLedger, IdempotencyKey
from app.models.payouts import Payout
from app.models.enums import PaymentMethod, PaymentStatus, LedgerEntryType
from app.schemas.payment_schemas import (
    CheckoutIn,
    PaymentOut,
    PaymentHistoryOut,
    PaymentHistoryItem,
)
from app.services.payments_service import checkout
from app.config import (
    PAYSTACK_SECRET,
    FEE_CUSTOMER_NGN,
    FEE_PAYOUT_NGN,
    FEE_WALLET_NGN,
    PLATFORM_FEE_USER_EMAIL,
)

router = APIRouter(prefix="/payments", tags=["Payments"])


# ---------- helpers ----------
def _to_out(p: Payment) -> PaymentOut:
    return PaymentOut(
        id=str(p.id),
        reference=p.reference,
        status=str(p.status),
        method=str(p.method),
        amount=p.amount,
        currency=p.currency,
        job_id=str(p.job_id) if p.job_id else None,
        artisan_user_id=str(p.artisan_id) if p.artisan_id else None,
    )


def _get_platform_user(db: Session) -> User:
    """Find the platform user who receives Fixion fees."""
    u = db.query(User).filter(User.email == PLATFORM_FEE_USER_EMAIL).first()
    if not u:
        # last-resort: any admin; if none, raise
        u = db.query(User).filter(func.lower(func.cast(User.role, str)).like("%admin%")).first()
    if not u:
        raise HTTPException(status_code=500, detail="Platform fee user not found; set PLATFORM_FEE_USER_EMAIL.")
    return u


def _wallet_sum(db: Session, user_id) -> Decimal:
    """SUM with signs implied by entry_type (amounts are stored positive)."""
    credit_types = [LedgerEntryType.deposit, LedgerEntryType.payout, LedgerEntryType.refund, LedgerEntryType.adjust]
    debit_types  = [LedgerEntryType.charge, LedgerEntryType.withdrawal]

    raw = db.query(
        func.coalesce(
            func.sum(
                case(
                    (WalletLedger.entry_type.in_(credit_types), WalletLedger.amount),
                    (WalletLedger.entry_type.in_(debit_types), -WalletLedger.amount),
                    else_=0,
                )
            ),
            0,
        )
    ).filter(WalletLedger.user_id == user_id).scalar()
    return Decimal(str(raw))

def _credit_artisan_if_needed(db: Session, pmt: Payment, event: str = "manual_verify"):
    """
    Idempotently mark captured and credit artisan via WalletLedger if not already done.
    Terminal state lock: if payment is captured/failed/refunded, do not change state.
    """
    TERMINAL = {PaymentStatus.captured, PaymentStatus.failed, PaymentStatus.refunded}
    changed = False

    # Terminal lock: do not move away from any terminal state
    if pmt.status in TERMINAL:
        # still ensure artisan has been credited for this reference (idempotent safety)
        if pmt.status == PaymentStatus.captured and pmt.artisan_id:
            exists = (
                db.query(WalletLedger)
                .filter(
                    and_(
                        WalletLedger.reference == pmt.reference,
                        WalletLedger.entry_type == LedgerEntryType.payout,
                        WalletLedger.user_id == pmt.artisan_id,
                    )
                )
                .first()
            )
            if not exists:
                db.add(
                    WalletLedger(
                        user_id=pmt.artisan_id,
                        currency=pmt.currency,
                        entry_type=LedgerEntryType.payout,
                        amount=Decimal(str(pmt.amount)),
                        reference=pmt.reference,
                        meta={
                            "source": "paystack",
                            "provider_event": event,
                            "payment_id": str(pmt.id),
                            "job_id": str(pmt.job_id) if pmt.job_id else None,
                        },
                    )
                )
                changed = True
        if changed:
            db.commit()
        return  # nothing else to do

    # Non-terminal -> allow transition to captured
    pmt.status = PaymentStatus.captured
    db.add(pmt)
    changed = True

    # Credit artisan if not already credited for this payment reference
    if pmt.artisan_id:
        exists = (
            db.query(WalletLedger)
            .filter(
                and_(
                    WalletLedger.reference == pmt.reference,
                    WalletLedger.entry_type == LedgerEntryType.payout,
                    WalletLedger.user_id == pmt.artisan_id,
                )
            )
            .first()
        )
        if not exists:
            db.add(
                WalletLedger(
                    user_id=pmt.artisan_id,
                    currency=pmt.currency,
                    entry_type=LedgerEntryType.payout,
                    amount=Decimal(str(pmt.amount)),  # full amount
                    reference=pmt.reference,
                    meta={
                        "source": "paystack",
                        "provider_event": event,
                        "payment_id": str(pmt.id),
                        "job_id": str(pmt.job_id) if pmt.job_id else None,
                    },
                )
            )
            changed = True

    if changed:
        db.commit()


# ---------- customer-initiated checkout ----------
@router.post("/checkout", response_model=PaymentOut, status_code=201)
def payments_checkout(
    payload: CheckoutIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_verified_contact),
    idempotency_key: Optional[str] = Header(default=None, alias="Idempotency-Key"),
):
    job = None
    artisan = None

    if payload.job_id:
        try:
            job = db.get(Job, uuid.UUID(payload.job_id))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid job_id")
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        artisan = db.get(User, job.artisan_id) if job.artisan_id else None

    elif payload.artisan_user_id:
        try:
            artisan = db.get(User, uuid.UUID(payload.artisan_user_id))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid artisan_user_id")
        if not artisan:
            raise HTTPException(status_code=404, detail="Artisan not found")

    try:
        p = checkout(
            db,
            current,
            payload.amount,
            method=PaymentMethod(payload.method),
            currency=payload.currency,
            job=job,
            artisan=artisan,
            meta=payload.meta,
            idem_key=idempotency_key,
        )
        db.commit()
        db.refresh(p)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    # Wallet fee (customer pays with WALLET): customer pays amount + ₦10; artisan gets full amount; Fixion gets ₦10.
    if PaymentMethod(payload.method) == PaymentMethod.wallet:
        if not artisan:
            raise HTTPException(status_code=400, detail="Wallet pay requires a target artisan/job.")

        platform_user = _get_platform_user(db)

        amount_dec = Decimal(str(p.amount))
        fee_dec = Decimal(str(FEE_WALLET_NGN))
        total_to_charge = amount_dec + fee_dec

        # Already recorded for this payment reference
        already_charged = (
            db.query(func.coalesce(func.sum(WalletLedger.amount), 0))
            .filter(
                WalletLedger.user_id == current.id,
                WalletLedger.entry_type == LedgerEntryType.charge,
                WalletLedger.reference == p.reference,
            )
            .scalar()
        )
        already_charged = Decimal(str(already_charged))

        already_payed_artisan = (
            db.query(func.coalesce(func.sum(WalletLedger.amount), 0))
            .filter(
                WalletLedger.user_id == p.artisan_id,
                WalletLedger.entry_type == LedgerEntryType.payout,
                WalletLedger.reference == p.reference,
            )
            .scalar()
        )
        already_payed_artisan = Decimal(str(already_payed_artisan))

        already_payed_platform = (
            db.query(func.coalesce(func.sum(WalletLedger.amount), 0))
            .filter(
                WalletLedger.user_id == platform_user.id,
                WalletLedger.entry_type == LedgerEntryType.payout,
                WalletLedger.reference == p.reference,
            )
            .scalar()
        )
        already_payed_platform = Decimal(str(already_payed_platform))

        remaining_customer_charge = max(Decimal("0"), total_to_charge - already_charged)
        remaining_artisan_credit = max(Decimal("0"), amount_dec - already_payed_artisan)
        remaining_platform_credit = max(Decimal("0"), fee_dec - already_payed_platform)

        if remaining_customer_charge == 0 and remaining_artisan_credit == 0 and remaining_platform_credit == 0:
            if str(p.status) != str(PaymentStatus.captured):
                p.status = PaymentStatus.captured
                db.add(p); db.commit()
            db.refresh(p)
            return _to_out(p)

        have = _wallet_sum(db, current.id)
        if have < remaining_customer_charge:
            try:
                p.status = getattr(PaymentStatus, "failed", "failed")
                meta = dict(getattr(p, "meta", {}) or {})
                meta.update({
                    "reason": "insufficient_wallet_funds",
                    "required_ngn": float(remaining_customer_charge),
                    "available_ngn": float(have),
                })
                p.meta = meta
                db.add(p); db.commit()
            except Exception:
                db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient wallet funds. Need ₦{remaining_customer_charge:.0f}, available ₦{have:.0f}.",
            )

        try:
            if remaining_customer_charge > 0:
                db.add(
                    WalletLedger(
                        user_id=current.id,
                        currency=p.currency,
                        entry_type=LedgerEntryType.charge,
                        amount=remaining_customer_charge,
                        reference=p.reference,
                        meta={
                            "reason": "customer_wallet_charge_remaining",
                            "fee_ngn": int(fee_dec),
                            "gross_charged_ngn": float(total_to_charge),
                            "payment_id": str(p.id),
                            "job_id": str(p.job_id) if p.job_id else None
                        },
                    )
                )

            if remaining_artisan_credit > 0:
                db.add(
                    WalletLedger(
                        user_id=p.artisan_id,
                        currency=p.currency,
                        entry_type=LedgerEntryType.payout,
                        amount=remaining_artisan_credit,
                        reference=p.reference,
                        meta={"reason": "artisan_wallet_credit_remaining", "payment_id": str(p.id)},
                    )
                )

            if remaining_platform_credit > 0:
                db.add(
                    WalletLedger(
                        user_id=platform_user.id,
                        currency=p.currency,
                        entry_type=LedgerEntryType.payout,
                        amount=remaining_platform_credit,
                        reference=p.reference,
                        meta={"reason": "platform_wallet_fee_customer_remaining", "payment_id": str(p.id)},
                    )
                )

            p.status = PaymentStatus.captured
            meta = dict(getattr(p, "meta", {}) or {})
            meta["fixion_wallet_fee_ngn"] = int(fee_dec)
            meta["gross_charged_ngn"] = float(total_to_charge)
            p.meta = meta
            db.add(p)
            db.commit()
            db.refresh(p)

        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Wallet fee application failed")

    return _to_out(p)


# ---------- receipt ----------
@router.get("/receipt/{payment_id}", response_model=PaymentOut, responses={
    403: {"description": "Forbidden – not your payment"},
    404: {"description": "Payment not found"},
})
def payment_receipt(
    p: Payment = Depends(require_payment_access_by_path),
    db: Session = Depends(get_db)    # <— centralized guard
):
    return _to_out(p)


# ---------- history (customer) ----------
@router.get("/history", response_model=PaymentHistoryOut)
def payment_history(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    q = (
        db.query(Payment)
        .filter(Payment.customer_id == current.id)
        .order_by(Payment.created_at.desc())
    )
    total = q.count()
    rows = q.limit(limit).offset(offset).all()

    return PaymentHistoryOut(
        items=[
            PaymentHistoryItem(
                id=str(p.id),
                reference=p.reference,
                status=str(p.status),
                method=str(p.method),
                amount=p.amount,
                currency=p.currency,
                created_at=p.created_at.isoformat(),
            )
            for p in rows
        ],
        total=total,
    )


# ---------- Paystack initialize (to get authorization_url) ----------
@router.post("/paystack/initialize")
async def paystack_initialize(
    payment_id: str = Query(..., description="UUID of an existing Payment created via /payments/checkout"),
    db: Session = Depends(get_db),
    current: User = Depends(require_verified_contact),
):
    try:
        pid = uuid.UUID(payment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payment_id")
    pmt = db.get(Payment, pid)
    if not pmt:
        raise HTTPException(status_code=404, detail="Payment not found")

    # payer or admin
    if str(getattr(current, "role", "")) != "admin" and current.id != pmt.customer_id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if str(pmt.method) != str(PaymentMethod.card):
        raise HTTPException(status_code=400, detail="Only card payments can be initialized")
    if pmt.currency != "NGN":
        raise HTTPException(status_code=400, detail="Only NGN supported in this initializer")

    secret = PAYSTACK_SECRET or os.getenv("PAYSTACK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")

    amount_with_fee = float(pmt.amount) + float(FEE_CUSTOMER_NGN)
    amount_kobo = int(round(amount_with_fee * 100))
    payload = {
        "email": current.email,
        "amount": amount_kobo,
        "reference": pmt.reference,
        "metadata": {
            "payment_id": str(pmt.id),
            "job_id": str(pmt.job_id) if pmt.job_id else None,
            "artisan_id": str(pmt.artisan_id) if pmt.artisan_id else None,
        },
    }
    headers = {"Authorization": f"Bearer {secret}", "Content-Type": "application/json"}

    transport = AsyncHTTPTransport(retries=2)
    async with AsyncClient(timeout=20.0, http2=False, transport=transport) as client:
        rsp = await client.post("https://api.paystack.co/transaction/initialize", json=payload, headers=headers)
        if rsp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Paystack init failed: {rsp.text}")
        data = rsp.json().get("data") or {}
        auth_url = data.get("authorization_url")
        if not auth_url:
            raise HTTPException(status_code=502, detail="authorization_url missing from Paystack response")

    return {
        "reference": pmt.reference,
        "authorization_url": auth_url,
        "message": "Open authorization_url to complete payment.",
    }


# Paystack verify (optional/manual fallback)
@router.get("/paystack/verify/{reference}")
async def paystack_verify(
    reference: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """
    Manually verify a Paystack charge by its reference.
    Visibility: payer (customer), artisan on the same payment, or admin.
    """
    secret = PAYSTACK_SECRET or os.getenv("PAYSTACK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")

    # Locate the payment by reference
    pmt = db.query(Payment).filter(Payment.reference == reference).first()
    if not pmt:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Visibility: payer, artisan, or admin
    is_admin = str(getattr(current, "role", "")).lower().endswith("admin")
    if not is_admin and current.id not in (pmt.customer_id, pmt.artisan_id):
        raise HTTPException(status_code=403, detail="Not allowed")

    headers = {"Authorization": f"Bearer {secret}"}

    # Force HTTP/1.1 + small retry (Windows TLS quirk mitigation)
    transport = AsyncHTTPTransport(retries=2)
    async with AsyncClient(timeout=15.0, http2=False, transport=transport) as client:
        rsp = await client.get(f"https://api.paystack.co/transaction/verify/{reference}", headers=headers)
        if rsp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Paystack verify failed: {rsp.text}")
        body = rsp.json()
        status = (body.get("data") or {}).get("status")

    if status == "success":
        # Idempotently capture + credit artisan (full amount)
        _credit_artisan_if_needed(db, pmt, event="verify")
        # Optional: record fee meta for admin reports
        try:
            meta = dict(getattr(pmt, "meta", {}) or {})
            meta["fixion_customer_fee_ngn"] = int(FEE_CUSTOMER_NGN)
            meta["gross_charged_ngn"] = float(pmt.amount) + float(FEE_CUSTOMER_NGN)
            pmt.meta = meta
            db.add(pmt); db.commit()
        except Exception:
            db.rollback()
        return {"status": "captured", "reference": reference}

    return {"status": status or "unknown", "reference": reference}

# Paystack transfer events (for payouts)
def handle_paystack_transfer_events(event: str, data: dict, db: Session):
    """
    Processes transfer.success / transfer.failed / transfer.reversed.
    On success we:
      - DEBIT artisan by FULL payout amount (requested)  [NEGATIVE ledger]
      - CREDIT Fixion platform by ₦10 (payout fee)       [POSITIVE ledger]
    """
    if event not in ("transfer.success", "transfer.failed", "transfer.reversed"):
        return {"status": "ignored"}

    transfer_code = data.get("transfer_code")
    reference = data.get("reference")

    q = db.query(Payout)
    if reference:
        q = q.filter(Payout.reference == reference)
    elif transfer_code:
        q = q.filter(Payout.transfer_code == transfer_code)
    payout = q.first()

    if not payout:
        return {"status": "ok", "note": "payout not found"}

    if event == "transfer.success":
        payout.status = "success"

        exists = db.query(WalletLedger).filter(
            WalletLedger.user_id == payout.user_id,
            WalletLedger.entry_type == LedgerEntryType.withdrawal,
            WalletLedger.reference == payout.reference,
        ).first()
        if not exists:
            db.add(
                WalletLedger(
                    user_id=payout.user_id,
                    entry_type=LedgerEntryType.withdrawal,
                    amount=Decimal(str(payout.amount)) * Decimal("-1"),
                    currency=payout.currency,
                    reference=payout.reference,
                    meta={"provider": "paystack", "transfer_code": payout.transfer_code, "reason": "bank_payout_debit"},
                )
            )

        try:
            platform_user = _get_platform_user(db)
            db.add(
                WalletLedger(
                    user_id=platform_user.id,
                    entry_type=LedgerEntryType.payout,
                    amount=Decimal(str(FEE_PAYOUT_NGN)),
                    currency=payout.currency,
                    reference=payout.reference,
                    meta={"provider": "paystack", "transfer_code": payout.transfer_code, "reason": "platform_fee_payout"},
                )
            )
        except Exception:
            pass

    else:
        payout.status = "failed"

    db.add(payout)
    db.commit()
    return {"status": "ok"}


# Paystack webhook
@router.post("/webhook")
async def paystack_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_paystack_signature: str | None = Header(default=None, convert_underscores=False),
):
    raw = await request.body()
    sig = (x_paystack_signature or "").strip()

    if not PAYSTACK_SECRET:
        request.state.log_extra = {"webhook": True, "reason": "no_secret"}
        return {"status": "ignored", "reason": "PAYSTACK_SECRET not set"}

    expected = hmac.new(PAYSTACK_SECRET.encode("utf-8"), raw, hashlib.sha512).hexdigest()
    if not sig or not hmac.compare_digest(sig, expected):
        # 401 for unauthorized sender (clearer than 400)
        raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        payload = json.loads(raw.decode("utf-8") if raw else "{}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event = payload.get("event") or ""
    data = payload.get("data") or {}
    reference = data.get("reference")
    event_id = str(data.get("id") or reference or "")

    if event.startswith("transfer."):
        try:
            return handle_paystack_transfer_events(event, data, db)
        except Exception:
            db.rollback()
            return {"status": "ok", "note": "transfer handler error"}

    if not reference:
        return {"status": "ok", "note": "no reference"}

    pmt = (
        db.query(Payment)
        .filter(Payment.reference == reference)
        .with_for_update()
        .first()
    )
    if not pmt:
        request.state.log_extra = {"unknown_reference": reference}
        return {"status": "ok", "note": "unknown reference"}

    # Idempotency on Paystack event id
    if event_id:
        seen = (
            db.query(IdempotencyKey)
            .filter(
                IdempotencyKey.user_id == pmt.customer_id,
                IdempotencyKey.scope == "paystack:webhook",
                IdempotencyKey.key == event_id,
            )
            .first()
        )
        if seen:
            return {"status": "ok", "idempotent": True}

    if event == "charge.success":
        try:
            if hasattr(pmt, "signature_verified"):
                pmt.signature_verified = True
                db.add(pmt)
                db.commit()

            _credit_artisan_if_needed(db, pmt, event="webhook")

            meta = dict(getattr(pmt, "meta", {}) or {})
            meta["fixion_customer_fee_ngn"] = int(FEE_CUSTOMER_NGN)
            meta["gross_charged_ngn"] = float(pmt.amount) + float(FEE_CUSTOMER_NGN)
            pmt.meta = meta
            db.add(pmt)
            db.commit()

            if event_id:
                db.add(
                    IdempotencyKey(
                        user_id=pmt.customer_id,
                        scope="paystack:webhook",
                        key=event_id,
                    )
                )
                db.commit()

        except Exception:
            db.rollback()
            return {"status": "ok", "note": "charge.success handler error"}

    return {"status": "ok", "idempotent": False}
