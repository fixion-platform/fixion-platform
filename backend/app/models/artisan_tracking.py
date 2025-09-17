# app/models/artisan.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Order_Tracking(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    job_order_id: UUID = Field(foreign_key="artisan.id", nullable=False, unique=True)
    order_status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)