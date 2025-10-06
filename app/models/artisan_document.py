# app/models/artisan_document.py
from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.user import User  # Import the User class


class ArtisanDocument(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "artisan_documents"

    user_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    original_filename: Mapped[str] = mapped_column(String(255))
    stored_filename: Mapped[str] = mapped_column(String(255))

    user: Mapped["User"] = relationship("User", back_populates="documents")
