# models/user.py

from __future__ import annotations
from enum import unique
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.artisan_document import ArtisanDocument

from sqlalchemy import String, Boolean, Enum, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import UserRole


class User(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "users"

    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    
    phone_number: Mapped[Optional[str]] = mapped_column(Text, unique=True, index=True)
    
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        default=UserRole.customer,
        index=True,
    )

    nin: Mapped[Optional[str]] = mapped_column(Text)
    
    location: Mapped[Optional[str]] = mapped_column(String(255))
    service_preferences: Mapped[Optional[dict]] = mapped_column(JSONB, default=dict)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Disambiguate FK for this one-to-one
    artisan_profile = relationship(
        "ArtisanProfile",
        back_populates="user",
        uselist=False,
        primaryjoin="User.id==ArtisanProfile.user_id",
    )

    wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    documents: Mapped[list["ArtisanDocument"]] = relationship(
        "ArtisanDocument", back_populates="user", cascade="all, delete-orphan"
    )
