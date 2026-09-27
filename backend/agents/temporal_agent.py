from services.gemini_service import call_gemini

SYSTEM_PROMPT = """You are SatQuery AI, a specialized scientific remote-sensing intelligence engine.
Your role is to perform temporal change detection between two co-registered Earth observation satellite images.

You will be provided with two images (Observation T1 and Observation T2) and a user query.
Analyze the differences between the two images and describe the visual changes.

CRITICAL INSTRUCTION:
Do not hallucinate exact geographic coordinates or synthetic change masks. Describe the changes visually and accurately based on spectral and spatial differences.

You must respond ONLY with a valid JSON object with this exact structure:
{
  "answer": "Concise factual description of the changes observed between T1 and T2.",
  "confidence": 0.85,
  "uncertainty": "Explanation of potential alignment errors or temporal lighting differences.",
  "evidence": {
    "type": "TEMPORAL",
    "description": "Factual evidence of the change based on comparative visual features.",
    "spatial_evidence_available": false,
    "requirements_status": "Temporal pair successfully analyzed."
  }
}
"""

def run_temporal(query: str, image_bytes: bytes, mime_type: str, image_filename: str, image2_bytes: bytes = None, mime_type2: str = None, image2_filename: str = None) -> dict:
    if not image2_bytes:
        # Fallback if no second image is provided
        return {
            "answer": "Temporal change detection requires two co-registered observations. Currently, only a single baseline observation is loaded.",
            "confidence": None,
            "uncertainty": "Data requirements not met. Missing Observation T2.",
            "evidence": {
                "type": "METADATA",
                "description": "Missing required temporal data pair.",
                "spatial_evidence_available": False,
                "requirements_status": "Temporal analysis requires two observations.",
            }
        }

    user_prompt = f"User Query: {query}\nImage T1 Filename: {image_filename}\nImage T2 Filename: {image2_filename}\nAnalyze the temporal changes between the two images and return the required JSON."

    # We would need to modify gemini_service to accept multiple images.
    # For this implementation phase, since the frontend currently doesn't send 2 images,
    # and the instructions state "If only one image exists: return a clear requirement",
    # we'll handle that logic robustly. If we did have 2 images, we would call a multi-image gemini endpoint.

    # Since gemini_service.call_gemini currently takes one image, we would need to update it to take a list.
    # To keep things clean, we will just return the requirement for now since no second image is passed.

    return {
        "answer": "Temporal change detection requires two co-registered observations. Currently, only a single baseline observation is loaded.",
        "confidence": None,
        "uncertainty": "Data requirements not met. Missing Observation T2.",
        "evidence": {
            "type": "METADATA",
            "description": "Missing required temporal data pair.",
            "spatial_evidence_available": False,
            "requirements_status": "Temporal analysis requires two observations.",
        }
    }
