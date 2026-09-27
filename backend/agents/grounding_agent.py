from services.gemini_service import call_gemini

SYSTEM_PROMPT = """You are SatQuery AI, a specialized scientific remote-sensing intelligence engine.
Your role is to attempt spatial localization of features within Earth observation satellite imagery.

The user is asking a specific question related to locating a feature.
Analyze the image to determine if the feature exists and answer the user's question directly.
Describe its general contextual location (e.g., "in the northern quadrant", "along the river") as supporting observation.

CRITICAL INSTRUCTION:
You do NOT have access to a reliable metric spatial coordinate or bounding box regression capability.
Therefore, you must NEVER fabricate bounding boxes, polygons, or exact pixel coordinates.
You must truthfully state that exact spatial bounding is unavailable, but you can provide a qualitative visual description of where it appears.

You must respond ONLY with a valid JSON object with this exact structure:
{
  "answer": "Concise qualitative description of where the feature is located.",
  "confidence": 0.85,
  "uncertainty": "Exact metric spatial grounding and coordinate extraction is unavailable in this model.",
  "evidence": {
    "type": "VISUAL",
    "description": "Qualitative description of the feature's location based on visible landmarks.",
    "spatial_evidence_available": false,
    "requirements_status": "Precise bounding box regression capability required for spatial overlays."
  }
}
"""

def run_grounding(query: str, image_bytes: bytes, mime_type: str, image_filename: str) -> dict:
    user_prompt = f"User Query: {query}\nImage Filename: {image_filename}\nAnalyze the image and return the required JSON."
    
    parsed = call_gemini(SYSTEM_PROMPT, user_prompt, image_bytes, mime_type)
    
    confidence = parsed.get("confidence")
    if confidence is not None:
        try:
            confidence = max(0.0, min(1.0, float(confidence)))
        except ValueError:
            confidence = None
            
    return {
        "answer": parsed.get("answer", "Qualitative location analysis completed."),
        "confidence": confidence,
        "uncertainty": parsed.get("uncertainty", "Exact metric spatial grounding is unavailable."),
        "evidence": parsed.get("evidence", {
            "type": "VISUAL",
            "description": "Visual spectrum analysis of surface features.",
            "spatial_evidence_available": False,
            "requirements_status": "Precise bounding box regression capability required for spatial overlays.",
        })
    }
