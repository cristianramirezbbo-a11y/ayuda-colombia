import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

let sqlInstance: Sql | null = null;
let schemaReady: Promise<void> | null = null;

/**
 * Base de datos Postgres (compatible con Vercel serverless). Usa la
 * variable de entorno DATABASE_URL — funciona tal cual con la capa
 * gratuita de Neon (integrable desde el dashboard de Vercel en "Storage")
 * o cualquier otro Postgres gestionado gratuito.
 *
 * A diferencia de un archivo SQLite local, esto sí persiste entre
 * invocaciones serverless: cada función de Vercel es efímera, pero todas
 * comparten la misma base de datos remota.
 */
function getSql(): Sql {
  if (sqlInstance) return sqlInstance;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Falta la variable de entorno DATABASE_URL. Crea una base Postgres gratuita " +
        "(ej. Neon desde el dashboard de Vercel → Storage → Postgres) y ponla en " +
        ".env.local para desarrollo, y en las variables de entorno del proyecto en Vercel.",
    );
  }

  // El modo SSL se toma de `?sslmode=...` en la propia URL (estándar de
  // Postgres). Los proveedores gratuitos como Neon ya la incluyen en la
  // connection string que entregan.
  sqlInstance = postgres(url);
  return sqlInstance;
}

async function migrar(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      lat DOUBLE PRECISION,
      lon DOUBLE PRECISION,
      location_label TEXT,
      contact TEXT,
      status TEXT NOT NULL DEFAULT 'activo',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_reports_status_created
      ON reports(status, created_at)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS acopios (
      id SERIAL PRIMARY KEY,
      management_token TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      recibe TEXT,
      horario TEXT,
      lat DOUBLE PRECISION,
      lon DOUBLE PRECISION,
      location_label TEXT,
      contact TEXT,
      status TEXT NOT NULL DEFAULT 'abierto',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_acopios_status ON acopios(status)
  `;
}

/** Debe esperarse antes de cualquier query. Solo migra una vez por instancia tibia. */
export async function db(): Promise<Sql> {
  const sql = getSql();
  if (!schemaReady) {
    schemaReady = migrar(sql);
  }
  await schemaReady;
  return sql;
}
