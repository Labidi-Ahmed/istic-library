from db import SessionLocal, Base, engine
from models import User
import uuid

def create_test_user():
    db = SessionLocal()
    test_user = User(
        id=str(uuid.uuid4()),
        username="Test User",
        email="test@example.com",
        role="user"
    )
    db.add(test_user)
    db.commit()
    print(f"Created user with ID: {test_user.id}")
    return test_user.id

if __name__ == "__main__":
    create_test_user()
