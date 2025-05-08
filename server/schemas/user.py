from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = "user"
    picture: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    picture: Optional[str]


class UserOut(UserBase):
    id: str
    createdAt: datetime

    class Config:
        orm_mode = True
