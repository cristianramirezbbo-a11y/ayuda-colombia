/**
 * Geocodificación de direcciones vía Nominatim (buscador de OpenStreetMap,
 * gratis, sin API key). Se usa cuando alguien escribe una dirección en vez
 * de (o además de) usar el GPS del navegador, para poder ubicarla en el
 * mapa igual que si hubiera compartido su ubicación.
 *
 * Política de uso de Nominatim: máximo ~1 solicitud/segundo y un
 * User-Agent identificable — razonable para el volumen de esta app
 * comunitaria. Si el tráfico creciera mucho, habría que migrar a una
 * instancia propia o un proveedor con más capacidad.
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "ayuda-colombia-app/0.1 (+contacto)";

interface ResultadoNominatim {
  lat: string;
  lon: string;
}

export async function geocodificarDireccion(
  direccion: string,
): Promise<{ lat: number; lon: number } | null> {
  const texto = direccion.trim();
  if (!texto) return null;

  try {
    const params = new URLSearchParams({
      q: texto,
      format: "json",
      limit: "1",
      countrycodes: "co",
    });

    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as ResultadoNominatim[];
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { lat, lon };
  } catch {
    return null;
  }
}
