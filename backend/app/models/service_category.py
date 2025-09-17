# app/models/artisan.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Service_Category(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    service_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)