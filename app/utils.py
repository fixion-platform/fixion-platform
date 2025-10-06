# app/utils.py

import re
from passlib.context import CryptContext
from fastapi import HTTPException, status


from typing import Tuple
from fastapi import UploadFile
import os, uuid

from typing import Optional
from app.config import FERNET_KEY

# Create the password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hashes a plain password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies that a plain password matches the hashed one."""
    return pwd_context.verify(plain_password, hashed_password) 

def validate_strong_password(password: str) -> str:
    """Validates password strength according to Fixion security rules."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="Password must include an uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise HTTPException(status_code=400, detail="Password must include a lowercase letter.")
    if not re.search(r'\d', password):
        raise HTTPException(status_code=400, detail="Password must include a number.")
    if not re.search(r'[@$!%*?&]', password):
        raise HTTPException(status_code=400, detail="Password must include a special character (@$!%*?&).")
    return password   


# Upload safety helpers

MAX_UPLOAD_MB = 10
ALLOWED_EXTS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_PREFIXES = ("image/", "application/pdf")

def _looks_like_pdf(head: bytes) -> bool:
    return head.startswith(b"%PDF-")

def _looks_like_jpeg(head: bytes) -> bool:
    return head[:3] == b"\xff\xd8\xff"

def _looks_like_png(head: bytes) -> bool:
    return head.startswith(b"\x89PNG\r\n\x1a\n")

def _sniff(head: bytes, ext: str) -> bool:
    ext = ext.lower()
    if ext == ".pdf":
        return _looks_like_pdf(head)
    if ext in {".jpg", ".jpeg"}:
        return _looks_like_jpeg(head)
    if ext == ".png":
        return _looks_like_png(head)
    return False

def safe_random_name(ext: str) -> str:
    """Generate a safe random filename (ignore original basename)."""
    return f"{uuid.uuid4().hex}{ext.lower()}"

def validate_and_read_upload(f: UploadFile) -> Tuple[bytes, str, str]:
    """
    Validate size, extension, content-type and magic bytes.
    Returns (content_bytes, ext, safe_filename).
    """
    # Extension
    _, ext = os.path.splitext(f.filename or "")
    ext = ext.lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(status_code=400, detail="Unsupported file type. Allowed: PDF/JPG/PNG")

    # Content-Type header (advisory)
    ctype = (f.content_type or "").lower()
    if not any(ctype.startswith(p) for p in ALLOWED_MIME_PREFIXES):
        raise HTTPException(status_code=400, detail="Invalid content-type")

    # Size cap
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    content = f.file.read(max_bytes + 1)
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File too large (>{MAX_UPLOAD_MB}MB)")

    # Magic bytes sniff
    head = content[:16]
    if not _sniff(head, ext):
        raise HTTPException(status_code=400, detail="File signature does not match extension")

    # Safe name (no original basename, no traversal)
    safe_name = safe_random_name(ext)
    return content, ext, safe_name

# PII encryption helpers
try:
    from cryptography.fernet import Fernet, InvalidToken
    _fernet = Fernet(FERNET_KEY.encode()) if FERNET_KEY else None
except Exception:
    _fernet = None
    InvalidToken = Exception  # fallback to avoid NameError

def encrypt_str(value: Optional[str]) -> Optional[str]:
    """
    Encrypts a string with Fernet. Returns plaintext if key not set.
    """
    if value is None:
        return None
    if not _fernet:
        return value  # plaintext fallback if no key configured
    return _fernet.encrypt(value.encode()).decode()

def decrypt_str(value: Optional[str]) -> Optional[str]:
    """
    Decrypts a Fernet string. Returns original if key not set or token invalid.
    """
    if value is None:
        return None
    if not _fernet:
        return value
    try:
        return _fernet.decrypt(value.encode()).decode()
    except InvalidToken:
        return None  


