# WesternHaze MVP

Proyecto migrado a esta ubicación.

## Estructura

- **westernhaze-backend/** — API FastAPI, Prompt Maestro, Supabase (esquema SQL en `supabase/`).
- **westernhaze-app/** — App React Native (Expo), pantallas, servicios, tema Dark Premium.

## Cómo ejecutar

**Backend:**
```bash
cd westernhaze-backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # Configurar Supabase y OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

**App:**
```bash
cd westernhaze-app
cp .env.example .env   # Configurar EXPO_PUBLIC_SUPABASE_* y EXPO_PUBLIC_API_URL
npm start
```

## Desplegar la app en Vercel

1. Conecta el repo en [Vercel](https://vercel.com) y elige **Root Directory** → `westernhaze-app`.
2. Vercel usará el `vercel.json` del proyecto (build: `npm run build:web`, output: `dist`).
3. En **Settings → Environment Variables** define:
   - `EXPO_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — clave anon/public de Supabase
   - `EXPO_PUBLIC_API_URL` — URL del backend en producción (ej. `https://tu-api.onrender.com`)
4. Despliega. La app web se servirá como SPA (todas las rutas sirven `index.html`).
