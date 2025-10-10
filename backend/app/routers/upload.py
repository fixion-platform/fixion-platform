# app/routers/upload.py
from __future__ import annotations

import os
import uuid
import shutil
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth_utils import get_current_user, require_verified_contact
from app.models import User, ArtisanDocument
from app.models.enums import UserRole

router = APIRouter(prefix="/upload", tags=["Upload"])

# Local folder for uploaded docs
UPLOAD_DIR = os.path.join(os.getcwd(), "uploaded_docs")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Upload
@router.post("/artisan-documents", summary="Upload artisan KYC/portfolio (PDF/JPG/PNG, <=10MB each)")
async def upload_artisan_documents(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    me: User = Depends(require_verified_contact),
):
    # Only artisans can upload KYC/portfolio docs
    if getattr(me, "role", None) != UserRole.artisan:
        raise HTTPException(status_code=403, detail="Only artisans can upload documents")

    # Lazy import to avoid circulars if any
    from app.utils import validate_and_read_upload

    # Ensure user-specific folder (no PII in names beyond UUID)
    user_dir = os.path.join(UPLOAD_DIR, str(me.id))
    os.makedirs(user_dir, exist_ok=True)
    abs_user_dir = os.path.abspath(user_dir)

    saved = []
    for f in files:
        # Validate & read (size/type/signature) -> (bytes, ext, safe_name)
        content, ext, safe_name = validate_and_read_upload(f)

        # Compose safe absolute path under user_dir
        dest_path = os.path.abspath(os.path.join(abs_user_dir, safe_name))
        # Prevent path traversal (must stay within user_dir)
        if not dest_path.startswith(abs_user_dir + os.sep):
            raise HTTPException(status_code=400, detail="Invalid path")

        # Persist to disk
        with open(dest_path, "wb") as out:
            out.write(content)

        # Save metadata
        doc = ArtisanDocument(
            user_id=me.id,
            original_filename=f.filename,
            stored_filename=safe_name,
        )
        db.add(doc)
        saved.append({"original": f.filename, "stored_as": safe_name, "bytes": len(content)})

    db.commit()
    return {"message": "Uploaded", "files": saved}



# View own uploaded docs

@router.get("/artisan-documents")
def list_artisan_documents(
    db: Session = Depends(get_db),
    me: User = Depends(require_verified_contact),
):
    if getattr(me, "role", None) != UserRole.artisan:
        raise HTTPException(status_code=403, detail="Only artisans can view documents")

    docs = db.query(ArtisanDocument).filter(ArtisanDocument.user_id == me.id).all()
    return [
        {
            "id": str(d.id),
            "original_filename": d.original_filename,
            "stored_filename": d.stored_filename,
            "uploaded_at": d.created_at,
        }
        for d in docs
    ]
