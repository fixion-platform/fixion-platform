# app/routers/wallet.py
from __future__ import annotations
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.db.database import get_db
from app.auth_utils import get_current_user, require_verified_contact, require_artisan_approved
from app.models import User
from app.schemas.payment_schemas import WalletBalanceOut, WalletDepositIn, WalletWithdrawIn, Message
from app.services.payments_service import wallet_balance, wallet_deposit, wallet_withdraw

from httpx import AsyncClient, AsyncHTTPTransport
from app.config import PAYSTACK_SECRET
from app.models.payments import WalletLedger, IdempotencyKey
from app.models.enums import LedgerEntryType
import uuid

router = APIRouter(prefix="/wallet", tags=["Wallet"])

@router.get("/balance", response_model=WalletBalanceOut)
def get_balance(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    bal = wallet_balance(db, str(current.id), "NGN")
    return WalletBalanceOut(currency="NGN", available=bal)

@router.post("/deposit", response_model=Message)
def deposit(payload: WalletDepositIn, db: Session = Depends(get_db), current: User = Depends(require_verified_contact), 
            idempotency_key: str | None = Header(default=None, alias="Idempotency-Key")):
    try:
        wallet_deposit(db, current, payload.amount, currency=payload.currency, reference=payload.reference, meta=payload.meta, idem_key=idempotency_key)
        db.commit()
        return {"message": "Deposit recorded"}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/withdraw", response_model=Message)
def withdraw(payload: WalletWithdrawIn, db: Session = Depends(get_db), current: User = Depends(require_verified_contact),
             idempotency_key: str | None = Header(default=None, alias="Idempotency-Key")):
    try:
        wallet_withdraw(db, current, payload.amount, currency=payload.currency, meta=payload.meta, idem_key=idempotency_key)
        db.commit()
        return {"message": "Withdrawal request recorded"}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    




# Paystack wallet top-up endpoints
@router.post("/topup/paystack/init")
async def wallet_topup_init(
    amount: Decimal,  # NGN, e.g. 1000
    db: Session = Depends(get_db),
    current: User = Depends(require_verified_contact),
):
    """
    Create a Paystack transaction for wallet top-up.
    """
    if not PAYSTACK_SECRET:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    # Generate an internal reference for this top-up (also used at webhook)
    topup_ref = f"TOPUP-{uuid.uuid4().hex[:16].upper()}"

    payload = {
        "email": current.email,
        "amount": int(amount * 100),  # Paystack needs kobo
        "reference": topup_ref,
        "metadata": {
            "wallet_topup": True,
            "user_id": str(current.id),
            "currency": "NGN",
            "amount": float(amount),
        },
    }
    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET}", "Content-Type": "application/json"}

    transport = AsyncHTTPTransport(retries=2)
    async with AsyncClient(timeout=20.0, http2=False, transport=transport) as client:
        rsp = await client.post("https://api.paystack.co/transaction/initialize", json=payload, headers=headers)
        if rsp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Paystack init failed: {rsp.text}")
        data = rsp.json().get("data") or {}
        auth_url = data.get("authorization_url")
        if not auth_url:
            raise HTTPException(status_code=502, detail="authorization_url missing from Paystack response")

    return {"reference": topup_ref, "authorization_url": auth_url}

# Webhook endpoint is in app/routers/webhooks.py
@router.get("/topup/paystack/verify/{reference}")
async def wallet_topup_verify(
    reference: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """
    Manual verify fallback; webhook is the primary path.
    If success and not already credited, credit the wallet.
    """
    if not PAYSTACK_SECRET:
        raise HTTPException(status_code=500, detail="PAYSTACK_SECRET not configured")

    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET}"}
    transport = AsyncHTTPTransport(retries=2)
    async with AsyncClient(timeout=15.0, http2=False, transport=transport) as client:
        rsp = await client.get(f"https://api.paystack.co/transaction/verify/{reference}", headers=headers)
        if rsp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Paystack verify failed: {rsp.text}")
        body = rsp.json()
        status = (body.get("data") or {}).get("status")
        meta = (body.get("data") or {}).get("metadata") or {}
        is_topup = bool(meta.get("wallet_topup"))
        user_id = meta.get("user_id")
        amount = Decimal(str(meta.get("amount") or "0"))

    if status == "success" and is_topup and user_id and amount > 0:
        # Idempotent credit if not already present
        exists = db.query(WalletLedger).filter(
            WalletLedger.reference == reference,
            WalletLedger.entry_type == LedgerEntryType.deposit,
        ).first()
        if not exists:
            db.add(
                WalletLedger(
                    user_id=uuid.UUID(user_id),
                    currency="NGN",
                    entry_type=LedgerEntryType.deposit,
                    amount=amount,
                    reference=reference,
                    meta={"reason": "wallet_topup_paystack_verify"},
                )
            )
            db.commit()
        return {"status": "credited", "reference": reference}

    return {"status": status or "unknown", "reference": reference}

