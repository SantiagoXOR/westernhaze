-- WesternHaze - Políticas RLS para bucket plant-photos
-- 1. Crear el bucket en Dashboard: Storage > New bucket > id/name "plant-photos", Private, opcional: 10MB, image/*.
-- 2. Ejecutar este SQL en SQL Editor para las políticas.
-- Las rutas de archivo deben ser: {user_id}/{filename} para que RLS identifique al dueño.

-- Política: solo el usuario dueño puede subir en su carpeta (name empieza con auth.uid())
create policy "Users can upload own plant photos"
on storage.objects for insert
with check (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: solo el usuario dueño puede leer sus fotos
create policy "Users can read own plant photos"
on storage.objects for select
using (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: solo el usuario dueño puede borrar sus fotos
create policy "Users can delete own plant photos"
on storage.objects for delete
using (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
