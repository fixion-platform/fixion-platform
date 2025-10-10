# app/models/announcement.py
import uuid
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.user import User  # Import the User class

class Announcement(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "announcements"

    title: Mapped[str] = mapped_column(String(140))
    message: Mapped[str] = mapped_column(String(1000))
    created_by_admin_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_by_admin: Mapped["User"] = relationship("User")
