import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

/** Dernière erreur PostgreSQL (pour diagnostic si DATABASE_DEBUG=1). */
let lastQueryError: string | undefined;

export function getLastQueryError(): string | undefined {
  return lastQueryError;
}

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
    lastQueryError = undefined;
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
  } catch (e) {
    // En cas d'erreur de connexion (ECONNREFUSED, etc.), on retourne null
    // pour que les handlers API puissent gérer proprement l'absence de BDD.
    lastQueryError = e instanceof Error ? e.message : String(e);
    console.error("[DB] query error", e);
    return null;
  }
}

export { getPool };

/** Indique si une URL de connexion est définie (sans la divulguer). */
export function hasDatabaseUrl(): boolean {
  return Boolean(connectionString);
}

/**
 * Diagnostic pour le déploiement : connexion et présence de la table commandes.
 */
export async function getDatabaseHealth(): Promise<{
  databaseUrlDefined: boolean;
  canConnect: boolean;
  commandesTableOk: boolean;
  postgresMessage?: string;
}> {
  if (!connectionString) {
    return {
      databaseUrlDefined: false,
      canConnect: false,
      commandesTableOk: false,
      postgresMessage: "DATABASE_URL non défini (créez .env.local à la racine du projet Next.js)",
    };
  }
  const pool = getPool();
  if (!pool) {
    return {
      databaseUrlDefined: true,
      canConnect: false,
      commandesTableOk: false,
      postgresMessage: "Pool non initialisé",
    };
  }
  try {
    await pool.query("SELECT 1");
  } catch (e) {
    return {
      databaseUrlDefined: true,
      canConnect: false,
      commandesTableOk: false,
      postgresMessage: e instanceof Error ? e.message : String(e),
    };
  }
  try {
    await pool.query("SELECT 1 FROM commandes LIMIT 1");
  } catch (e) {
    return {
      databaseUrlDefined: true,
      canConnect: true,
      commandesTableOk: false,
      postgresMessage: e instanceof Error ? e.message : String(e),
    };
  }
  return {
    databaseUrlDefined: true,
    canConnect: true,
    commandesTableOk: true,
  };
}
