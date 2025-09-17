from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class Job_Order(SQLModel, table=True):
  id: UUID = Field(default_factory=uuid4, primary_key=True)
  customer_id: UUID = Field(foreign_key="customer.id", nullable=False)
  artisan_id: UUID = Field(foreign_key="artisan.id", nullable=False)
  category: str
  description: str
  booking_date: datetime
  completion_date: datetime
  completion_status: str
  created_at: datetime = Field(default_factory=datetime.utcnow)
  updated_at: datetime = Field(default_factory=datetime.utcnow)

