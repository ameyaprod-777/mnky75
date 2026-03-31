import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AppelCreate, TypeAppel } from "@/types/appel";

const TYPES: TypeAppel[] = ["serveur", "charbon"];

/**
 * POST /api/appels — Envoyer un appel serveur ou charbon (page Commander)
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, "appel");
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Trop d'appels. Réessayez dans quelques minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 900) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const type = typeof body.type === "string" && TYPES.includes(body.type as TypeAppel) ? (body.type as TypeAppel) : null;
    if (!type) {
      return NextResponse.json(
        { error: "Type invalide (serveur ou charbon)." },
        { status: 400 }
      );
    }
    const numero_table = typeof body.numero_table === "string" ? body.numero_table.trim() || null : null;
    const commentaire = typeof body.commentaire === "string" ? body.commentaire.trim() || null : null;

    const q = await query<{ id: string }>(
      `INSERT INTO appels (type, statut, numero_table, commentaire) VALUES ($1, 'en_attente', $2, $3) RETURNING id`,
      [type, numero_table, commentaire]
    );
    if (!q || q.rowCount === 0) {
      return NextResponse.json(
        { error: "Service temporairement indisponible." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: true, id: q.rows[0].id, message: type === "serveur" ? "Serveur prévenu." : "Demande de charbon envoyée." },
      { status: 201 }
    );
  } catch (e) {
    console.error("[Appels API]", e);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
