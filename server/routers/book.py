from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import book_crud
from schemas.book_schema import BookCreate, BookUpdate, BookResponse
from dependencies.database import get_db
from typing import List

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/", response_model=List[BookResponse])
def list_books(db: Session = Depends(get_db)):
    return book_crud.get_books(db)

@router.post("/", response_model=BookResponse)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    return book_crud.create_book(db, book)

@router.get("/{book_id}", response_model=BookResponse)
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = book_crud.get_book(db, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    db_book = book_crud.update_book(db, book_id, book)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

@router.delete("/{book_id}", response_model=BookResponse)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = book_crud.delete_book(db, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


