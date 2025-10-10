# app/services/payments_service.py

from uuid import uuid4
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional

from sqlalchemy import func, select, case
from sqlalchemy.orm import Session

from app.models import User, Job
from app.models.payments import WalletLedger, Payment, IdempotencyKey
from app.models.enums import LedgerEntryType, PaymentMethod, PaymentStatus

# NEW: import platform fee settings
from app.config import FEE_WALLET_NGN, FEE_PAYOUT_NGN, PLATFORM_FEE_USER_EMAIL

REF_PREFIX = "FIX"


# helpers

def _new_ref() -> str:
    return f"{REF_PREFIX}-{uuid4().hex[:12].upper()}"

def _normalize_currency(code: Optional[str]) -> str:
    c = (code or "NGN").upper().strip()
    if len(c) != 3:
        raise ValueError("Invalid currency code (expected ISO-4217, e.g. NGN)")
    return c

def _quant(v: Decimal | int | float) -> Decimal:
    return Decimal(v).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def _ensure_artisan(user: Optional[User]) -> None:
    if not user:
        return
    # keep your original simple check
    if getattr(user, "role", None) != "artisan":
        raise ValueError("artisan_user_id must belong to an artisan")

def _ensure_distinct_parties(customer: User, artisan: Optional[User]) -> None:
    if artisan and str(customer.id) == str(artisan.id):
        raise ValueError("Customer and artisan cannot be the same account")

def _use_idempotency(db: Session, user_id: str, scope: str, key: Optional[str]) -> None:
    if not key:
        return
    exists = (
        db.query(IdempotencyKey)
        .filter(
            IdempotencyKey.user_id == user_id,
            IdempotencyKey.scope == scope,
            IdempotencyKey.key == key,
        )
        .first()
    )
    if exists:
        raise ValueError("Idempotency key already used")
    db.add(IdempotencyKey(user_id=user_id, scope=scope, key=key))
    db.flush()  # reserve the key within this txn


def _get_platform_user(db: Session) -> User:
    """Resolve the platform's fee account using PLATFORM_FEE_USER_EMAIL."""
    if not PLATFORM_FEE_USER_EMAIL:
        raise ValueError("PLATFORM_FEE_USER_EMAIL not configured")
    u = db.query(User).filter(User.email == PLATFORM_FEE_USER_EMAIL).first()
    if not u:
        raise ValueError("Platform fee user not found (check PLATFORM_FEE_USER_EMAIL)")
    return u


# wallet ops

def wallet_balance(db: Session, user_id: str, currency: str = "NGN") -> Decimal:
    """
    Compute wallet balance with a single aggregate query.
    Credits: deposit, payout, refund, adjust (added to balance)
    Debits:  charge, withdrawal (subtracted from balance)
    """
    currency = _normalize_currency(currency)

    credit_types = [LedgerEntryType.deposit, LedgerEntryType.payout, LedgerEntryType.refund, LedgerEntryType.adjust]
    debit_types  = [LedgerEntryType.charge, LedgerEntryType.withdrawal]

    stmt = (
        select(
            func.coalesce(
                func.sum(
                    case(
                        (WalletLedger.entry_type.in_(credit_types), WalletLedger.amount),
                        (WalletLedger.entry_type.in_(debit_types), -WalletLedger.amount),
                        else_=Decimal("0.00"),
                    )
                ),
                Decimal("0.00"),
            )
        )
        .where(
            WalletLedger.user_id == user_id,
            WalletLedger.currency == currency,
        )
    )
    (balance,) = db.execute(stmt).one()
    return _quant(balance or Decimal("0.00"))

def wallet_deposit(
    db: Session,
    user: User,
    amount: Decimal,
    currency: str = "NGN",
    reference: Optional[str] = None,
    meta: Optional[dict] = None,
    idem_key: Optional[str] = None,
) -> None:
    amount = _quant(amount)
    if amount <= 0:
        raise ValueError("Amount must be positive")
    currency = _normalize_currency(currency)

    _use_idempotency(db, str(user.id), "wallet.deposit", idem_key)
    db.add(
        WalletLedger(
            user_id=user.id,
            currency=currency,
            entry_type=LedgerEntryType.deposit,
            amount=amount,
            reference=reference or _new_ref(),
            meta=meta or {},
        )
    )

