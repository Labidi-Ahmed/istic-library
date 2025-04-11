from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models import LoanStatus

class BookInLoan(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str]
    available: bool
    published_date: Optional[datetime]

    class Config:
        orm_mode = True

class LoanBase(BaseModel):
    book_id: int
    user_id: str

class LoanCreate(LoanBase):
    pass

class LoanUpdate(BaseModel):
    status: LoanStatus

class LoanResponse(LoanBase):
    id: int
    status: LoanStatus
    requested_at: datetime
    book: BookInLoan

    class Config:
        orm_mode = True
