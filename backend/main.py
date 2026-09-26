from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str

@app.get("/")
def home():
    return {"message": "SatQuery AI Backend is running!"}

@app.post("/analyze")
def analyze(data: Query):
    return {
        "task": "satellite_analysis",
        "answer": f"SatQuery received: {data.query}",
        "confidence": 0.90
    }
