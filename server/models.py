from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Enum,
    UniqueConstraint,
    Integer,
    Boolean,
    Text
)
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from db import Base


# Enums for roles, loan status, and permissions
class AppRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    TEACHER = "teacher"


class LoanStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class AppPermission(enum.Enum):
    DOCUMENTS_MANAGEMENT = "documents.management"
    PROFILES_MANAGEMENT = "profiles.management"
    REPORT_VALIDATION = "report.validation"
    REPORT_ACCEPTANCE = "report.acceptance"


# User model (no changes made)
class User(Base):
    __tablename__ = "user"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID primary key
    username = Column(String, nullable=False)  # User's name (unique identifier)
    picture = Column(String, nullable=True)  # Profile picture
    email = Column(String, unique=True, nullable=False)  # User's unique email
    role = Column(String, nullable=True, default="user")  # User's role (admin, user, teacher)
    createdAt = Column(DateTime, default=datetime.now)  # Timestamp when the user was created

    # Relationships
    sessions = relationship("UserSession", back_populates="user")
    loans = relationship("Loan", back_populates="user")  # Relationship with loans

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email}, role={self.role})>"


# UserSession model (no changes made)
class UserSession(Base):
    __tablename__ = "session"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("user.id"), nullable=False)  # Foreign key to user
    expiresAt = Column(DateTime, nullable=False)  # Expiration date of session

    user = relationship("User", back_populates="sessions")

    def __repr__(self):
        return f"<UserSession(id={self.id}, userId={self.userId}, expiresAt={self.expiresAt})>"


# RolePermission model (no changes made)
class RolePermission(Base):
    __tablename__ = "role_permission"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  # UUID primary key
    role = Column(Enum(AppRole), nullable=False)  # Role (admin, user, teacher)
    permission = Column(Enum(AppPermission), nullable=False)  # Permission

    # Ensures each role/permission pair is unique
    __table_args__ = (
        UniqueConstraint("role", "permission", name="unique_role_permission"),
    )

    def __repr__(self):
        return f"<RolePermission(id={self.id}, role={self.role}, permission={self.permission})>"


# New Book model (to store books in the library)
class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Auto-incrementing primary key
    title = Column(String(255), nullable=False)  # Book's title
    author = Column(String(255), nullable=False)  # Author's name
    description = Column(Text, nullable=True)  # Optional description of the book
    available = Column(Boolean, default=True)  # Availability status of the book
    published_date = Column(DateTime, nullable=True)  # Optional date when the book was published

    # Relationship to track loans associated with this book
    loans = relationship("Loan", back_populates="book")

    def __repr__(self):
        return f"<Book(id={self.id}, title={self.title}, author={self.author}, available={self.available})>"


# New Loan model (for managing book loans)
class Loan(Base):
    __tablename__ = "loan"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Auto-incrementing primary key
    user_id = Column(String, ForeignKey("user.id"), nullable=False)  # Foreign key to user
    book_id = Column(Integer, ForeignKey("book.id"), nullable=False)  # Foreign key to book
    requested_at = Column(DateTime, default=datetime.now)  # Timestamp when the loan was requested
    status = Column(Enum(LoanStatus), default=LoanStatus.PENDING)  # Loan status (pending, approved, rejected)

    # Relationships
    user = relationship("User", back_populates="loans")
    book = relationship("Book", back_populates="loans")

    def __repr__(self):
        return f"<Loan(id={self.id}, user_id={self.user_id}, book_id={self.book_id}, status={self.status})>"
