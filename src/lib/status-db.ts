import { query } from "@/lib/db";

const STATUS_ID = "00000000-0000-0000-0000-000000000001";

export interface StatusRow {
  is_open: boolean;
  message_custom: string | null;
  blocked_creneaux: unknown;
  delai_commandes: string | null;
}

/**
 * Lit le statut restaurant depuis la BDD (ligne singleton).
 * Retourne null si la BDD n'est pas dispo ou si les colonnes étendues n'existent pas encore.
 */
export async function getStatusFromDb(): Promise<{
  is_open: boolean;
  message: string | null;
  blockedCreneaux: string[];
  delaiCommandes: string | null;
} | null> {
  try {
    const q = await query<StatusRow>(
      `SELECT is_open, message_custom, blocked_creneaux, delai_commandes
       FROM restaurant_status WHERE id = $1`,
      [STATUS_ID]
    );
    if (!q || q.rows.length === 0) return null;
    const r = q.rows[0];
    const rawBlocked = r.blocked_creneaux;
    const blockedCreneaux = Array.isArray(rawBlocked)
      ? (rawBlocked as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    return {
      is_open: r.is_open,
      message: r.message_custom ?? null,
      blockedCreneaux,
      delaiCommandes: r.delai_commandes ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Met à jour le statut restaurant en BDD.
 * Retourne false si la BDD n'est pas dispo ou si les colonnes n'existent pas.
 */
export async function setStatusInDb(update: {
  is_open?: boolean;
  message?: string | null;
  blockedCreneaux?: string[];
  delaiCommandes?: string | null;
}): Promise<boolean> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (update.is_open !== undefined) {
    updates.push(`is_open = $${i++}`);
    values.push(update.is_open);
  }
  if (update.message !== undefined) {
    updates.push(`message_custom = $${i++}`);
    values.push(update.message);
  }
  if (update.blockedCreneaux !== undefined) {
    updates.push(`blocked_creneaux = $${i++}`);
    values.push(JSON.stringify(update.blockedCreneaux));
  }
  if (update.delaiCommandes !== undefined) {
    updates.push(`delai_commandes = $${i++}`);
    values.push(update.delaiCommandes);
  }
  if (updates.length === 0) return true;
  values.push(STATUS_ID);
  try {
    const q = await query(
      `UPDATE restaurant_status SET ${updates.join(", ")}, updated_at = now() WHERE id = $${i} RETURNING id`,
      values
    );
    return !!(q && q.rowCount && q.rowCount > 0);
  } catch {
    return false;
  }
}
