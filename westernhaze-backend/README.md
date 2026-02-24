# WesternHaze Backend (FastAPI)

## Setup

```bash
cd westernhaze-backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # Editar con tus keys de Supabase y OpenAI/Google
```

## Supabase

1. Crear proyecto en [Supabase](https://supabase.com).
2. En SQL Editor: ejecutar `supabase/migrations/001_initial_schema.sql`.
3. En Storage: crear bucket "plant-photos" (privado). Luego ejecutar `supabase/storage_policies.sql`.

## Ejecutar

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

`GET http://localhost:8000/healthcheck` → `{"status":"OK"}`.

## Despliegue (Render)

1. Conectar el repo en Render y seleccionar el directorio del backend (o usar `render.yaml`).
2. Configurar variables de entorno: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.
3. El servicio usará `PORT` que Render inyecta automáticamente.
