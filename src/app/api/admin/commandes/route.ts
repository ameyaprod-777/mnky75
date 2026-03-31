import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Commande } from "@/types/commande";

/**
 * GET /api/admin/commandes — Liste des commandes
 */
export async function GET() {
  try {
    const q = await query<{
      id: string;
      items: unknown;
      statut: string;
      commentaire: string | null;
      created_at: string;
      updated_at: string;
    }>(
      `SELECT id, items, statut, commentaire, created_at, updated_at
       FROM commandes
       ORDER BY created_at DESC`
    );
    if (!q) return NextResponse.json([]);
    const commandes: Commande[] = q.rows.map((r) => ({
      id: r.id,
      items: (r.items as Commande["items"]) ?? [],
      statut: r.statut as Commande["statut"],
      commentaire: r.commentaire ?? undefined,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    return NextResponse.json(commandes);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors du chargement des commandes." },
      { status: 500 }
    );
  }
}
