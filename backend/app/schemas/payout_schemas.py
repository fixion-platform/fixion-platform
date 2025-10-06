from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from decimal import Decimal

class CreateRecipientIn(BaseModel):
    bank_code: str
    account_number: str = Field(min_length=6, max_length=20)
    account_name: Optional[str] = None  # optional; Paystack may resolve name

class RecipientOut(BaseModel):
    id: str
    provider: str
    bank_code: str
    bank_name: str
    account_last4: str
    account_name: Optional[str]
    currency: str
    active: bool

    model_config = ConfigDict(from_attributes=True)

class PayoutRequestIn(BaseModel):
    amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2)
    reason: Optional[str] = None

class PayoutOut(BaseModel):
    id: str
    user_id: str
    amount: Decimal
    currency: str
    status: str
    reference: str
    transfer_code: Optional[str] = None
    reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
