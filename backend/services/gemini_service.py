import json
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.0-flash")

client = genai.Client()


def call_gemini(
    system_prompt: str,
    user_prompt: str,
    image_bytes: bytes,
    mime_type: str,
) -> dict:
    CORE_INSTRUCTIONS = """
CRITICAL ANSWERING RULES - READ CAREFULLY:
1. DIRECT ANSWER: You MUST prioritize answering the USER'S SPECIFIC QUESTION directly. DO NOT start with a generic description or caption of the entire image unless the user explicitly asks for a "description" or "what do you see".
2. STRUCTURE: Your 'answer' must follow this exact order:
   A) DIRECT ANSWER (Start with a direct Yes/No or specific answer to the question).
   B) SHORT OBSERVATION (1-2 sentences of supporting evidence from the image).
   C) LIMITATION (If uncertain or if the image resolution/data is insufficient to be 100% sure, clearly state what CANNOT be confirmed).
3. TARGET AUDIENCE: The answer must be clear, direct, and simple (aimed at farmers or non-technical users). Avoid unnecessary GIS jargon, or explain it simply if required (e.g. use "green areas" instead of "high spectral heterogeneity"). Keep answers concise (2-5 sentences).
4. NO HALLUCINATION: Only state what is VISIBLE in the image. If asked about "disease", "crop health", "exact water quality", or "flood risk", and the image alone isn't enough, you MUST state that it cannot be confirmed from this single image without more data/resolution.
5. LANGUAGE MATCHING: You MUST analyze the language and style of the user's query and write the 'answer' field in the EXACT same language and style.
   - If query is English, answer in English.
   - If query is Hinglish (e.g., 'Is image mein...'), answer in natural Hinglish. DO NOT translate into formal Hindi.
   - If query is Hindi, answer in Hindi.
   - Preserve technical remote-sensing terms (SAR, NDVI, vegetation, crop, water body) in English.
NOTE: Only apply these rules to the text meant for the user in the 'answer' or 'evidence' field. Do NOT translate JSON keys.
"""
    system_prompt = system_prompt + "\n" + CORE_INSTRUCTIONS


    max_attempts = 3
    current_model = GEMINI_MODEL

    for attempt in range(1, max_attempts + 1):
        try:
            response = client.models.generate_content(
                model=current_model,
                contents=[
                    system_prompt,
                    user_prompt,
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type,
                    ),
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )

            raw_text = response.text or "{}"

            try:
                return json.loads(raw_text)
            except json.JSONDecodeError:
                clean_text = raw_text.strip()

                if clean_text.startswith("```json"):
                    clean_text = clean_text[7:]

                if clean_text.startswith("```"):
                    clean_text = clean_text[3:]

                if clean_text.endswith("```"):
                    clean_text = clean_text[:-3]

                return json.loads(clean_text.strip())

        except Exception as exc:
            error_text = str(exc)

            # Model not found — wrong name, wrong API version, or not enabled on this key.
            # Never retry; surface a clear message immediately.
            if "404" in error_text or "NOT_FOUND" in error_text:
                raise Exception(
                    f"GEMINI_MODEL_NOT_FOUND: '{current_model}' is not available "
                    "for this API key / version. Set a valid GEMINI_MODEL in Render env vars."
                ) from exc

            if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
                if current_model == GEMINI_MODEL and GEMINI_FALLBACK_MODEL:
                    # Switch to fallback model immediately — no sleep, no retry count spent
                    current_model = GEMINI_FALLBACK_MODEL
                    continue
                else:
                    # Fallback also exhausted (or no fallback configured)
                    raise Exception("GEMINI_QUOTA_EXHAUSTED") from exc

            # Retry only genuinely transient server errors
            is_transient = "503" in error_text or "UNAVAILABLE" in error_text

            if not is_transient or attempt == max_attempts:
                raise

            # Exponential backoff: 2 s, then 4 s
            time.sleep(2 ** attempt)