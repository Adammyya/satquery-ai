import json
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

client = genai.Client()


def call_gemini(
    system_prompt: str,
    user_prompt: str,
    image_bytes: bytes,
    mime_type: str,
) -> dict:
    language_rule = """
IMPORTANT LANGUAGE RULE: You must analyze the language and style of the user's query and write the 'answer' field in the EXACT same language and style.
- If query is English, answer in English.
- If query is Hinglish (e.g., 'Is image mein...'), answer in natural Hinglish.
- If query is Hindi, answer in Hindi.
- Preserve technical remote-sensing terms (SAR, NDVI, vegetation, etc.) in English.
NOTE: Only translate the text meant for the user in the answer or evidence. Do NOT translate JSON keys.
"""
    system_prompt = system_prompt + "\n" + language_rule


    max_attempts = 3

    for attempt in range(1, max_attempts + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
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

            # Retry transient Gemini availability/rate-limit failures.
            is_transient = (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            )

            if not is_transient or attempt == max_attempts:
                raise

            # Exponential backoff: 2s, then 4s.
            time.sleep(2 ** attempt)