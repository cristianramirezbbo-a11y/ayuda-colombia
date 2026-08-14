import { db } from "./db";
import { geocodificarDireccion } from "./geocoding";
import {
  CATEGORIAS_VALIDAS,
  type CategoriaReporte,
  type Reporte,
} from "./reportes-types";

export type { CategoriaReporte, Reporte };
export { CATEGORIA_INFO } from "./reportes-types";

const DIAS_EXPIRACION = 7;

export class ReporteError extends Error {}

function limpiar(valor: unknown, max: number): string | null {
  const s = String(valor ?? "").trim().slice(0, max);
  return s || null;
}

function filaAReporte(fila: Record<string, unknown>): Reporte {
  return {
    id: Number(fila.id),
    category: fila.category as CategoriaReporte,
    title: String(fila.title),
    description: fila.description == null ? null : String(fila.description),
    lat: fila.lat == null ? null : Number(fila.lat),
    lon: fila.lon == null ? null : Number(fila.lon),
    locationLabel: fila.location_label == null ? null : String(fila.location_label),
    contact: fila.contact == null ? null : String(fila.contact),
    status: fila.status as "activo" | "resuelto",
    createdAt: String(fila.created_at),
    updatedAt: String(fila.updated_at),
  };
}

export async function crearReporte(input: {
  category: unknown;
  title: unknown;
  description: unknown;
  lat: unknown;
  lon: unknown;
  locationLabel: unknown;
  contact: unknown;
}): Promise<Reporte> {
  if (!CATEGORIAS_VALIDAS.includes(input.category as CategoriaReporte)) {
    throw new ReporteError("Categoría inválida.");
  }
  const title = limpiar(input.title, 120);
  if (!title) {
    throw new ReporteError("Falta describir qué está pasando.");
  }

  let lat = input.lat != null && input.lat !== "" ? Number(input.lat) : null;
  let lon = input.lon != null && input.lon !== "" ? Number(input.lon) : null;
  if ((lat != null && Number.isNaN(lat)) || (lon != null && Number.isNaN(lon))) {
    throw new ReporteError("Ubicación inválida.");
  }

  const description = limpiar(input.description, 500);
  const locationLabel = limpiar(input.locationLabel, 100);
  const contact = limpiar(input.contact, 80);
  const category = input.category as CategoriaReporte;
  const ahora = new Date().toISOString();

  // Si no llegó ubicación por GPS pero sí escribieron una dirección,
  // calculamos las coordenadas a partir del texto para poder ubicarlo en
  // el mapa igual. Si la dirección no se puede geocodificar, el reporte
  // se sigue creando (solo queda sin pin en el mapa).
  if (lat == null && lon == null && locationLabel) {
    const geo = await geocodificarDireccion(locationLabel);
    if (geo) {
      lat = geo.lat;
      lon = geo.lon;
    }
  }

  const sql = await db();
  const [fila] = await sql`
    INSERT INTO reports
      (category, title, description, lat, lon, location_label, contact, status, created_at, updated_at)
    VALUES
      (${category}, ${title}, ${description}, ${lat}, ${lon}, ${locationLabel}, ${contact}, 'activo', ${ahora}, ${ahora})
    RETURNING *
  `;

  return filaAReporte(fila);
}

/** Reportes activos y no expirados, más recientes primero. */
export async function listarReportesActivos(): Promise<Reporte[]> {
  const sql = await db();
  const corte = new Date(
    Date.now() - DIAS_EXPIRACION * 24 * 60 * 60 * 1000,
  ).toISOString();

  const filas = await sql`
    SELECT * FROM reports
    WHERE status = 'activo' AND created_at >= ${corte}
    ORDER BY created_at DESC
  `;

  return filas.map(filaAReporte);
}

export async function marcarResuelto(id: number): Promise<void> {
  const sql = await db();
  const ahora = new Date().toISOString();
  await sql`
    UPDATE reports SET status = 'resuelto', updated_at = ${ahora} WHERE id = ${id}
  `;
}
