from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Enum,
    UniqueConstraint,
    Integer,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from db import Base
import enum


class AppPermission(enum.Enum):
    DOCUMENTS_MANAGEMENT = "documents.management"
    PROFILES_MANAGEMENT = "profiles.management"
    REPORT_VALIDATION = "report.validation"
    REPORT_ACCEPTANCE = "report.acceptance"


class AppRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    TEACHER = "teacher"


class User(Base):
    __tablename__ = "user"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, nullable=False)
    picture = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=True, default="user")

    createdAt = Column(DateTime, default=datetime.now)

    sessions = relationship("UserSession", back_populates="user")


class UserSession(Base):
    __tablename__ = "session"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("user.id"), nullable=False)
    expiresAt = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")


class RolePermission(Base):
    __tablename__ = "role_permission"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    role = Column(Enum(AppRole), nullable=False)
    permission = Column(Enum(AppPermission), nullable=False)

    __table_args__ = (
        UniqueConstraint("role", "permission", name="unique_role_permission"),
    )
