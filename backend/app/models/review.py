# app/models/review.py
import uuid
from sqlalchemy import ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.job import Job  # Import the Job class
from app.models.user import User  # Import the User class

class Review(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "reviews"

    job_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    artisan_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1–5
    review: Mapped[str] = mapped_column(Text, default="")

    job: Mapped["Job"] = relationship("Job")
    customer: Mapped["User"] = relationship("User", foreign_keys=[customer_id])
    artisan: Mapped["User"] = relationship("User", foreign_keys=[artisan_id])

    __table_args__ = (
        UniqueConstraint("job_id", "customer_id", name="uq_review_one_per_job_by_customer"),
    )
