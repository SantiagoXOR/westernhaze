import { supabase } from "./supabase";

const BUCKET = "plant-photos";

/**
 * Sube una foto al bucket plant-photos.
 * @param {string} uri - URI local de la imagen (ej. de takePictureAsync)
 * @param {string} userId - UUID del usuario (auth.uid())
 * @param {string} [filename] - Nombre del archivo (default: timestamp + .jpg)
 * @returns {Promise<{ url: string, path: string }>} URL pública firmada y path
 */
export async function uploadPlantPhoto(uri, userId, filename) {
  const name = filename || `${userId}/${Date.now()}.jpg`;
  const path = name.startsWith(userId + "/") ? name : `${userId}/${name}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(data.path, 60 * 60 * 24); // 24h

  return {
    path: data.path,
    url: signed?.signedUrl || data.path,
  };
}
