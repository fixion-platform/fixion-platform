# app/models/job.py
from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Enum, ForeignKey, Integer, Index, Text, DateTime, Identity
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from app.models.base import UUIDMixin, TimeStampMixin
from app.models.enums import JobStatus
from app.models.user import User  # Import the User class

class Job(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "jobs"

    job_number: Mapped[int] = mapped_column(Integer, Identity(start=1000), unique=True, index=True)

    customer_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    artisan_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    service_category: Mapped[str] = mapped_column(String(100), index=True)
    location: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)

    scheduled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status"), default=JobStatus.pending, index=True)

    meta: Mapped[dict] = mapped_column(JSONB, default=dict)

    customer: Mapped["User"] = relationship("User", foreign_keys=[customer_id])
    artisan: Mapped["User"] = relationship("User", foreign_keys=[artisan_id])

    photos: Mapped[List["JobPhoto"]] = relationship("JobPhoto", back_populates="job", cascade="all, delete-orphan")
    notes: Mapped[List["JobNote"]] = relationship("JobNote", back_populates="job", cascade="all, delete-orphan")
    status_history: Mapped[List["JobStatusHistory"]] = relationship("JobStatusHistory", back_populates="job", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_jobs_customer_status", "customer_id", "status"),
        Index("ix_jobs_artisan_status", "artisan_id", "status"),
    )

class JobPhoto(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "job_photos"

    job_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True
    )
    path: Mapped[str] = mapped_column(String(255))
    job: Mapped["Job"] = relationship("Job", back_populates="photos")

class JobNote(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "job_notes"

    job_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True
    )
    author_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    note: Mapped[str] = mapped_column(Text)

    job: Mapped["Job"] = relationship("Job", back_populates="notes")
    author: Mapped["User"] = relationship("User")

class JobStatusHistory(UUIDMixin, TimeStampMixin, Base):
    __tablename__ = "job_status_history"

    job_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True
    )
    old_status: Mapped[Optional[JobStatus]] = mapped_column(Enum(JobStatus, name="job_status"), nullable=True)
    new_status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status"), nullable=False)
    changed_by_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )

    job: Mapped["Job"] = relationship("Job", back_populates="status_history")
    changed_by: Mapped["User"] = relationship("User")
