from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import engine
import uvicorn
from routers.auth.auth import router as auth_router
from routers.book import router as book_router
from routers.loan import router as loan_router

from dotenv import load_dotenv
import logging
import os
from starlette.middleware.sessions import SessionMiddleware

from db import Base

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="secret-string")

load_dotenv()
# Create all database tables
Base.metadata.create_all(bind=engine)


origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:7000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def helloWorld():
    return {"message": "hello world"}


logger = logging.getLogger("uvicorn")

logger.info(f"GOOGLE_CLIENT_ID: {os.getenv('ORIGIN')}")


app.include_router(auth_router, prefix="/api")
app.include_router(book_router, prefix="/api")
app.include_router(loan_router, prefix="/api")


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=7000, reload=True)
