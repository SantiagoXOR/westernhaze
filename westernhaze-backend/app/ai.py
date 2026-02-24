import json
import re
from openai import OpenAI

from app.prompt_master import PROMPT_MASTER, build_user_context
from app.schemas import AnalysisJSON


def extract_json_from_response(text: str) -> dict | None:
    """Extrae un objeto JSON de la respuesta del LLM (puede venir envuelta en markdown o texto)."""
    text = text.strip()
    # Intentar extraer bloque ```json ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass
    # Buscar primer { hasta último }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def analyze_image_with_openai(
    image_url: str,
    growth_stage: str | None,
    api_key: str,
) -> AnalysisJSON:
    client = OpenAI(api_key=api_key)
    user_context = build_user_context(growth_stage)
    content = [
        {
            "type": "text",
            "text": f"{user_context}\n\nAnaliza la imagen de la planta de cannabis y devuelve ÚNICAMENTE el objeto JSON con la estructura indicada, sin comentarios ni texto adicional.",
        },
        {"type": "image_url", "image_url": {"url": image_url}},
    ]
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": PROMPT_MASTER},
            {"role": "user", "content": content},
        ],
        max_tokens=1024,
    )
    raw = response.choices[0].message.content or ""
    data = extract_json_from_response(raw)
    if not data:
        raise ValueError("El modelo no devolvió un JSON válido")
    return AnalysisJSON.model_validate(data)
