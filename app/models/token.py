# app/models/token.py
from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, Enum, ForeignKey, DateTime, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import TokenPurpose
from app.models.user import User  # Import the User class

class RefreshToken(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    jti: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    token_hash: Mapped[str] = mapped_column(String(255))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User")
    __table_args__ = (Index("ix_refresh_user_valid", "user_id", "revoked"),)

class EmailPhoneToken(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "email_phone_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    purpose: Mapped[TokenPurpose] = mapped_column(Enum(TokenPurpose, name="token_purpose"), index=True)
    token_hash: Mapped[str] = mapped_column(String(255))
    target: Mapped[str] = mapped_column(String(255))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User")
    __table_args__ = (UniqueConstraint("user_id", "purpose", "target", name="uq_email_phone_token_per_target"),)
