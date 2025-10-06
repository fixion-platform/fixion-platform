# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()


def _csv_list(value: str | None) -> list[str]:
    """Parse comma/space separated env values into a clean list."""
    if not value:
        return []
    parts = [p.strip() for p in value.split(",")]
    return [p for p in parts if p]


# Environment
# Signals to production:
# -- ENV=production -- APP_ENV=production  -- IS_PRODUCTION=true
_env_raw = (os.getenv("ENV") or os.getenv("APP_ENV") or "").strip().lower()
_is_prod_flag = os.getenv("IS_PRODUCTION", "").strip().lower() in {"1", "true", "yes"}

# If any flag says production, we consider it production
if _env_raw == "production" or _is_prod_flag:
    ENV = "production"
else:
    ENV = _env_raw or "development"

IS_PRODUCTION = ENV == "production"


# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:password@localhost:5432/fixion",
)


# Crypto / JWT
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

INACTIVITY_TIMEOUT_MINUTES = int(os.getenv("INACTIVITY_TIMEOUT_MINUTES", "30"))

# Dedicated refresh secret (ok to mirror SECRET_KEY in dev, use a distinct one in prod)
REFRESH_SECRET = os.getenv("REFRESH_SECRET", SECRET_KEY)

# Issuer / audience claims for JWT hardening (safe defaults)
JWT_ISSUER = os.getenv("JWT_ISSUER", "fixion-api")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "fixion-app")

# Optional tuning knobs your code may use
BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", "12"))


# Payments / Webhooks
PAYSTACK_SECRET = os.getenv("PAYSTACK_SECRET", "").strip()
PAYSTACK_WEBHOOK_ACTIVE = os.getenv("PAYSTACK_WEBHOOK_ACTIVE", "").strip().lower() in {"1", "true", "yes"}


# Field-level encryption (PII at rest)
# Generate with:
#   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FERNET_KEY = os.getenv("FERNET_KEY", "").strip()


# Rate limiting (in-app) – used by /auth/login
LOGIN_MAX_ATTEMPTS = int(os.getenv("LOGIN_MAX_ATTEMPTS", "5"))
LOGIN_WINDOW_SECONDS = int(os.getenv("LOGIN_WINDOW_SECONDS", "900"))  # 15 minutes


# CORS
DEV_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

PROD_DEFAULT_ORIGINS = _csv_list(os.getenv("PROD_ORIGINS")) or [
    # Replace with your real frontend domains when ready
    "https://app.fixion.com",
    "https://www.fixion.com",
]

_env_cors = _csv_list(os.getenv("CORS_ALLOW_ORIGINS"))
if _env_cors:
    CORS_ALLOW_ORIGINS = _env_cors
else:
    CORS_ALLOW_ORIGINS = PROD_DEFAULT_ORIGINS if IS_PRODUCTION else DEV_DEFAULT_ORIGINS


# Email (SMTP via Gmail App Password)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")  # your Gmail address
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # 16-char App Password
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "fixion-backend")


# SMS / Twilio Verify
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID", "").strip()

# Optional: default country for phone normalization (Nigeria)
DEFAULT_PHONE_COUNTRY = os.getenv("DEFAULT_PHONE_COUNTRY", "NG").strip()

# Fixion fee settings (NGN)
FEE_CUSTOMER_NGN = int(os.getenv("FEE_CUSTOMER_NGN", "10"))   # added on top of card checkout amount
FEE_WALLET_NGN   = int(os.getenv("FEE_WALLET_NGN",   "10"))   # wallet pay fee
FEE_PAYOUT_NGN   = int(os.getenv("FEE_PAYOUT_NGN",   "10"))   # bank payout fee (already used)

# Who receives fees in-wallet (must be an existing user)
PLATFORM_FEE_USER_EMAIL = os.getenv("PLATFORM_FEE_USER_EMAIL", "admin@fixion.com")

# Allow “manual” admin approval flow for payouts (no Paystack)
ALLOW_MANUAL_PAYOUTS = os.getenv("ALLOW_MANUAL_PAYOUTS", "true").lower() in {"1", "true", "yes"}
