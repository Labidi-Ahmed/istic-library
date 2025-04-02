from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from db import Base


class User(Base):
    __tablename__ = "user"
    
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    createdAt = Column(DateTime, default=datetime.now)
    
    
    sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "session"
    
    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("user.id"), nullable=False)
    expiresAt = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="sessions")