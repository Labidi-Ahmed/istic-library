from sqlalchemy.orm import Session
from models import Loan, LoanStatus, Book, User
from schemas.loan_schema import LoanCreate, LoanUpdate
from fastapi import HTTPException

def get_loans(db: Session):
    return db.query(Loan).all()

def get_loan(db: Session, loan_id: int):
    return db.query(Loan).filter(Loan.id == loan_id).first()

def create_loan(db: Session, loan: LoanCreate):
    # Check if user exists
    user = db.query(User).filter(User.id == loan.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if book exists and is available
    book = db.query(Book).filter(Book.id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.available:
        raise HTTPException(status_code=400, detail="Book is not available")

    # Create loan
    db_loan = Loan(**loan.dict())
    db.add(db_loan)
    
    # Update book availability
    book.available = False
    
    db.commit()
    db.refresh(db_loan)
    return db_loan

def update_loan(db: Session, loan_id: int, loan_update: LoanUpdate):
    db_loan = get_loan(db, loan_id)
    if db_loan:
        # If updating book_id, check if new book exists and is available
        if loan_update.book_id and loan_update.book_id != db_loan.book_id:
            new_book = db.query(Book).filter(Book.id == loan_update.book_id).first()
            if not new_book:
                raise HTTPException(status_code=404, detail="Book not found")
            if not new_book.available:
                raise HTTPException(status_code=400, detail="Book is not available")
            
            # Make old book available
            old_book = db.query(Book).filter(Book.id == db_loan.book_id).first()
            if old_book:
                old_book.available = True
            
            # Make new book unavailable
            new_book.available = False

        # If updating user_id, check if new user exists
        if loan_update.user_id and loan_update.user_id != db_loan.user_id:
            user = db.query(User).filter(User.id == loan_update.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

        # Update loan
        for key, value in loan_update.dict(exclude_unset=True).items():
            setattr(db_loan, key, value)
        
        db.commit()
        db.refresh(db_loan)
    return db_loan

def delete_loan(db: Session, loan_id: int):
    db_loan = get_loan(db, loan_id)
    if db_loan:
        # Make book available again
        book = db.query(Book).filter(Book.id == db_loan.book_id).first()
        if book:
            book.available = True
        
        db.delete(db_loan)
        db.commit()
    return db_loan

def get_loans_by_status(db: Session, status: LoanStatus):
    return db.query(Loan).filter(Loan.status == status).all()

def get_loans_by_user(db: Session, user_id: str):
    return db.query(Loan).filter(Loan.user_id == user_id).all()

def get_loans_by_book(db: Session, book_id: int):
    return db.query(Loan).filter(Loan.book_id == book_id).all()
