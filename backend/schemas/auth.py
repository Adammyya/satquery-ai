from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class AnalysisCreate(BaseModel):
    query: str
    task: str
    workflow: str
    answer: str
    confidence: float
    image_filename: Optional[str] = None

class AnalysisResponseSchema(BaseModel):
    id: int
    query: str
    task: str
    workflow: str
    answer: str
    confidence: float
    image_filename: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
