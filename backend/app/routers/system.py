# app/routers/system.py
from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db

router = APIRouter(prefix="", tags=["System"])

@router.get("/health")
def health(db: Session = Depends(get_db)):
    # Lightweight DB ping (works across Postgres/MySQL/SQLite)
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    return {"status": "ok", "db": db_ok}
