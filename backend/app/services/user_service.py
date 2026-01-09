from schemas.user_schemas import  UserCreate, User, UserResponse
from fastapi import HTTPException, status
from uuid import uuid4, UUID
import uuid
from models  import UserT
from sqlalchemy.orm import Session


class Users:
    @staticmethod
    def create_user(details: UserCreate, db: Session):
        details = db.query(UserT).filter(UserT.email == details.email).first()
        if details:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")
        new_user = UserT(id=uuid.uuid4(), **details.model_dump(exclude={"password"}))
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user