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

async function buscarEnNominatim(
  texto: string,
): Promise<{ lat: number; lon: number } | null> {
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
}

/**
 * Quita paréntesis ("(Frente a D1 rejas azules)") y numeración de
 * nomenclatura colombiana ("# 14c - 77"), que Nominatim casi nunca
 * reconoce y suele hacer fallar la búsqueda completa.
 */
function limpiarDireccion(texto: string): string {
  return texto
    .replace(/\([^)]*\)/g, " ")
    .replace(/#\s*[\w-]+(?:\s*-\s*[\w-]+)?/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function geocodificarDireccion(
  direccion: string,
): Promise<{ lat: number; lon: number } | null> {
  const original = direccion.trim();
  if (!original) return null;

  // Intento 1: la dirección tal cual. Intento 2: sin numeración/paréntesis.
  // Intento 3: solo las últimas palabras (normalmente ciudad y
  // departamento), como último recurso para al menos ubicar la zona.
  const limpia = limpiarDireccion(original);
  const palabras = limpia.split(" ").filter(Boolean);
  const soloZona = palabras.slice(-2).join(" ");

  const intentos = [...new Set([original, limpia, soloZona])].filter(Boolean);

  for (const intento of intentos) {
    try {
      const resultado = await buscarEnNominatim(intento);
      if (resultado) return resultado;
    } catch {
      // Sigue con el siguiente intento.
    }
    // Respeta el límite de Nominatim (~1 req/s) entre intentos sucesivos.
    await new Promise((r) => setTimeout(r, 1100));
  }

  return null;
}
