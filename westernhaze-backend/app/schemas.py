from pydantic import BaseModel, Field


class AnalyzeScanRequest(BaseModel):
    user_id: str = Field(..., description="UUID del usuario (auth.uid())")
    image_url: str = Field(..., description="URL de la imagen subida (Supabase signed o pública)")
    growth_stage: str | None = Field(None, description="Ej: Semana 3 de Floración")


class AnalyzeScanResponse(BaseModel):
    report_id: str
    health_score: int
    status_summary: str


# Estructura esperada del JSON que devuelve el LLM
class AnalysisJSON(BaseModel):
    health_score: int = Field(..., ge=0, le=100)
    status_summary: str
    severity_level: str = Field(..., pattern="^(low|medium|high)$")
    main_finding_title: str
    finding_details: str
    action_plan: list[str]
