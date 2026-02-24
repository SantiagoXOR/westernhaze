# WesternHaze App (Expo)

## Setup

```bash
cd westernhaze-app
npm install
cp .env.example .env   # Editar EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
```

Para desarrollo local, opcional: `EXPO_PUBLIC_API_URL=http://localhost:8000` (o la IP de tu máquina si pruebas en dispositivo).

## Ejecutar

```bash
npm start
# Luego escanear QR con Expo Go (Android) o cámara (iOS)
```

## Builds para testers (Fase 5)

- **Android APK:** `npx expo run:android` (requiere Android Studio) o EAS Build: `eas build --platform android --profile preview`.
- **iOS TestFlight:** `eas build --platform ios --profile preview` (requiere cuenta Apple Developer).

Configurar `EXPO_PUBLIC_API_URL` con la URL del backend en producción antes de generar el build.

## Flujo E2E (prueba manual)

1. **Login/Registro:** Abrir app → Registrarse o Iniciar sesión con Supabase Auth.
2. **Dashboard:** Ver Health Score (o "—" si no hay reportes), última alerta, botón "Iniciar escaneo diario".
3. **Captura:** Pulsar "Iniciar escaneo" → Permitir cámara → Encuadrar planta en el overlay → Tomar foto → Confirmar.
4. **Subida:** La app sube la imagen a Supabase Storage (bucket `plant-photos`). Si falla por red, se muestra alerta.
5. **Análisis:** Pantalla "Analizando..." → El backend llama a la IA y guarda el reporte. Si la API falla, se muestra error y se vuelve atrás.
6. **Reporte:** Se navega al reporte del día con imagen, hallazgo principal, plan de acción con checkboxes (solo visual en MVP).
7. Repetir el flujo 2–6 para validar estabilidad (p. ej. 10 veces como indica el plan).