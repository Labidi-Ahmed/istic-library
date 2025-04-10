from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    published_date: Optional[datetime] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    available: Optional[bool] = None

class BookResponse(BookBase):
    id: int
    available: bool

    class Config:
        from_attributes = True
