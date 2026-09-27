import time
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.schemas.analysis import AnalysisResponse, Query
from backend.orchestrator.workflow import execute_workflow

load_dotenv()

app = FastAPI(title="SatQuery AI Backend", version="1.0.0")

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

@app.get("/")
def home():
    return {
        "service": "SatQuery AI Remote-Sensing Intelligence Workstation",
        "status": "online",
        "supported_modalities": ["optical"],
    }

@app.post("/analyze")
def analyze(data: Query):
    return {
        "task": "satellite_analysis",
        "answer": f"SatQuery received: {data.query}",
        "confidence": 0.90,
    }

@app.post("/ai/analyze", response_model=AnalysisResponse)
async def ai_analyze(
    query: str = Form(...),
    image: UploadFile = File(...),
):
    start_time = time.time()
    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded image file is empty.")
            
        mime_type = image.content_type or "image/jpeg"
        supported_mimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
        if mime_type not in supported_mimes:
            raise HTTPException(status_code=400, detail=f"Unsupported format '{mime_type}'.")

        result = execute_workflow(query, image_bytes, mime_type, image.filename or "satellite_image")
        
        result["execution"]["latency_ms"] = int((time.time() - start_time) * 1000)
        result["image"] = {
            "filename": image.filename,
            "mime_type": mime_type,
        }
        
        return result

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"SatQuery engine analysis unavailable: {str(exc)}",
        )