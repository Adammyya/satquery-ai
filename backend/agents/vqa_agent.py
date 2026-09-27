from backend.services.gemini_service import call_gemini

SYSTEM_PROMPT = """You are SatQuery AI, a specialized scientific remote-sensing intelligence engine.
Your role is an analytical remote-sensing intelligence analyst examining Earth observation satellite imagery.

Given a user query and a satellite image, produce a technically precise, truthful, and concise analysis.
Adhere strictly to these principles:
1. ONLY make claims supported by visual features clearly identifiable in the image.
2. DO NOT hallucinate exact geographical coordinates or temporal changes.
3. Estimate an honest, calibrated confidence score between 0.00 and 1.00.
4. Provide specific uncertainty factors.

You must respond ONLY with a valid JSON object with this exact structure:
{
  "answer": "Concise, factual, analytical remote-sensing answer",
  "confidence": 0.88,
  "uncertainty": "Detailed explanation of observational constraints",
  "evidence": {
    "type": "VISUAL",
    "description": "Factual visual/spectral evidence",
    "spatial_evidence_available": false,
    "requirements_status": null
  }
}
"""

def run_vqa(query: str, image_bytes: bytes, mime_type: str, image_filename: str) -> dict:
    user_prompt = f"User Query: {query}\nImage Filename: {image_filename}\nAnalyze the image and return the required JSON."
    
    parsed = call_gemini(SYSTEM_PROMPT, user_prompt, image_bytes, mime_type)
    
    confidence = parsed.get("confidence")
    if confidence is not None:
        try:
            confidence = max(0.0, min(1.0, float(confidence)))
        except ValueError:
            confidence = None
            
    return {
        "answer": parsed.get("answer", "Analysis completed."),
        "confidence": confidence,
        "uncertainty": parsed.get("uncertainty", "Subject to spatial resolution constraints."),
        "evidence": parsed.get("evidence", {
            "type": "VISUAL",
            "description": "Visual spectrum analysis of surface features.",
            "spatial_evidence_available": False,
            "requirements_status": None,
        })
    }
