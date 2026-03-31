import { NextRequest, NextResponse } from "next/server";
import type { ReservationCreate, ExperienceReservation } from "@/types/reservation";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { getReservationCreneaux } from "@/lib/constants";
import { sendReservationReceivedEmail } from "@/lib/mailer";

// Configuration de la salle :
// - 3 tables aménageables (2 à 5 personnes)
// - 2 petites tables (1–2 personnes)
const FLEX_TABLES = 3;
const SMALL_TABLES = 2;

const EXPERIENCES: ExperienceReservation[] = [
  "chicha_boissons",
  "repas_chicha",
  "chicha_uniquement",
  "repas_uniquement",
  "anniversaire",
];

function validateBody(body: unknown): body is ReservationCreate {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  const exp = (b.experience ?? null) as string | null;
  return (
    typeof b.prenom === "string" &&
    b.prenom.trim().length >= 2 &&
    typeof b.nom === "string" &&
    b.nom.trim().length >= 2 &&
    typeof b.telephone === "string" &&
    b.telephone.replace(/\D/g, "").length >= 10 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim()) &&
    typeof b.nombre_personnes === "number" &&
    b.nombre_personnes >= 1 &&
    b.nombre_personnes <= 20 &&
    typeof b.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    typeof b.creneau === "string" &&
    b.creneau.length > 0 &&
    (exp === null || EXPERIENCES.includes(exp as ExperienceReservation))
  );
}

/**
 * GET /api/reservation?date=YYYY-MM-DD&partySize=N
 * Retourne, pour une date donnée et une taille de groupe donnée, la disponibilité par créneau.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const partySizeRaw = searchParams.get("partySize");
    const partySize = Math.max(
      1,
      Math.min(20, Number.isFinite(Number(partySizeRaw)) ? Number(partySizeRaw) : 2)
    );
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Paramètre date invalide (format attendu : YYYY-MM-DD)." },
        { status: 400 }
      );
    }
    const creneaux = getReservationCreneaux(date);

    const q = await query<{
      creneau: string;
      statut: string;
      nombre_personnes: number;
    }>(
      `SELECT creneau, statut, nombre_personnes
       FROM reservations
       WHERE date = $1
         AND statut IN ('en_attente', 'confirmee')`,
      [date]
    );

    // Aucune réservation ou BDD indisponible : tous les créneaux sont libres
    if (!q) {
      return NextResponse.json({
        date,
        slots: creneaux.map((c) => ({ creneau: c, available: true })),
      });
    }

    const toMinutes = (c: string) => {
      const [h, m] = c.split("h").map((x) => parseInt(x || "0", 10));
      // Créneaux après minuit rattachés à la fin de soirée
      return h < 5 ? (h + 24) * 60 + m : h * 60 + m;
    };

    const reservations = q.rows.map((r) => ({
      creneau: r.creneau,
      mins: toMinutes(r.creneau),
      size: r.nombre_personnes,
    }));

    const slots = creneaux.map((c) => {
      const mins = toMinutes(c);
      const overlapping = reservations.filter((r) => {
        const diff = Math.abs(r.mins - mins);
        return diff <= 120; // fenêtre de 2h
      });

      let smallUsed = 0;
      let flexUsed = 0;

      // On affecte les réservations existantes aux types de tables
      for (const r of overlapping) {
        const size = r.size;
        if (size <= 2) {
          if (smallUsed < SMALL_TABLES) smallUsed++;
          else flexUsed++;
        } else {
          flexUsed++;
        }
      }

      let available: boolean;
      if (partySize <= 2) {
        available = smallUsed < SMALL_TABLES;
      } else if (partySize <= 5) {
        available = flexUsed < FLEX_TABLES;
      } else {
        // groupes plus grands : on utilise aussi les tables aménageables
        available = flexUsed < FLEX_TABLES;
      }

      return { creneau: c, available };
    });

    return NextResponse.json({ date, slots });
  } catch (e) {
    console.error("[Reservation availability API]", e);
    return NextResponse.json(
      { error: "Erreur lors du chargement des disponibilités." },
      { status: 500 }
    );
  }
}

/**
 * Crée une demande de réservation.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, "reservation");
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Trop de demandes. Réessayez dans quelques minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rate.retryAfterMs ?? 900) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    if (!validateBody(body)) {
      return NextResponse.json(
        {
          error:
            "Données invalides (prénom, nom, téléphone, email, nombre, date, créneau requis).",
        },
        { status: 400 }
      );
    }

    const data: ReservationCreate = {
      prenom: body.prenom.trim(),
      nom: body.nom.trim(),
      telephone: body.telephone.trim(),
      email: body.email.trim(),
      nombre_personnes: Number(body.nombre_personnes),
      date: body.date,
      creneau: body.creneau,
      commentaire:
        typeof body.commentaire === "string"
          ? body.commentaire.trim() || undefined
          : undefined,
      experience:
        typeof body.experience === "string" &&
        EXPERIENCES.includes(body.experience as ExperienceReservation)
          ? (body.experience as ExperienceReservation)
          : undefined,
    };
    const allowedCreneaux = getReservationCreneaux(data.date);
    if (!allowedCreneaux.includes(data.creneau)) {
      return NextResponse.json(
        { error: "Créneau invalide pour la date choisie." },
        { status: 400 }
      );
    }

    const q = await query(
      `INSERT INTO reservations (prenom, nom, telephone, email, nombre_personnes, date, creneau, commentaire, experience, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'en_attente')
       RETURNING id`,
      [
        data.prenom,
        data.nom,
        data.telephone,
        data.email,
        data.nombre_personnes,
        data.date,
        data.creneau,
        data.commentaire ?? null,
        data.experience ?? null,
      ]
    );
    if (process.env.DATABASE_URL && !q) {
      return NextResponse.json(
        { error: "Base de données indisponible." },
        { status: 503 }
      );
    }

    // Envoi best-effort de l'accusé de réception (email désormais obligatoire)
    try {
      await sendReservationReceivedEmail({
        to: data.email,
        prenom: data.prenom,
      });
    } catch (mailError) {
      console.error("[Reservation email]", mailError);
    }

    return NextResponse.json(
      { success: true, message: "Votre demande de réservation a bien été envoyée." },
      { status: 201 }
    );
  } catch (e) {
    console.error("[Reservation API]", e);
    const msg =
      process.env.DATABASE_URL &&
      (e instanceof Error && (e.message?.includes("connect") || e.message?.includes("ECONNREFUSED")))
        ? "Base de données indisponible. Lancez Docker : docker compose up -d"
        : "Une erreur est survenue.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
