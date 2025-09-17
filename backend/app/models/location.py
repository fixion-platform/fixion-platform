# app/models/user_location.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class UserLocation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", nullable=False, unique=True)
    latitude: str
    longitude: str
    city: str
    state: str
    country: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
