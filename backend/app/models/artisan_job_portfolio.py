# app/models/artisan.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Artisan_Jobs(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    artisan_id: UUID = Field(foreign_key="artisan.id", nullable=False, unique=True)
    job_title: str
    job_url: str
    description: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)