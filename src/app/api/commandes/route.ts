import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { MENU_CATEGORIES } from "@/lib/menu-data";
import type { MenuCategoryId } from "@/lib/menu-data";
import { computeCommandeFormules } from "@/lib/formules-commande";
import type { CommandeItem } from "@/types/commande";

const VALID_CATEGORIES = new Set(
  MENU_CATEGORIES.map((c) => c.id)
) as Set<MenuCategoryId>;

function validateItems(items: unknown): items is CommandeItem[] {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every((x) => {
    if (!x || typeof x !== "object") return false;
    const o = x as CommandeItem;
    if (o.id === "remise_formules") return false;
    if (
      typeof o.id !== "string" ||
      typeof o.nom !== "string" ||
      typeof o.quantite !== "number" ||
      o.quantite < 1 ||
      typeof o.prix !== "number" ||
      o.prix < 0
    ) {
      return false;
    }
    if (
      typeof o.categorie !== "string" ||
      !VALID_CATEGORIES.has(o.categorie as MenuCategoryId)
    ) {
      return false;
    }
    return true;
  });
}

function buildItemsWithRemiseFormules(items: CommandeItem[]): CommandeItem[] {
  const { remise, bundlesEdc, bundlesPc } = computeCommandeFormules(
    items.map((i) => ({
      quantite: i.quantite,
      item: {
        id: i.id,
        categorie: i.categorie as MenuCategoryId,
        prix: i.prix,
      },
    }))
  );
  if (remise <= 0.005) return items;
  const parts: string[] = [];
  if (bundlesEdc > 0) {
    parts.push(
      `${bundlesEdc}× entrée + dessert + chicha`
    );
  }
  if (bundlesPc > 0) {
    parts.push(`${bundlesPc}× plat + chicha (hors entrecôte)`);
  }
  const nom =
    parts.length > 0
      ? `Remise formules 30 € — ${parts.join(" ; ")}`
      : "Remise formules 30 €";
  return [
    ...items,
    {
      id: "remise_formules",
      nom,
      quantite: 1,
      prix: -remise,
      categorie: "formule",
    },
  ];
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
    const numeroTable =
      typeof body.numero_table === "string" ? body.numero_table.trim() : "";
    if (!numeroTable) {
      return NextResponse.json(
        { error: "Numéro de table requis." },
        { status: 400 }
      );
    }
    const itemsStored = buildItemsWithRemiseFormules(body.items);
    const q = await query<{ id: string }>(
      `INSERT INTO commandes (items, numero_table, commentaire, statut) VALUES ($1::jsonb, $2, $3, 'en_attente') RETURNING id`,
      [JSON.stringify(itemsStored), numeroTable, commentaire]
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
