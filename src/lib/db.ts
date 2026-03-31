import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

/**
 * Pool PostgreSQL pour les API routes.
 * Si DATABASE_URL n'est pas défini, retourne null (mode sans BDD).
 */
function getPool(): Pool | null {
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

/**
 * Exécute une requête. Retourne null si la BDD n'est pas configurée.
 */
export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number } | null> {
  const p = getPool();
  if (!p) return null;
  try {
    const result = await p.query(text, params);
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
  } catch (e) {
    // En cas d'erreur de connexion (ECONNREFUSED, etc.), on retourne null
    // pour que les handlers API puissent gérer proprement l'absence de BDD.
    console.error("[DB] query error", e);
    return null;
  }
}

export { getPool };
