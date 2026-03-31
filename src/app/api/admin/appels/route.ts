import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Appel } from "@/types/appel";

/**
 * GET /api/admin/appels — Liste des appels (en attente en premier)
 */
export async function GET() {
  try {
    const q = await query<{
      id: string;
      type: string;
      statut: string;
      numero_table: string | null;
      commentaire: string | null;
      created_at: string;
      updated_at: string;
    }>(
      `SELECT id, type, statut, numero_table, commentaire, created_at, updated_at
       FROM appels
       ORDER BY CASE WHEN statut = 'en_attente' THEN 0 ELSE 1 END, created_at DESC`
    );
    if (!q) return NextResponse.json([]);
    const appels: Appel[] = q.rows.map((r) => ({
      id: r.id,
      type: r.type as Appel["type"],
      statut: r.statut as Appel["statut"],
      numero_table: r.numero_table ?? undefined,
      commentaire: r.commentaire ?? undefined,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    return NextResponse.json(appels);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors du chargement des appels." },
      { status: 500 }
    );
  }
}
