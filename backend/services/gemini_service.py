import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
client = genai.Client()

def call_gemini(system_prompt: str, user_prompt: str, image_bytes: bytes, mime_type: str) -> dict:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            system_prompt,
            user_prompt,
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )

    raw_text = response.text or "{}"
    try:
        return json.loads(raw_text)
    except Exception:
        clean_text = raw_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        return json.loads(clean_text.strip())
