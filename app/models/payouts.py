# app/models/payouts.py
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint, Index, Boolean, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid

class PayoutRecipient(Base):
    __tablename__ = "payout_recipients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(32), nullable=False, default="paystack")
    recipient_code = Column(String(64), nullable=False)     # from Paystack
    bank_code = Column(String(16), nullable=False)
    bank_name = Column(String(128), nullable=False)
    account_last4 = Column(String(4), nullable=False)       # do not store full acct no
    account_name = Column(String(255), nullable=True)       # optional display
    currency = Column(String(3), nullable=False, default="NGN")
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User")
    __table_args__ = (
        UniqueConstraint("user_id", "provider", name="uq_payout_recipient_user_provider"),
        Index("ix_payout_recipient_active", "active"),
    )

class Payout(Base):
    __tablename__ = "payouts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="NGN")
    status = Column(String(32), nullable=False, default="pending")  # pending|processing|success|failed
    reference = Column(String(64), nullable=False)                  # our idempotency key
    transfer_code = Column(String(64), nullable=True)               # Paystack transfer code
    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User")
    __table_args__ = (
        UniqueConstraint("reference", name="uq_payout_reference"),
        Index("ix_payout_status", "status"),
        Index("ix_payout_created", "created_at"),
    )