def wallet_withdraw(
    db: Session,
    user: User,
    amount: Decimal,
    currency: str = "NGN",
    meta: Optional[dict] = None,
    idem_key: Optional[str] = None,
) -> None:
    """
    Process a wallet withdrawal for any user.

    When an artisan withdraws from their wallet, a fixed service fee (₦10) is
    charged in addition to the withdrawal amount.  The fee is credited to
    the platform's fee account.  Non‑artisan users are not charged an
    additional fee.  The function records appropriate ledger entries and
    enforces idempotency via the provided key.
    """
    amount = _quant(amount)
    if amount <= 0:
        raise ValueError("Amount must be positive")
    currency = _normalize_currency(currency)

    # Determine if the withdrawing user is an artisan.  The role may be a
    # string ("artisan"), an Enum member, or another type, so normalise via
    # string comparison.
    try:
        from app.models.enums import UserRole
        role = getattr(user, "role", None)
        is_artisan = False
        if isinstance(role, UserRole):
            is_artisan = role == UserRole.artisan or role.name.lower() == "artisan"
        elif isinstance(role, str):
            is_artisan = role.lower() == "artisan"
        else:
            # fallback: compare the last segment after dot (for Enum as string)
            is_artisan = str(role).split(".")[-1].lower() == "artisan"
    except Exception:
        # if enums cannot be imported, assume not artisan
        is_artisan = False

    fee = _quant(Decimal(FEE_PAYOUT_NGN)) if is_artisan else Decimal("0.00")

    # Ensure the user has enough balance to cover the withdrawal and fee
    bal = wallet_balance(db, str(user.id), currency)
    total_required = amount + fee
    if bal < total_required:
        raise ValueError("Insufficient balance")

    # Idempotency guard
    _use_idempotency(db, str(user.id), "wallet.withdraw", idem_key)

    # Generate a single reference for all entries in this withdrawal
    ref = _new_ref()

    # Record the primary withdrawal (debit)
    db.add(
        WalletLedger(
            user_id=user.id,
            currency=currency,
            entry_type=LedgerEntryType.withdrawal,
            amount=amount,
            reference=ref,
            meta={"reason": "wallet_withdrawal", **(meta or {})},
        )
    )

    if is_artisan and fee > 0:
        # Charge the artisan an additional fee; debit their wallet
        db.add(
            WalletLedger(
                user_id=user.id,
                currency=currency,
                entry_type=LedgerEntryType.charge,
                amount=fee,
                reference=ref,
                meta={"reason": "withdrawal_fee_artisan"},
            )
        )
        # Credit the platform fee account with the fee
        platform_user = _get_platform_user(db)
        db.add(
            WalletLedger(
                user_id=platform_user.id,
                currency=currency,
                entry_type=LedgerEntryType.payout,
                amount=fee,
                reference=ref,
                meta={"reason": "platform_withdrawal_fee_artisan", "artisan_id": str(user.id)},
            )
        )


# checkout

def checkout(
    db: Session,
    customer: User,
    amount: Decimal,
    method: PaymentMethod,
    currency: str = "NGN",
    job: Optional[Job] = None,
    artisan: Optional[User] = None,
    meta: Optional[dict] = None,
    idem_key: Optional[str] = None,
) -> Payment:
    """
    - Wallet: immediate capture (debit customer, credit artisan if provided) + wallet fee ₦10 to platform.
    - Card/bank_transfer: stays 'initiated' for PSP to complete later.
    """
    amount = _quant(amount)
    if amount <= 0:
        raise ValueError("Amount must be positive")
    currency = _normalize_currency(currency)

    if method not in (PaymentMethod.wallet, PaymentMethod.card, PaymentMethod.bank_transfer):
        raise ValueError("Unsupported payment method")

    _ensure_artisan(artisan)
    _ensure_distinct_parties(customer, artisan)

    if job and artisan and str(job.artisan_id) != str(artisan.id):
        raise ValueError("artisan_user_id does not match the job's artisan")

    _use_idempotency(db, str(customer.id), "payments.checkout", idem_key)

    # Internal + provider references
    internal_ref = _new_ref()
    provider_ref = _new_ref() if method == PaymentMethod.wallet else None

    # NOTE: You do NOT have a transactions table/model now.
    # So never set a non-existent transaction_id; keep it None.
    tx_id = None

    provider = "wallet" if method == PaymentMethod.wallet else None

    pay = Payment(
        job_id=job.id if job else None,
        customer_id=customer.id,
        artisan_id=artisan.id if artisan else None,
        amount=amount,
        currency=currency,
        method=method,
        status=PaymentStatus.initiated,
        reference=internal_ref,
        meta=meta or {},
        provider=provider,
        provider_ref=provider_ref,
        transaction_id=tx_id,  # keep None unless you actually create a Transaction row
    )
    db.add(pay)
    db.flush()  # ensure pay.id & reference are available

    if method == PaymentMethod.wallet:
        # Enforce artisan presence for wallet flow (to move money peer-to-peer)
        if not artisan:
            raise ValueError("Wallet checkout requires an artisan or job")

        # Wallet fee (₦10) paid by customer; credited to platform
        fee = _quant(FEE_WALLET_NGN)
        platform_user = _get_platform_user(db)

        # Ensure funds first: need = amount + fee
        bal = wallet_balance(db, str(customer.id), currency)
        need = amount + fee
        if bal < need:
            raise ValueError("Insufficient wallet balance")

        # Idempotency: if any ledger already exists for this payment reference, do not double-write
        exists = db.query(WalletLedger.id).filter(WalletLedger.reference == pay.reference).first()
        if not exists:
            # debit customer for job amount
            db.add(
                WalletLedger(
                    user_id=customer.id,
                    currency=currency,
                    entry_type=LedgerEntryType.charge,   # debit
                    amount=amount,
                    reference=pay.reference,
                    meta={"payment_id": str(pay.id), **(meta or {})},
                )
            )
            # debit customer for wallet fee (₦10)
            db.add(
                WalletLedger(
                    user_id=customer.id,
                    currency=currency,
                    entry_type=LedgerEntryType.charge,   # debit
                    amount=fee,
                    reference=pay.reference,
                    meta={"reason": "wallet_fee_customer", "payment_id": str(pay.id), **(meta or {})},
                )
            )
            # credit artisan full amount
            db.add(
                WalletLedger(
                    user_id=artisan.id,
                    currency=currency,
                    entry_type=LedgerEntryType.payout,   # credit
                    amount=amount,
                    reference=pay.reference,
                    meta={
                        "payment_id": str(pay.id),
                        "job_id": str(job.id) if job else None,
                        **(meta or {}),
                    },
                )
            )
            # credit platform ₦10
            db.add(
                WalletLedger(
                    user_id=platform_user.id,
                    currency=currency,
                    entry_type=LedgerEntryType.payout,   # credit
                    amount=fee,
                    reference=pay.reference,
                    meta={"reason": "platform_wallet_fee_customer", "payment_id": str(pay.id)},
                )
            )

        pay.status = PaymentStatus.captured
        db.add(pay)

    # For card/bank_transfer, leave as initiated; PSP webhook will update later.
    return pay
