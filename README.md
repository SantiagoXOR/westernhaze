# WesternHaze MVP

App de diagnóstico de cultivo (Expo + FastAPI). Un solo despliegue en Vercel: frontend estático + API serverless.

## Estructura

- **westernhaze-app/** — App React Native (Expo), pantallas, tema Dark. Build web → `westernhaze-app/dist`.
- **api/** — Punto de entrada de la API en Vercel: `api/index.py` expone la app FastAPI (rutas bajo `/api`).
- **backend/** — Lógica compartida de la API: FastAPI, Supabase, OpenAI, Prompt Maestro.
- **westernhaze-backend/** — Código legacy para correr el backend con Uvicorn en local (opcional).

## Cómo ejecutar en local

**Backend (API en 8000):**
```bash
cd westernhaze-backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # SUPABASE_*, OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

**App:**
```bash
cd westernhaze-app
cp .env.example .env   # EXPO_PUBLIC_SUPABASE_*, EXPO_PUBLIC_API_URL=http://localhost:8000
npm start
```

Para probar frontend y API en el mismo origen (como en Vercel): `vercel dev` en la raíz del repo (requiere Vercel CLI).

## Desplegar en Vercel (frontend + API)

1. Conecta el repo en [Vercel](https://vercel.com). **Root Directory** = raíz del repo (no `westernhaze-app`).
2. El `vercel.json` en la raíz define: build de la app Expo, salida en `westernhaze-app/dist`, y la API en `api/`.
3. **Environment Variables** en el proyecto Vercel:
   - **Frontend (build):** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.  
     Opcional: `EXPO_PUBLIC_API_URL` en blanco o la misma URL del deploy para que la app llame a `/api/*` en la misma origen.
   - **API (serverless):** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.
4. Despliega. La web se sirve en `/` y la API en `/api/healthcheck` y `/api/analyze-scan`.

## Supabase

- Esquema y RLS: `westernhaze-backend/supabase/migrations/001_initial_schema.sql`
- Bucket `plant-photos` y políticas: `westernhaze-backend/supabase/storage_policies.sql`
