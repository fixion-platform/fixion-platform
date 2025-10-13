# models/artisan.py

from __future__ import annotations
import uuid
from typing import Optional

from sqlalchemy import String, Integer, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import VerificationStatus
from app.models.user import User 

class ArtisanProfile(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "artisan_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )

    service_category: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    service_description: Mapped[Optional[str]] = mapped_column(String(500))
    years_of_experience: Mapped[Optional[int]] = mapped_column(Integer, default=0)

    work_hours: Mapped[Optional[str]] = mapped_column(String(120))
    service_location: Mapped[Optional[str]] = mapped_column(String(120))
    base_price_kobo: Mapped[Optional[int]] = mapped_column(Integer, index=True, default=None)
    
    bank_name: Mapped[Optional[str]] = mapped_column(String(80))
    account_number: Mapped[Optional[str]] = mapped_column(String(20))
    account_name: Mapped[Optional[str]] = mapped_column(String(120))

    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status"),
        default=VerificationStatus.pending, index=True
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(255))
    verified_by_admin_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )

    # explicit targets
    user: Mapped["User"] = relationship(
        "User",
        back_populates="artisan_profile",
        foreign_keys=[user_id],
    )
    verified_by_admin: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[verified_by_admin_id],
    )
