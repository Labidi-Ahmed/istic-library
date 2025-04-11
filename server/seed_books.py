from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import Book
from datetime import datetime

def seed_books():
    db = SessionLocal()
    try:
        # Create sample books
        books = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "description": "A story of decadence and excess, following the mysterious millionaire Jay Gatsby.",
                "published_date": datetime(1925, 4, 10)
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "description": "A story of racial injustice and loss of innocence in the American South.",
                "published_date": datetime(1960, 7, 11)
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "description": "A dystopian novel about surveillance and control in a totalitarian society.",
                "published_date": datetime(1949, 6, 8)
            },
            {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "description": "A romantic novel about the relationship between Elizabeth Bennet and Mr. Darcy.",
                "published_date": datetime(1813, 1, 28)
            },
            {
                "title": "The Catcher in the Rye",
                "author": "J.D. Salinger",
                "description": "A story of teenage alienation and loss of innocence in New York City.",
                "published_date": datetime(1951, 7, 16)
            },
            {
                "title": "One Hundred Years of Solitude",
                "author": "Gabriel García Márquez",
                "description": "A multi-generational saga of the Buendía family in the mythical town of Macondo.",
                "published_date": datetime(1967, 5, 30)
            },
            {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "description": "A fantasy novel about Bilbo Baggins' quest to win a share of the treasure guarded by a dragon.",
                "published_date": datetime(1937, 9, 21)
            },
            {
                "title": "Brave New World",
                "author": "Aldous Huxley",
                "description": "A dystopian novel about a futuristic World State and its citizens.",
                "published_date": datetime(1932, 1, 1)
            },
            {
                "title": "The Lord of the Rings",
                "author": "J.R.R. Tolkien",
                "description": "An epic high-fantasy novel about the quest to destroy the One Ring.",
                "published_date": datetime(1954, 7, 29)
            },
            {
                "title": "Don Quixote",
                "author": "Miguel de Cervantes",
                "description": "The story of a man who, driven mad by reading too many chivalric romances, decides to become a knight.",
                "published_date": datetime(1605, 1, 16)
            }
        ]

        # Add books to database
        for book_data in books:
            book = Book(**book_data)
            db.add(book)
        
        db.commit()
        print("Successfully added sample books!")

    except Exception as e:
        print(f"Error adding books: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    seed_books()
