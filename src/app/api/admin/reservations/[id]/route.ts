import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  sendReservationCancelledEmail,
  sendReservationConfirmedEmail,
} from "@/lib/mailer";

const STATUTS = ["en_attente", "confirmee", "annulee", "terminee"] as const;

/**
 * PATCH /api/admin/reservations/[id] — Accepter ou refuser une réservation
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _request.json();
    const statut = typeof body.statut === "string" ? body.statut : null;
    if (!statut || !STATUTS.includes(statut as (typeof STATUTS)[number])) {
      return NextResponse.json(
        { error: "Statut invalide (confirmee, annulee, terminee)." },
        { status: 400 }
      );
    }
    const q = await query<{
      id: string;
      email: string | null;
      prenom: string;
      date: string;
      creneau: string;
    }>(
      `UPDATE reservations
       SET statut = $1
       WHERE id = $2
       RETURNING id, email, prenom, date, creneau`,
      [statut, id]
    );
    if (!q || q.rowCount === 0) {
      return NextResponse.json(
        { error: "Réservation introuvable." },
        { status: 404 }
      );
    }
    if (statut === "confirmee") {
      const reservation = q.rows[0];
      if (reservation.email) {
        try {
          await sendReservationConfirmedEmail({
            to: reservation.email,
            prenom: reservation.prenom,
            date: reservation.date,
            creneau: reservation.creneau,
          });
        } catch (mailError) {
          console.error("[Reservation confirm email]", mailError);
        }
      }
    }
    if (statut === "annulee") {
      const reservation = q.rows[0];
      if (reservation.email) {
        try {
          await sendReservationCancelledEmail({
            to: reservation.email,
            prenom: reservation.prenom,
            date: reservation.date,
            creneau: reservation.creneau,
          });
        } catch (mailError) {
          console.error("[Reservation cancel email]", mailError);
        }
      }
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
