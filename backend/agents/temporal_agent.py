from services.gemini_service import call_gemini


SYSTEM_PROMPT = """You are SatQuery AI, a specialized scientific remote-sensing intelligence engine.
Your role is to perform temporal change detection between two co-registered Earth observation satellite images.

You will be provided with two images:
- Observation T1 = earlier/baseline observation
- Observation T2 = later/comparison observation

You will also receive a user query.

Analyze the differences between T1 and T2 and directly answer the user's specific question about:
- what changed
- where the change is visually apparent
- the direction/type of change when visually supportable
- whether the evidence is sufficient

CRITICAL INSTRUCTION:
Do not hallucinate exact geographic coordinates or synthetic change masks.
Describe changes visually and accurately based on observable spatial and spectral differences.
Do not just describe the images generically unless the user asks for a general comparison.

Consider that apparent differences can be caused by:
- acquisition lighting
- cloud or atmospheric conditions
- image alignment
- seasonal variation
- sensor differences
- actual surface change

If the images are not sufficiently aligned or comparable, clearly state that limitation.

You must respond ONLY with a valid JSON object with this exact structure:
{
  "answer": "Concise factual description of the changes observed between T1 and T2.",
  "confidence": 0.85,
  "uncertainty": "Explanation of potential alignment errors, lighting differences, seasonal effects, or other limitations.",
  "evidence": {
    "type": "TEMPORAL",
    "description": "Factual evidence of the change based on comparative visual features.",
    "spatial_evidence_available": false,
    "requirements_status": "Temporal pair successfully analyzed."
  }
}
"""


def run_temporal(
    query: str,
    image_bytes: bytes,
    mime_type: str,
    image_filename: str,
    image2_bytes: bytes = None,
    mime_type2: str = None,
    image2_filename: str = None,
) -> dict:

    # Temporal analysis requires both observations.
    if not image2_bytes:
        return {
            "answer": (
                "Temporal change detection requires two co-registered observations. "
                "Currently, only a single baseline observation is loaded."
            ),
            "confidence": None,
            "uncertainty": "Data requirements not met. Missing Observation T2.",
            "evidence": {
                "type": "METADATA",
                "description": "Missing required temporal data pair.",
                "spatial_evidence_available": False,
                "requirements_status": "Temporal analysis requires two observations.",
            },
        }

    user_prompt = (
        f"User Query: {query}\n"
        f"Observation T1 Filename: {image_filename}\n"
        f"Observation T2 Filename: {image2_filename}\n\n"
        "The first supplied image is Observation T1 and the second supplied image "
        "is Observation T2. Compare them directly and answer the user's query. "
        "Return only the required JSON object."
    )

    # Send both observations to Gemini.
    result = call_gemini(
        SYSTEM_PROMPT,
        user_prompt,
        image_bytes,
        mime_type,
        image2_bytes,
        mime_type2,
    )

    # Ensure the temporal evidence type remains explicit even if the model
    # omits or modifies it.
    if not isinstance(result, dict):
        raise ValueError("Temporal Gemini response was not a JSON object.")

    result.setdefault("evidence", {})
    result["evidence"]["type"] = "TEMPORAL"
    result["evidence"].setdefault(
        "requirements_status",
        "Temporal pair successfully analyzed.",
    )

    return result