from sqlalchemy.orm import Session, joinedload
from models import Loan, Book, LoanStatus
from schemas.loan_schema import LoanCreate, LoanUpdate
from fastapi import HTTPException

def get_loans(db: Session):
    return db.query(Loan).join(Book).all()

def get_loan(db: Session, loan_id: int):
    return db.query(Loan).join(Book).filter(Loan.id == loan_id).first()

def create_loan(db: Session, loan: LoanCreate):
    # Check if book exists and is available
    book = db.query(Book).filter(Book.id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.available:
        raise HTTPException(status_code=400, detail="Book is not available")
    
    # Create loan and update book availability
    db_loan = Loan(**loan.dict())    
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def update_loan(db: Session, loan_id: int, loan_update: LoanUpdate):
    db_loan = get_loan(db, loan_id)
    if not db_loan:
        return None
    
    # If loan is being rejected and was previously pending, make book available
    if (loan_update.status == LoanStatus.REJECTED and 
        db_loan.status == LoanStatus.PENDING):
        book = db.query(Book).filter(Book.id == db_loan.book_id).first()
        if book:
            book.available = True
    elif (loan_update.status == LoanStatus.APPROVED and 
        db_loan.status == LoanStatus.PENDING):
        book = db.query(Book).filter(Book.id == db_loan.book_id).first()
        if book:
            book.available = False 
    
    db_loan.status = loan_update.status
    db.commit()
    db.refresh(db_loan)
    return db_loan

def delete_loan(db: Session, loan_id: int):
    db_loan = get_loan(db, loan_id)
    if not db_loan:
        return None
    
    # Make book available again if loan is deleted
    book = db.query(Book).filter(Book.id == db_loan.book_id).first()
    if book:
        book.available = True
    
    db.delete(db_loan)
    db.commit()
    return db_loan

def get_loans_by_status(db: Session, status: LoanStatus):
    return db.query(Loan).join(Book).filter(Loan.status == status).all()

def get_loans_by_user(db: Session, user_id: str):
    return db.query(Loan).join(Book).filter(Loan.user_id == user_id).all()

def get_loans_by_book(db: Session, book_id: int):
    return db.query(Loan).join(Book).filter(Loan.book_id == book_id).all()
