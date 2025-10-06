# app/services/sms_service.py
from __future__ import annotations
import re
import requests
from typing import Tuple

from app.config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
    DEFAULT_PHONE_COUNTRY,
)

_TWILIO_BASE = "https://verify.twilio.com/v2"

class SmsConfigError(RuntimeError):
    pass

def _assert_config():
    if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID):
        raise SmsConfigError("Twilio Verify not configured: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID")

def _to_e164(phone: str) -> str:
    """
    Best effort normalize to E.164 for Nigeria by default.
    Accepts formats like '0803...', '803...', '+234803...', '234803...'
    """
    p = re.sub(r"\D+", "", (phone or ""))
    if not p:
        raise ValueError("Phone number required")

    # already has country code 234
    if p.startswith("234"):
        return f"+{p}"

    # local 11-digit starting with 0 -> +234XXXXXXXXXX
    if p.startswith("0") and len(p) == 11 and DEFAULT_PHONE_COUNTRY.upper() == "NG":
        return "+234" + p[1:]

    # if starts with + already (e.g., +234...) keep it
    if phone.strip().startswith("+"):
        return phone.strip()

    # last resort: assume it's already international missing '+'
    return "+" + p

def send_phone_code(phone: str) -> str:
    """
    Trigger Twilio Verify to send a 6-digit SMS to the phone.
    Returns Twilio Verification SID (for logging/debug).
    """
    _assert_config()
    to = _to_e164(phone)

    url = f"{_TWILIO_BASE}/Services/{TWILIO_VERIFY_SERVICE_SID}/Verifications"
    auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    data = {"To": to, "Channel": "sms"}

    r = requests.post(url, auth=auth, data=data, timeout=15)
    if r.status_code >= 300:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise ValueError(f"Twilio send failed: {detail}")

    body = r.json()
    return body.get("sid", "")

def check_phone_code(phone: str, code: str) -> bool:
    """
    Check the 6-digit code with Twilio Verify.
    Returns True if approved, else False.
    """
    _assert_config()
    to = _to_e164(phone)

    url = f"{_TWILIO_BASE}/Services/{TWILIO_VERIFY_SERVICE_SID}/VerificationCheck"
    auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    data = {"To": to, "Code": code}

    r = requests.post(url, auth=auth, data=data, timeout=15)
    if r.status_code >= 300:
        try:
            detail = r.json()
        except Exception:
            detail = r.text
        raise ValueError(f"Twilio check failed: {detail}")

    body = r.json()
    return (body.get("status") == "approved")
