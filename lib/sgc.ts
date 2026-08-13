/**
 * Adaptador de datos sísmicos del Servicio Geológico Colombiano (SGC).
 *
 * Endpoints verificados en vivo (spike 2026-08-13):
 *  - Feed últimos 5 días:  https://archive.sgc.gov.co/feed/v1.0.1/summary/five_days_all.json
 *    → FeatureCollection, coordenadas [lat, lon, depth]  ← ¡orden distinto!
 *  - Catálogo quincenal:   https://api.sgc.gov.co/biweekly/biweekly_earthquakes?startdate=...&enddate=...
 *    → FeatureCollection, coordenadas [lon, lat, depth]
 *
 * Los contratos del SGC pueden cambiar sin aviso: cada parseo valida el
 * esquema y lanza un error tipado si algo falta, en vez de devolver datos rotos.
 */

export interface Sismo {
  id: string;
  mag: number;
  magType: string;
  place: string;
  closerTowns: string;
  status: "automatic" | "manual";
  utcTime: string;
  localTime: string;
  updated: string;
  depth: number; // km
  lon: number;
  lat: number;
  mmi: number | null; // intensidad Mercalli modificada
  felt: number; // nº de reportes de percepción
}

interface SgcFeature {
  type?: string;
  id?: string;
  geometry?: { type?: string; coordinates?: number[] };
  properties?: {
    status?: string;
    type?: string;
    magType?: string;
    agency?: string;
    utcTime?: string;
    localTime?: string;
    updated?: string;
    place?: string;
    mag?: number;
    mmi?: number | null;
    depth?: number;
    felt?: number;
    closerTowns?: string;
  };
}

const FEED_5_DAYS_URL =
  "https://archive.sgc.gov.co/feed/v1.0.1/summary/five_days_all.json";
const CATALOGO_URL = "https://api.sgc.gov.co/biweekly/biweekly_earthquakes";

const USER_AGENT = "sismos-colombia-app/0.1 (+contacto)";

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": USER_AGENT, ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`SGC HTTP ${res.status} en ${url}`);
  }
  return res.json();
}

function assertNumber(v: unknown, field: string): number {
  if (typeof v !== "number" || Number.isNaN(v)) {
    throw new Error(`Esquema SGC roto: "${field}" no es un número`);
  }
  return v;
}

function assertString(v: unknown, field: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`Esquema SGC roto: "${field}" no es un string`);
  }
  return v;
}

/**
 * Normaliza un feature del SGC al modelo propio.
 * @param feature feature GeoJSON del SGC
 * @param coords "lat-lon" si las coordenadas vienen [lat, lon, depth] (feed 5 días)
 *               o "lon-lat" si vienen [lon, lat, depth] (catálogo quincenal)
 */
export function parseSgcFeature(
  feature: SgcFeature,
  coords: "lat-lon" | "lon-lat",
): Sismo {
  const p = feature.properties;
  if (!p || !feature.id || !feature.geometry?.coordinates) {
    throw new Error("Esquema SGC roto: feature incompleto");
  }
  const [a, b, depthRaw] = feature.geometry.coordinates;
  const depth = typeof depthRaw === "number" ? depthRaw : (p.depth ?? 0);
  const [lon, lat] =
    coords === "lat-lon" ? [b, a] : [a, b];
  return {
    id: feature.id,
    mag: assertNumber(p.mag, "mag"),
    magType: assertString(p.magType ?? "M", "magType"),
    place: assertString(p.place, "place"),
    closerTowns: p.closerTowns ?? "",
    status: p.status === "manual" ? "manual" : "automatic",
    utcTime: assertString(p.utcTime, "utcTime"),
    localTime: assertString(p.localTime, "localTime"),
    updated: assertString(p.updated ?? p.utcTime ?? "", "updated"),
    depth,
    lon,
    lat,
    mmi: typeof p.mmi === "number" ? p.mmi : null,
    felt: typeof p.felt === "number" ? p.felt : 0,
  };
}

/**
 * El feed del SGC incluye, además de sismos en Colombia, sismicidad
 * regional de países vecinos que monitorea de fondo (Venezuela, Ecuador,
 * Panamá, Perú, océanos cercanos). El campo `place` incluye ", Colombia"
 * de forma consistente cuando el epicentro está en territorio colombiano
 * (verificado contra el feed en vivo el 2026-08-13: 29 de 665 eventos no
 * lo incluían, todos correspondían a otros países).
 */
function esDeColombia(sismo: Sismo): boolean {
  return sismo.place.includes("Colombia");
}

/** Sismos de los últimos 5 días en Colombia (fuente principal, la más fresca). */
export async function fetchSismosRecientes(): Promise<Sismo[]> {
  const data = (await fetchJson(FEED_5_DAYS_URL)) as {
    features?: SgcFeature[];
  };
  if (!Array.isArray(data.features)) {
    throw new Error("Esquema SGC roto: feed de 5 días sin features");
  }
  return data.features.map((f) => parseSgcFeature(f, "lat-lon")).filter(esDeColombia);
}

/** Catálogo histórico en Colombia en un rango de fechas (ISO, ej. 2026-08-01). */
export async function fetchCatalogo(
  start: string,
  end: string,
): Promise<Sismo[]> {
  const params = new URLSearchParams({
    startdate: `${start}T00:00:00`,
    enddate: `${end}T23:59:59`,
  });
  const data = (await fetchJson(`${CATALOGO_URL}?${params}`)) as {
    features?: SgcFeature[];
  };
  if (!Array.isArray(data.features)) {
    throw new Error("Esquema SGC roto: catálogo sin features");
  }
  return data.features.map((f) => parseSgcFeature(f, "lon-lat")).filter(esDeColombia);
}

/** Filtros comunes para la lista. */
export function filtrarPorMagnitud(sismos: Sismo[], minMag: number): Sismo[] {
  return sismos.filter((s) => s.mag >= minMag);
}

/**
 * Busca un sismo por id dentro del feed de los últimos 5 días.
 * Solo cubre eventos recientes: es la misma ventana que muestra la lista
 * en vivo de la página principal, desde donde se enlaza a esta ficha.
 */
export async function fetchSismoPorId(id: string): Promise<Sismo | null> {
  const sismos = await fetchSismosRecientes();
  return sismos.find((s) => s.id === id) ?? null;
}
