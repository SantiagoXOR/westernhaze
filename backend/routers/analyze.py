from fastapi import APIRouter, HTTPException
from backend.schemas import AnalyzeScanRequest, AnalyzeScanResponse
from backend.ai import analyze_image_with_openai
from backend.db import get_supabase
from backend.config import Settings

router = APIRouter(tags=["analyze"])
_settings = Settings()


@router.post("/analyze-scan", response_model=AnalyzeScanResponse)
def analyze_scan(body: AnalyzeScanRequest):
    if not _settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    try:
        analysis = analyze_image_with_openai(
            image_url=body.image_url,
            growth_stage=body.growth_stage,
            api_key=_settings.openai_api_key,
        )
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error al analizar la imagen: {str(e)}",
        ) from e

    supabase = get_supabase()
    row = {
        "user_id": body.user_id,
        "image_url": body.image_url,
        "health_score": analysis.health_score,
        "json_analysis_full": analysis.model_dump(),
    }
    result = supabase.table("scan_reports").insert(row).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=500, detail="No se pudo guardar el reporte")
    report = result.data[0]
    report_id = report["id"]

    return AnalyzeScanResponse(
        report_id=report_id,
        health_score=analysis.health_score,
        status_summary=analysis.status_summary,
    )
