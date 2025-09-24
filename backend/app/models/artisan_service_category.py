# app/models/artisan.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Artisan_Service_Category(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    artisan_id: UUID = Field(foreign_key="artisan.id", nullable=False, unique=True)
    category_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)