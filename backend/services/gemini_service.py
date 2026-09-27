import json
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL")

client = genai.Client()


def call_gemini(
    system_prompt: str,
    user_prompt: str,
    image_bytes: bytes,
    mime_type: str,
) -> dict:
    lang_instruction = "IMPORTANT: Mirror the exact language, script, and stylistic tone of the user's query. If the query is in English, answer in English. If the query is in Hindi, answer in Hindi. If the query is a mix of Hindi and English (Hinglish), answer in natural Hinglish using the same Roman script mix, retaining technical remote-sensing terminology in English where natural. Do NOT force formal translation or randomly switch to English."

    CORE_INSTRUCTIONS = f"""
LANGUAGE RULE (HIGHEST PRIORITY):
{lang_instruction}
The 'answer' field language MUST match the user query language exactly. Do NOT translate the user's language. Technical terms (SAR, NDVI, vegetation, RGB, temporal) may remain in English regardless of query language.

CRITICAL ANSWERING RULES:
1. DIRECT ANSWER: Answer the USER'S SPECIFIC QUESTION directly. Do NOT give a generic image description unless the user explicitly asks to "describe the image" or "what do you see".
2. STRUCTURE: answer = (A) Direct Yes/No or specific answer → (B) 1-2 sentences of visual evidence → (C) limitation if uncertain.
3. FARMER-FRIENDLY: Simple, clear, practical. Avoid jargon or explain it simply.
4. NO HALLUCINATION: Only state what is VISIBLE. If you cannot confirm crop disease, flood risk, exact coordinates etc. from this single image, say so clearly in the SAME language as the query.
5. CONCISE: 2-5 sentences in the 'answer' field.
NOTE: Apply language and content rules only to 'answer' and 'evidence.description' fields. Do NOT translate JSON keys.
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

    raise Exception("Max retries exceeded for Gemini API call.")