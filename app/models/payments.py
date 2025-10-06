# app/models/payments.py
from __future__ import annotations
import uuid
from decimal import Decimal
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    String, ForeignKey, Numeric, Enum, JSON, Index, UniqueConstraint,
    DateTime, func, Boolean
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.user import User             # adjust path if needed
from app.models.job import Job               # adjust path if needed
from app.models.enums import PaymentMethod, PaymentStatus, LedgerEntryType

# ---------------- Mixins (local to avoid import cycles) ----------------

class LocalUUIDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

class LocalTimeStampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

# ------------------------------ IdempotencyKey ------------------------------

class IdempotencyKey(LocalUUIDMixin, LocalTimeStampMixin, Base):
    __tablename__ = "idempotency_keys"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    scope: Mapped[str] = mapped_column(String(64), index=True)  # wallet.deposit / payments.checkout
    key: Mapped[str] = mapped_column(String(128))

    __table_args__ = (
        UniqueConstraint("user_id", "scope", "key", name="uq_idem_user_scope_key"),
        {"extend_existing": True},
    )

# -------------------------------- WalletLedger --------------------------------

class WalletLedger(LocalUUIDMixin, LocalTimeStampMixin, Base):
    __tablename__ = "wallet_ledger"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    currency: Mapped[str] = mapped_column(String(3), default="NGN")
    entry_type: Mapped[LedgerEntryType] = mapped_column(Enum(LedgerEntryType), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2))  # positive; sign implied by entry_type
    reference: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)

    user: Mapped["User"] = relationship("User")

# helpful index for balance queries
Index("ix_wallet_ledger_user_created", WalletLedger.user_id, WalletLedger.created_at.desc())

# ----------------------------------- Payment -----------------------------------

# app/models/payments.py (corrected snippet)
class Payment(LocalUUIDMixin, LocalTimeStampMixin, Base):
    __tablename__ = "payments"

    job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL"), index=True
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    artisan_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    currency: Mapped[str] = mapped_column(String(3), default="NGN")

    method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod), index=True)
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), index=True, default=PaymentStatus.initiated)

    reference: Mapped[str] = mapped_column(String(64), index=True)         # internal reference
    transaction_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("transactions.id", ondelete="SET NULL"), nullable=True, index=True
    )

    provider: Mapped[Optional[str]] = mapped_column(String(32))            # "paystack", "flutterwave"
    provider_ref: Mapped[Optional[str]] = mapped_column(String(64), index=True)  # reference from provider
    signature_verified: Mapped[bool] = mapped_column(Boolean, default=False)     # new field added

    meta: Mapped[dict] = mapped_column(JSON, default=dict)

    customer: Mapped["User"] = relationship("User", foreign_keys=[customer_id])
    artisan:  Mapped["User"] = relationship("User", foreign_keys=[artisan_id])
    job:      Mapped["Job"]  = relationship("Job")

    __table_args__ = (
        UniqueConstraint("reference", name="uq_payments_reference"),
    )
