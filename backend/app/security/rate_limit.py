# app/security/rate_limit.py
import time
import asyncio
from collections import defaultdict, deque
from typing import Tuple, Deque, Optional

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.config import LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_SECONDS

# In-memory store (resets on process restart)
# key: (client_ip, username/email) -> deque[timestamps]
_attempts: dict[Tuple[str, str], Deque[float]] = defaultdict(deque)
_lock = asyncio.Lock()


def _client_ip(req: Request) -> str:
    return (req.client.host if req.client else "unknown").strip().lower()


def _key(ip: str, ident: Optional[str]) -> Tuple[str, str]:
    ident_norm = (ident or "").strip().lower()
    return (ip, ident_norm)


async def login_rate_limit_and_form(
    request: Request,
    form: OAuth2PasswordRequestForm = Depends(),
) -> OAuth2PasswordRequestForm:
    """
    Parse the OAuth2 form (reads body ONCE) and apply rate limiting
    to /auth/login per (ip, username).
    Returns the parsed form to the endpoint.
    """
    ip = _client_ip(request)
    ident = (form.username or "").strip().lower()

    now = time.time()
    window = float(LOGIN_WINDOW_SECONDS)
    max_hits = int(LOGIN_MAX_ATTEMPTS)
    key = _key(ip, ident)

    async with _lock:
        dq = _attempts[key]
        # purge old timestamps
        while dq and (now - dq[0]) > window:
            dq.popleft()

        if len(dq) >= max_hits:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Try again in a few minutes.",
            )

        dq.append(now)

    return form


async def clear_login_bucket(request: Request, ident: Optional[str]) -> None:
    """
    Clear rate-limit bucket after a successful login to avoid throttling
    the user who just authenticated correctly.
    """
    ip = _client_ip(request)
    key = _key(ip, (ident or "").strip().lower())
    async with _lock:
        _attempts.pop(key, None)
