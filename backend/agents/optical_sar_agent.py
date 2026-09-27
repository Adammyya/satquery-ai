from services.gemini_service import call_gemini

SYSTEM_PROMPT = """You are SatQuery AI, a specialized scientific remote-sensing intelligence engine.
Your role is to perform multimodal fusion between Optical and Synthetic Aperture Radar (SAR) observations.

CRITICAL INSTRUCTION:
True multimodal cross-sensor analysis requires authentic independent data from both optical (visible spectrum) and SAR (microwave backscatter) sensors.
You must NOT evaluate a synthetically converted grayscale optical image as a valid SAR measurement.
If the authentic SAR sensor input is not provided, you must declare that multimodal fusion cannot be performed.

You must respond ONLY with a valid JSON object with this exact structure:
{
  "answer": "Concise factual description of the multimodal fusion results.",
  "confidence": 0.85,
  "uncertainty": "Explanation of potential sensor alignment or backscatter interpretation ambiguities.",
  "evidence": {
    "type": "MULTIMODAL",
    "description": "Factual evidence of the cross-sensor correlation.",
    "spatial_evidence_available": false,
    "requirements_status": "SAR sensor and Optical sensor inputs verified."
  }
}
"""

def run_optical_sar(query: str, image_bytes: bytes, mime_type: str, image_filename: str, sar_bytes: bytes = None, sar_mime: str = None, sar_filename: str = None) -> dict:
    if not sar_bytes:
        # Fallback if no SAR image is provided
        return {
            "answer": "Synthetic Aperture Radar (SAR) input is required for true cross-sensor radar backscatter analysis. Currently, only an optical modality observation is loaded.",
            "confidence": None,
            "uncertainty": "Data requirements not met. Missing authentic SAR sensor input.",
            "evidence": {
                "type": "METADATA",
                "description": "Missing required SAR data.",
                "spatial_evidence_available": False,
                "requirements_status": "SAR SENSOR INPUT REQUIRED.",
            }
        }

    user_prompt = f"User Query: {query}\nOptical Image Filename: {image_filename}\nSAR Image Filename: {sar_filename}\nAnalyze the multimodal correlation between the images and return the required JSON."

    # In a full implementation, we would pass both images to the model if it supports multi-image inputs.
    return {
        "answer": "Synthetic Aperture Radar (SAR) input is required for true cross-sensor radar backscatter analysis. Currently, only an optical modality observation is loaded.",
        "confidence": None,
        "uncertainty": "Data requirements not met. Missing authentic SAR sensor input.",
        "evidence": {
            "type": "METADATA",
            "description": "Missing required SAR data.",
            "spatial_evidence_available": False,
            "requirements_status": "SAR SENSOR INPUT REQUIRED.",
        }
    }
