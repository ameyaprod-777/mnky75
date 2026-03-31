import { NextRequest, NextResponse } from "next/server";
import { getAdminStatus, setAdminStatus } from "@/lib/admin-status-store";
import { getStatusFromDb, setStatusInDb } from "@/lib/status-db";

const defaultStatus = {
  is_open: true,
  message: null as string | null,
  blockedCreneaux: [] as string[],
  delaiCommandes: null as string | null,
};

/**
 * GET — Statut du restaurant.
 * Lit en BDD si DATABASE_URL est défini, sinon le store mémoire.
 */
export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const fromDb = await getStatusFromDb();
      if (fromDb) return NextResponse.json(fromDb);
    }
    const status = getAdminStatus();
    return NextResponse.json(status);
  } catch {
    return NextResponse.json(defaultStatus, { status: 200 });
  }
}

/**
 * PATCH — Mise à jour du statut (admin).
 * Écrit en BDD si disponible, puis met à jour le store mémoire pour cohérence.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const update: {
      is_open?: boolean;
      message?: string | null;
      blockedCreneaux?: string[];
      delaiCommandes?: string | null;
    } = {};
    if (typeof body.is_open === "boolean") update.is_open = body.is_open;
    if (body.message === null || typeof body.message === "string") update.message = body.message;
    if (Array.isArray(body.blockedCreneaux)) {
      update.blockedCreneaux = body.blockedCreneaux.filter((c: unknown) => typeof c === "string");
    }
    if (body.delaiCommandes === null || body.delaiCommandes === "" || ["5", "10", "20"].includes(body.delaiCommandes)) {
      update.delaiCommandes = (body.delaiCommandes && body.delaiCommandes !== "") ? body.delaiCommandes : null;
    }

    if (process.env.DATABASE_URL) {
      const ok = await setStatusInDb(update);
      if (ok) {
        const fromDb = await getStatusFromDb();
        if (fromDb) {
          setAdminStatus(fromDb);
          return NextResponse.json(fromDb);
        }
      }
    }

    const next = setAdminStatus(update);
    return NextResponse.json(next);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du statut." }, { status: 500 });
  }
}
