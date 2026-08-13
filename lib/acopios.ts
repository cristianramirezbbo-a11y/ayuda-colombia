import { randomBytes } from "node:crypto";
import { db } from "./db";
import {
  ESTADOS_ACOPIO_VALIDOS,
  type Acopio,
  type EstadoAcopio,
} from "./acopios-types";

export type { Acopio, EstadoAcopio };
export { ESTADO_ACOPIO_INFO } from "./acopios-types";

export class AcopioError extends Error {}

function limpiar(valor: unknown, max: number): string | null {
  const s = String(valor ?? "").trim().slice(0, max);
  return s || null;
}

function generarToken(): string {
  return randomBytes(24).toString("base64url");
}

function filaAAcopio(fila: Record<string, unknown>): Acopio {
  return {
    id: Number(fila.id),
    nombre: String(fila.nombre),
    recibe: fila.recibe == null ? null : String(fila.recibe),
    horario: fila.horario == null ? null : String(fila.horario),
    lat: fila.lat == null ? null : Number(fila.lat),
    lon: fila.lon == null ? null : Number(fila.lon),
    locationLabel: fila.location_label == null ? null : String(fila.location_label),
    contact: fila.contact == null ? null : String(fila.contact),
    status: fila.status as EstadoAcopio,
    createdAt: String(fila.created_at),
    updatedAt: String(fila.updated_at),
  };
}

export async function crearAcopio(input: {
  nombre: unknown;
  recibe: unknown;
  horario: unknown;
  lat: unknown;
  lon: unknown;
  locationLabel: unknown;
  contact: unknown;
}): Promise<{ acopio: Acopio; managementToken: string }> {
  const nombre = limpiar(input.nombre, 120);
  if (!nombre) {
    throw new AcopioError("Falta el nombre del punto de acopio.");
  }

  const lat = input.lat != null && input.lat !== "" ? Number(input.lat) : null;
  const lon = input.lon != null && input.lon !== "" ? Number(input.lon) : null;
  if ((lat != null && Number.isNaN(lat)) || (lon != null && Number.isNaN(lon))) {
    throw new AcopioError("Ubicación inválida.");
  }

  const recibe = limpiar(input.recibe, 200);
  const horario = limpiar(input.horario, 100);
  const locationLabel = limpiar(input.locationLabel, 100);
  const contact = limpiar(input.contact, 80);
  const managementToken = generarToken();
  const ahora = new Date().toISOString();

  const sql = await db();
  const [fila] = await sql`
    INSERT INTO acopios
      (management_token, nombre, recibe, horario, lat, lon, location_label, contact, status, created_at, updated_at)
    VALUES
      (${managementToken}, ${nombre}, ${recibe}, ${horario}, ${lat}, ${lon}, ${locationLabel}, ${contact}, 'abierto', ${ahora}, ${ahora})
    RETURNING *
  `;

  return { acopio: filaAAcopio(fila), managementToken };
}

export async function listarAcopios(): Promise<Acopio[]> {
  const sql = await db();
  const filas = await sql`SELECT * FROM acopios ORDER BY updated_at DESC`;
  return filas.map(filaAAcopio);
}

export async function obtenerAcopioPorId(id: number): Promise<Acopio | null> {
  const sql = await db();
  const [fila] = await sql`SELECT * FROM acopios WHERE id = ${id}`;
  return fila ? filaAAcopio(fila) : null;
}

/** Actualiza el estado; lanza si el código de gestión no coincide. */
export async function actualizarEstadoAcopio(
  id: number,
  managementToken: string,
  status: unknown,
): Promise<Acopio> {
  if (!ESTADOS_ACOPIO_VALIDOS.includes(status as EstadoAcopio)) {
    throw new AcopioError("Estado inválido.");
  }

  const sql = await db();
  const ahora = new Date().toISOString();
  const [fila] = await sql`
    UPDATE acopios SET status = ${status as string}, updated_at = ${ahora}
    WHERE id = ${id} AND management_token = ${managementToken}
    RETURNING *
  `;

  if (!fila) {
    throw new AcopioError("Código de gestión incorrecto para este acopio.");
  }

  return filaAAcopio(fila);
}
