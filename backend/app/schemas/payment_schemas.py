"""
Schemas for payment and wallet operations in the Fixion platform.

These models define the structure for initiating payments, deposits, withdrawals,
and retrieving receipts.
"""

from __future__ import annotations
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict
from decimal import Decimal

from uvicorn import Config

class IdempotentHeaders(BaseModel):
    idempotency_key: Optional[str] = Field(default=None, description="Header: Idempotency-Key")

class CheckoutIn(BaseModel):
    job_id: Optional[str] = None
    artisan_user_id: Optional[str] = None
    amount: Decimal
    currency: str = "NGN"
    method: str  # "wallet" | "card" | "bank_transfer"
    description: Optional[str] = None
    meta: Dict = {}

class PaymentOut(BaseModel):
    id: str
    reference: str
    status: str
    method: str
    amount: Decimal
    currency: str
    job_id: Optional[str] = None
    artisan_user_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class WalletBalanceOut(BaseModel):
    currency: str
    available: Decimal

    model_config = ConfigDict(from_attributes=True)

class WalletDepositIn(BaseModel):
    amount: Decimal
    currency: str = "NGN"
    reference: Optional[str] = None
    meta: Dict = {}

class WalletWithdrawIn(BaseModel):
    amount: Decimal
    currency: str = "NGN"
    destination_bank: Optional[str] = None
    destination_account: Optional[str] = None
    meta: Dict = {}

class PaymentHistoryItem(BaseModel):
    id: str
    reference: str
    status: str
    method: str
    amount: Decimal
    currency: str
    created_at: str

class PaymentHistoryOut(BaseModel):
    items: List[PaymentHistoryItem]
    total: int

    model_config = ConfigDict(from_attributes=True)

class Message(BaseModel):
    message: str
