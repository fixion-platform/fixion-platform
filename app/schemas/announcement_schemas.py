"""
Schemas for public announcement APIs.

These Pydantic models define the shape of data returned by the
announcement endpoints. They are intentionally separate from the
internal admin announcement schemas to avoid exposing internal fields
such as `is_active` or `created_by_admin_id`.
"""

from __future__ import annotations

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict


class AnnouncementOut(BaseModel):
    id: str
    title: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnnouncementListOut(BaseModel):
    total: int
    items: List[AnnouncementOut]

    model_config = ConfigDict(from_attributes=True)