# app/models/category.py
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin

class ServiceCategory(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "service_categories"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(255), default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
