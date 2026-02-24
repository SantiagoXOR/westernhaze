const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeScan({ userId, imageUrl, growthStage }) {
  const res = await fetch(`${API_BASE}/api/analyze-scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      image_url: imageUrl,
      growth_stage: growthStage || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Error al analizar");
  }
  return res.json();
}
