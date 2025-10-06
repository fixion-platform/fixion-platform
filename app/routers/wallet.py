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
