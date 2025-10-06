from __future__ import annotations
import re
from typing import Optional
import bleach

# We don't render rich HTML back to users, so allow nothing.
BLEACH_TAGS: list[str] = []
BLEACH_ATTRS: dict[str, list[str]] = {}
BLEACH_PROTOCOLS: list[str] = []

_ws = re.compile(r"\s+")

def strip_collapse(text: Optional[str]) -> str:
    if text is None:
        return ""
    return _ws.sub(" ", text).strip()

def clean_free_text(text: Optional[str], max_len: int) -> str:
    s = strip_collapse(text)
    if not s:
        return ""
    s = bleach.clean(s, tags=BLEACH_TAGS, attributes=BLEACH_ATTRS, protocols=BLEACH_PROTOCOLS, strip=True)
    if len(s) > max_len:
        s = s[:max_len].rstrip()
    return s

def clean_name(text: Optional[str], max_len: int = 80) -> str:
    s = strip_collapse(text)
    s = bleach.clean(s, tags=[], attributes={}, strip=True)
    s = re.sub(r"[^A-Za-z .'\-]", "", s)
    return s[:max_len].strip()

def clean_phone(text: Optional[str], max_len: int = 32) -> str:
    s = strip_collapse(text)
    s = re.sub(r"[^\d+]", "", s)
    s = re.sub(r"^\++", "+", s)
    return s[:max_len]

def clean_email_lower(text: Optional[str], max_len: int = 254) -> str:
    s = strip_collapse(text).lower()
    return s[:max_len]
