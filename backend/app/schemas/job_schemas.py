from __future__ import annotations
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator

from app.security.sanitize import clean_free_text

class BookJobIn(BaseModel):
    service_category: str = Field(..., min_length=2, max_length=60)
    location: str = Field(..., min_length=2, max_length=120)
    description: str = Field(..., min_length=1, max_length=600)
    scheduled_at: Optional[datetime] = None
    artisan_user_id: Optional[str] = Field(None, description="If customer pre-selects an artisan")

    @field_validator("service_category")
    @classmethod
    def _v_cat(cls, v: str) -> str:
        return clean_free_text(v, 60)

    @field_validator("location")
    @classmethod
    def _v_loc(cls, v: str) -> str:
        return clean_free_text(v, 120)

    @field_validator("description")
    @classmethod
    def _v_desc(cls, v: str) -> str:
        return clean_free_text(v, 600)

class JobOut(BaseModel):
    id: str
    job_number: int
    customer_id: str | None
    artisan_id: str | None
    service_category: str
    location: str
    description: str
    status: str
    scheduled_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class JobListOut(BaseModel):
    jobs: List[JobOut]
    total: int
    model_config = ConfigDict(from_attributes=True)

class JobRespondIn(BaseModel):
    job_id: str
    accept: bool

class JobStatusUpdateIn(BaseModel):
    new_status: str

class JobNoteIn(BaseModel):
    note: str = Field(..., min_length=1, max_length=600)

    @field_validator("note")
    @classmethod
    def _v_note(cls, v: str) -> str:
        return clean_free_text(v, 600)

class JobNoteOut(BaseModel):
    id: str
    job_id: str
    author_id: str | None
    note: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReviewIn(BaseModel):
    rating: int = Field(ge=1, le=5)
    review: str = Field(default="", max_length=600)

    @field_validator("review")
    @classmethod
    def _v_review(cls, v: str) -> str:
        return clean_free_text(v, 600)

class Message(BaseModel):
    message: str
