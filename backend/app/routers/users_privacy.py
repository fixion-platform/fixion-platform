# app/routers/users_privacy.py
from __future__ import annotations

from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import User, Job
from app.models.payments import Payment, WalletLedger
from app.models.enums import LedgerEntryType, PaymentMethod, PaymentStatus
from app.auth_utils import get_current_user

# Additional imports to fully disable a deleted account.  When a user
# deletes their account we not only anonymize them but also revoke
# any outstanding refresh tokens, revoke active sessions, and change
# their password to a random value.  This prevents the user from
# authenticating again with previously issued credentials.
from app.services.auth_service import (
    revoke_all_refresh_tokens_for_user,
    revoke_all_sessions_for_user,
    hash_password,
)
import uuid

router = APIRouter(prefix="/users", tags=["Users"])

# helpers

def _wallet_balance(db: Session, user_id: UUID) -> Decimal:
    """Compute wallet balance using entry_type to imply sign; amounts are stored POSITIVE."""
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

    return Decimal(str(raw or 0))

# response schemas (kept light & PII-safe)

class ExportPayment(BaseModel):
    id: UUID
    reference: str
    amount: float
    currency: str
    status: PaymentStatus
    method: PaymentMethod
    created_at: str

    class Config:
        use_enum_values = True

class ExportJob(BaseModel):
    id: UUID
    status: str
    created_at: str
    customer_id: Optional[UUID] = None
    artisan_id: Optional[UUID] = None

class ExportUser(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: str

class ExportPayload(BaseModel):
    user: ExportUser
    wallet: dict
    payments: List[ExportPayment]
    jobs: List[ExportJob]

class Message(BaseModel):
    message: str

# NDPR: export my data

@router.get("/export", response_model=ExportPayload, summary="Export my account data (NDPR)")
def export_me(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    # base user payload (avoid sensitive fields like phone/NIN)
    user_payload = ExportUser(
        id=current.id,
        email=current.email,
        full_name=current.full_name,
        role=str(current.role),
        is_active=current.is_active,
        created_at=current.created_at.isoformat() if getattr(current, "created_at", None) else "",
    )

    # wallet
    bal = float(_wallet_balance(db, current.id))
    wallet_payload = {"balance": bal}

    # payments (limit to 1000 for safety)
    payments_q = (
        db.query(Payment)
        .filter((Payment.customer_id == current.id) | (Payment.artisan_id == current.id))
        .order_by(Payment.created_at.desc())
        .limit(1000)
        .all()
    )
    payments_payload = [
        ExportPayment(
            id=p.id,
            reference=p.reference,
            amount=float(p.amount),
            currency=p.currency,
            status=p.status,
            method=p.method,
            created_at=p.created_at.isoformat() if getattr(p, "created_at", None) else "",
        )
        for p in payments_q
    ]

    # jobs (bookings)
    jobs_q = (
        db.query(Job)
        .filter((Job.customer_id == current.id) | (Job.artisan_id == current.id))
        .order_by(Job.created_at.desc())
        .limit(1000)
        .all()
    )
    jobs_payload = [
        ExportJob(
            id=j.id,
            status=str(j.status),
            created_at=j.created_at.isoformat() if getattr(j, "created_at", None) else "",
            customer_id=j.customer_id,
            artisan_id=j.artisan_id,
        )
        for j in jobs_q
    ]

    return ExportPayload(
        user=user_payload,
        wallet=wallet_payload,
        payments=payments_payload,
        jobs=jobs_payload,
    )

# NDPR: delete/anonymize my account

@router.delete("/me", response_model=Message, summary="Delete/anonymize my account (NDPR)")
def delete_me(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """
    Soft-delete + anonymize to preserve referential integrity:
    - deactivate & block user
    - scrub PII fields that exist (phone, nin, full_name)
    - keep foreign keys for jobs/payments history
    """
    # Optional guard: prevent deletion while money is in wallet
    bal = _wallet_balance(db, current.id)
    if bal > 0:
        raise HTTPException(status_code=400, detail="Please withdraw your wallet balance before deleting your account.")

    # Anonymize minimal PII
    # Only set attributes if they exist on the model, to avoid AttributeError
    if hasattr(current, "full_name"):
        current.full_name = "Deleted User"
    if hasattr(current, "phone_number"):
        setattr(current, "phone_number", None)
    if hasattr(current, "nin"):
        setattr(current, "nin", None)
    if hasattr(current, "address"):
        setattr(current, "address", None)

    # Deactivate/block
    if hasattr(current, "is_active"):
        current.is_active = False
    if hasattr(current, "is_blocked"):
        current.is_blocked = True
    # After deactivating the account, revoke all existing refresh tokens and
    # sessions to prevent any previously issued tokens from being used.  Also
    # randomize the user's password so that credentials cannot be reused.
    try:
        revoke_all_refresh_tokens_for_user(db, current.id)
        revoke_all_sessions_for_user(db, current.id)
    except Exception:
        # best-effort; do not block account deletion on errors here
        pass

    try:
        # Overwrite the password hash with a random one to further prevent login.
        current.password_hash = hash_password(uuid.uuid4().hex)
    except Exception:
        pass

    db.add(current)
    db.commit()

    return Message(message="Your account has been anonymized and deactivated. This action cannot be undone.")
