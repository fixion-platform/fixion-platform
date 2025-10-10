# app/models/enums.py
import enum
from enum import Enum

class UserRole(str, enum.Enum):
    customer = "customer"
    artisan = "artisan"
    admin = "admin"

class VerificationStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class JobStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    on_the_way = "on_the_way"
    working = "working"
    completed = "completed"
    cancelled = "cancelled"

class TransactionType(str, enum.Enum):
    deposit = "deposit"
    withdrawal = "withdrawal"
    payment = "payment"
    refund = "refund"

class TransactionStatus(str, enum.Enum):
    pending = "pending"
    success = "success"
    failed = "failed"

class TokenPurpose(str, enum.Enum):
    refresh = "refresh"
    email_verify = "email_verify"
    phone_verify = "phone_verify"
    password_reset = "password_reset"

class ComplaintStatus(str, enum.Enum):
    open = "open"
    resolved = "resolved"

class DisputeStatus(str, enum.Enum):
    open = "open"
    resolved = "resolved"

class PaymentMethod(str, Enum):
    card = "card"
    wallet = "wallet"
    bank_transfer = "bank_transfer"

class PaymentStatus(str, Enum):
    initiated = "initiated"
    authorized = "authorized"
    captured = "captured"
    failed = "failed"
    refunded = "refunded"
    cancelled = "cancelled"

class LedgerEntryType(str, Enum):
    deposit = "deposit"
    withdrawal = "withdrawal"
    charge = "charge"          # debit customer wallet (e.g., checkout)
    payout = "payout"          # credit artisan wallet (job payout)
    refund = "refund"
    adjust = "adjust"    
