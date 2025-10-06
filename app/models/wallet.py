# app/models/wallet.py
from __future__ import annotations
import uuid
from typing import List, Optional
from sqlalchemy import ForeignKey, Integer, String, Enum, UniqueConstraint, Index, Boolean
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import TransactionType, TransactionStatus
from app.models.user import User  # Import the User class
from app.models.job import Job  # Import the Job class

class Wallet(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "wallets"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )
    balance_kobo: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship("User", back_populates="wallet")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")

class Transaction(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "transactions"

    wallet_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("wallets.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    amount_kobo: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType, name="transaction_type"), index=True)
    status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus, name="transaction_status"), default=TransactionStatus.pending, index=True)

    reference: Mapped[str] = mapped_column(String(64), index=True)
    related_job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL")
    )
    meta: Mapped[dict] = mapped_column(JSONB, default=dict)

    wallet: Mapped["Wallet"] = relationship("Wallet", back_populates="transactions")
    user: Mapped["User"] = relationship("User")
    related_job: Mapped[Optional["Job"]] = relationship("Job")

    __table_args__ = (
        UniqueConstraint("reference", name="uq_transactions_reference"),
        Index("ix_transactions_user_type", "user_id", "type"),
    ) 

    

