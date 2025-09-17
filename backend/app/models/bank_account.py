# app/models/artisan.py
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Bank_Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    artisan_id: UUID = Field(foreign_key="artisan.id", nullable=False, unique=True)
    account_number: str
    account_name: str
    bank_name: str
    bank_code: str
    created_at: datetime = Field(default_factory=datetime.utcnow)