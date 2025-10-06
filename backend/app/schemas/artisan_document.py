# app/schemas/artisan_document.py
from __future__ import annotations
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ArtisanDocumentOut(BaseModel):
    id: UUID
    user_id: UUID
    original_filename: str
    stored_filename: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
