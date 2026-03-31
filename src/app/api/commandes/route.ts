import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import type { CommandeItem } from "@/types/commande";

function validateItems(items: unknown): items is CommandeItem[] {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every(
    (x) =>
      x &&
      typeof x === "object" &&
      typeof (x as CommandeItem).id === "string" &&
      typeof (x as CommandeItem).nom === "string" &&
      typeof (x as CommandeItem).quantite === "number" &&
      (x as CommandeItem).quantite >= 1 &&
      typeof (x as CommandeItem).prix === "number" &&
      (x as CommandeItem).prix >= 0
  );
}

/**
 * POST /api/commandes — Créer une commande (page publique)
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, "commande");
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Trop de commandes. Réessayez dans quelques minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 900) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    if (!validateItems(body.items)) {
      return NextResponse.json(
        { error: "Commande invalide (items requis : id, nom, quantite, prix)." },
        { status: 400 }
      );
    }
    const commentaire =
      typeof body.commentaire === "string" ? body.commentaire.trim() || null : null;
    const q = await query<{ id: string }>(
      `INSERT INTO commandes (items, commentaire, statut) VALUES ($1::jsonb, $2, 'en_attente') RETURNING id`,
      [JSON.stringify(body.items), commentaire]
    );
    if (!q || q.rowCount === 0) {
      return NextResponse.json(
        { error: "Base de données indisponible." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: true, id: q.rows[0].id, message: "Commande envoyée." },
      { status: 201 }
    );
  } catch (e) {
    console.error("[Commandes API]", e);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
