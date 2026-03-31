import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Reservation } from "@/types/reservation";

/**
 * Liste des réservations (admin).
 * Lit depuis la BDD si DATABASE_URL est défini.
 */
export async function GET() {
  try {
    const q = await query<{
      id: string;
      prenom: string;
      nom: string;
      telephone: string;
      email: string | null;
      nombre_personnes: number;
      date: string;
      creneau: string;
      commentaire: string | null;
      experience: string | null;
      statut: string;
      created_at: string;
      updated_at: string;
    }>(
      `SELECT id, prenom, nom, telephone, email, nombre_personnes, date, creneau, commentaire, experience, statut, created_at, updated_at
       FROM reservations
       ORDER BY date DESC, created_at DESC`
    );
    if (!q) {
      return NextResponse.json([]);
    }
    const reservations: Reservation[] = q.rows.map((r) => ({
      id: r.id,
      prenom: r.prenom,
      nom: r.nom,
      telephone: r.telephone,
      email: r.email ?? undefined,
      nombre_personnes: r.nombre_personnes,
      date: r.date,
      creneau: r.creneau,
      commentaire: r.commentaire ?? undefined,
      experience: (r.experience as Reservation["experience"]) ?? undefined,
      statut: r.statut as Reservation["statut"],
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    return NextResponse.json(reservations);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors du chargement des réservations." },
      { status: 500 }
    );
  }
}
