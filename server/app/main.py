from fastapi import FastAPI, Depends
import models
from fastapi.middleware.cors import CORSMiddleware
from db import engine


app = FastAPI()


""" only uncomment below to create new tables """
#models.Base.metadata.create_all(bind=engine)



origins = [
    "http://localhost:3000",
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
    return { "hello world"}



