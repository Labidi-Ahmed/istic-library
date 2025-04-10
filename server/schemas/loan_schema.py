from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models import LoanStatus

class LoanBase(BaseModel):
    book_id: int
    user_id: str

class LoanCreate(LoanBase):
    status: LoanStatus = LoanStatus.PENDING

class LoanUpdate(LoanBase):
    status: Optional[LoanStatus] = None
    book_id: Optional[int] = None
    user_id: Optional[str] = None

class LoanResponse(LoanBase):
    id: int
    requested_at: datetime
    status: LoanStatus

    class Config:
        from_attributes = True
