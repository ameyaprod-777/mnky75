import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * PATCH /api/admin/appels/[id] — Mettre à jour le statut d'un appel
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _request.json().catch(() => ({}));
    const statut =
      body.statut === "traite" || body.statut === "annulee" ? body.statut : null;
    if (!statut) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }
    if (statut === "annulee") {
      const qType = await query<{ type: string }>(
        `SELECT type FROM appels WHERE id = $1`,
        [id]
      );
      if (!qType || qType.rowCount === 0) {
        return NextResponse.json({ error: "Appel introuvable." }, { status: 404 });
      }
      if (qType.rows[0].type !== "charbon") {
        return NextResponse.json(
          { error: "Seuls les appels charbon peuvent être annulés." },
          { status: 400 }
        );
      }
    }
    const q = await query(
      `UPDATE appels SET statut = $1 WHERE id = $2 RETURNING id`,
      [statut, id]
    );
    if (!q || q.rowCount === 0) {
      return NextResponse.json({ error: "Appel introuvable." }, { status: 404 });
    }
    return NextResponse.json({ success: true, statut });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    );
  }
}
