import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel


load_dotenv()

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

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3-flash-preview",
)

client = genai.Client()


class Query(BaseModel):
    query: str


@app.get("/")
def home():
    return {
        "message": "SatQuery AI Backend is running!"
    }


@app.post("/analyze")
def analyze(data: Query):
    return {
        "task": "satellite_analysis",
        "answer": f"SatQuery received: {data.query}",
        "confidence": 0.90,
    }


@app.post("/ai/analyze")
async def ai_analyze(
    query: str = Form(...),
    image: UploadFile = File(...),
):
    try:
        image_bytes = await image.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        mime_type = image.content_type or "image/jpeg"

        prompt = f"""
You are SatQuery AI, a remote-sensing image analysis assistant.

Analyze the provided satellite/remote-sensing image and answer the user's query.

User query:
{query}

Give a concise, factual answer based only on visible information in the image.
If the image does not contain enough information to answer confidently, say so.
"""

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
            ],
        )

        return {
            "task": "satellite_analysis",
            "answer": response.text,
            "confidence": 0.90,
            "model": GEMINI_MODEL,
            "image": {
                "filename": image.filename,
                "mime_type": mime_type,
            },
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Gemini analysis unavailable: {str(exc)}",
        )