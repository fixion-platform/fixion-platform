# app/main.py
from app.utils import get_password_hash, encrypt_str

import os
from app.config import IS_PRODUCTION

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

import logging, time, uuid
from starlette.middleware.base import BaseHTTPMiddleware


from app.db.database import SessionLocal
from app.models import *  # noqa
from app.models.user import User
from app.utils import get_password_hash  

from app.routers.system import router as system_router
from app.routers.authentication import router as auth_router
from app.routers.users import router as users_router
from app.routers.artisans import router as artisans_router 
from app.routers.search import router as search_router
from app.routers.jobs import router as jobs_router
from app.routers.admin import router as admin_router
from app.routers.wallet import router as wallet_router
from app.routers.payments import router as payments_router
from app.routers.complaints import router as complaints_router
from app.routers.upload import router as upload_router
from app.routers.payouts import router as payouts_router
from app.routers.users_privacy import router as users_privacy_router
from app.routers.announcements import router as announcements_router
from app.routers.disputes import router as disputes_router

from starlette.middleware.trustedhost import TrustedHostMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

# Swagger grouping / ordering
openapi_tags = [
    {"name": "Authentication", "description": "Signup, login, refresh, logout, phone/email verification"},
    {"name": "Users", "description": "User profile and preferences"},
    {"name": "Artisans", "description": "Artisan profile, bank, availability, discovery"},
    {"name": "Upload", "description": "Document uploads (artisan verification docs)"},
    {"name": "Search", "description": "Service and artisan discovery"},
    {"name": "Jobs", "description": "Booking, tracking, notes, photos, reviews"},
    {"name": "Payments", "description": "Checkout, receipts, history, webhook"},
    {"name": "Wallet", "description": "Balance, deposit, withdraw"},
    {"name": "Payouts", "description": "Payout recipients and transfers"},
    {"name": "Complaints", "description": "Customer complaints"},
    {"name": "Disputes", "description": "Job disputes and resolutions"},
    {"name": "Announcements", "description": "System announcements"},
    {"name": "Admin", "description": "Admin dashboard, approvals, reports"},
    {"name": "Root", "description": "Root/health"},
    {"name": "System", "description": "System health, metrics, and diagnostics"},
]

# In production, hide docs/openapi; keep them available in dev/staging
_docs_url = None if IS_PRODUCTION else "/docs"
_redoc_url = None if IS_PRODUCTION else "/redoc"
_openapi_url = None if IS_PRODUCTION else "/openapi.json"

app = FastAPI(
    title="Fixion API",
    description="Backend service for the Fixion Artisan and Customer Marketplace.",
    version="1.0.0",
    docs_url=_docs_url,
    redoc_url=_redoc_url,
    openapi_url=_openapi_url,
    openapi_tags=openapi_tags,
)

# Trust Render's proxy and pass the original client IP
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# In prod, lock allowed hosts (add your Render service hostname later)
if IS_PRODUCTION:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=[
        "*.onrender.com",
        "localhost", "127.0.0.1"
    ])

# Parse comma-separated origins from env (works for dev & prod)
RAW_CORS = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
CORS_ALLOW_ORIGINS = [o.strip() for o in RAW_CORS.split(",") if o.strip()]

# In production, require HTTPS origins to avoid accidental lax config
if IS_PRODUCTION:
    CORS_ALLOW_ORIGINS = [o for o in CORS_ALLOW_ORIGINS if o.startswith("https://")]

# CORS middleware (explicit, security-oriented defaults)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=False, # typically not needed for APIs
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Idempotency-Key", "X-Requested-With"],
    expose_headers=["X-Request-ID"],
    max_age=600
)

# minimal structured request logging with request-id
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.time()
        req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = req_id
        try:
            response = await call_next(request)
        except Exception:
            dur_ms = int((time.time() - start) * 1000)
            logging.exception(f"req_id={req_id} path={request.url.path} method={request.method} dur_ms={dur_ms}")
            raise
        dur_ms = int((time.time() - start) * 1000)
        logging.info(f"req_id={req_id} path={request.url.path} method={request.method} status={response.status_code} dur_ms={dur_ms}")
        response.headers["X-Request-ID"] = req_id
        return response

app.add_middleware(RequestLogMiddleware)

# Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(artisans_router)
app.include_router(upload_router)
app.include_router(search_router)
app.include_router(jobs_router)
app.include_router(payments_router)
app.include_router(payouts_router)
app.include_router(wallet_router)
app.include_router(complaints_router)
app.include_router(users_privacy_router)
app.include_router(admin_router)
app.include_router(announcements_router)
app.include_router(disputes_router)
app.include_router(system_router)



# Root route
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Fixion API!"}

# **Startup Event: Seed default admin**
@app.on_event("startup")
def seed_admin_user():
    if IS_PRODUCTION:
        return  # never seed in production

    if os.getenv("SEED_ADMIN_ON_STARTUP", "false").lower() not in {"1", "true", "yes"}:
        return

    db = SessionLocal()
    try:
        admin_email = "admin@fixion.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if admin:
            print("[startup] Admin already present:", admin_email)
            return

        new_admin = User(
            email=admin_email,
            full_name="Fixion Admin",
            phone_number=encrypt_str("08000000000"),
            role="admin",
        )

        if hasattr(User, "password_hash"):
            new_admin.password_hash = get_password_hash("adminpass")
        elif hasattr(User, "hashed_password"):
            new_admin.hashed_password = get_password_hash("adminpass")
        else:
            raise RuntimeError("User model has no password field")

        for field in ("email_verified", "phone_verified", "is_active"):
            if hasattr(User, field):
                setattr(new_admin, field, True)

        if hasattr(User, "nin"):
            new_admin.nin = encrypt_str("00000000000")

        db.add(new_admin)
        db.commit()
        print("[startup] Admin user created with email", admin_email)
    except Exception as e:
        print("[startup] Error seeding admin user:", e)
        db.rollback()
    finally:
        db.close()

# **Exception handlers for consistent JSON error responses**
def _err(payload: dict, request: Request, status: int):
    # Return consistent shape and echo back the request id set by our middleware
    rid = getattr(request.state, "request_id", None)
    out = {"error": payload, "request_id": rid}
    return JSONResponse(out, status_code=status)

@app.exception_handler(HTTPException)
async def http_exc_handler(request: Request, exc: HTTPException):
    logging.warning(f"HTTPException {exc.status_code} path={request.url.path}")
    return _err({"code": exc.status_code, "message": exc.detail}, request, exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_exc_handler(request: Request, exc: RequestValidationError):
    logging.warning(f"ValidationError path={request.url.path} detail={exc.errors()}")
    return _err({"code": 422, "message": "Validation error", "details": exc.errors()}, request, 422)

@app.exception_handler(Exception)
async def unhandled_exc_handler(request: Request, exc: Exception):
    logging.exception(f"UnhandledError path={request.url.path}")
    return _err({"code": 500, "message": "Internal server error"}, request, 500)

