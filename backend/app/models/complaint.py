# app/models/complaint.py
from __future__ import annotations
import uuid
from typing import Optional
from sqlalchemy import Text, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import ComplaintStatus, DisputeStatus
from app.models.user import User  # Import the User class
from app.models.job import Job  # Import the Job class

class Complaint(UUIDMixin, TimeStampMixin, Base):
    
    __tablename__ = "complaints"
    job_id: Mapped[Optional[uuid.UUID]] = mapped_column(PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL"), index=True)
    raised_by_id: Mapped[uuid.UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True)
    title: Mapped[str] = mapped_column(String(120))             # Added title field for complaint subject
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[ComplaintStatus] = mapped_column(Enum(ComplaintStatus, name="complaint_status"), default=ComplaintStatus.open)
    resolved_by_admin_id: Mapped[Optional[uuid.UUID]] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text)
    

    job: Mapped["Job"] = relationship("Job")
    raised_by: Mapped["User"] = relationship("User", foreign_keys=[raised_by_id])
    resolved_by_admin: Mapped[Optional["User"]] = relationship("User", foreign_keys=[resolved_by_admin_id])

class Dispute(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "disputes"

    job_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL"), index=True
    )
    opened_by_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    reason: Mapped[str] = mapped_column(Text)
    status: Mapped[DisputeStatus] = mapped_column(Enum(DisputeStatus, name="dispute_status"), default=DisputeStatus.open)
    resolved_by_admin_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text)

    job: Mapped["Job"] = relationship("Job")
    opened_by: Mapped["User"] = relationship("User", foreign_keys=[opened_by_id])
    resolved_by_admin: Mapped[Optional["User"]] = relationship("User", foreign_keys=[resolved_by_admin_id])
