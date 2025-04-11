from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import loan_crud
from schemas.loan_schema import LoanCreate, LoanResponse, LoanUpdate
from dependencies.database import get_db
from typing import List
from models import LoanStatus

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.get("/", response_model=List[LoanResponse])
def list_loans(db: Session = Depends(get_db)):
    return loan_crud.get_loans(db)

@router.post("/", response_model=LoanResponse)
def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    return loan_crud.create_loan(db, loan)

@router.get("/{loan_id}", response_model=LoanResponse)
def read_loan(loan_id: int, db: Session = Depends(get_db)):
    db_loan = loan_crud.get_loan(db, loan_id)
    if not db_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return db_loan

@router.put("/{loan_id}", response_model=LoanResponse)
def update_loan(loan_id: int, loan: LoanUpdate, db: Session = Depends(get_db)):
    db_loan = loan_crud.update_loan(db, loan_id, loan)
    if not db_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return db_loan

@router.delete("/{loan_id}", response_model=LoanResponse)
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    db_loan = loan_crud.delete_loan(db, loan_id)
    if not db_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return db_loan

# Get loans by status
@router.get("/status/{status}", response_model=List[LoanResponse])
def get_loans_by_status(status: LoanStatus, db: Session = Depends(get_db)):
    return loan_crud.get_loans_by_status(db, status)

# Get loans by user
@router.get("/user/{user_id}", response_model=List[LoanResponse])
def get_loans_by_user(user_id: str, db: Session = Depends(get_db)):
    return loan_crud.get_loans_by_user(db, user_id)

# Get loans by book
@router.get("/book/{book_id}", response_model=List[LoanResponse])
def get_loans_by_book(book_id: int, db: Session = Depends(get_db)):
    return loan_crud.get_loans_by_book(db, book_id)
