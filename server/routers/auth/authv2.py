from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/google")
def google_login():
    return " yo chico"
