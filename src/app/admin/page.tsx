"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart, Calendar } from "lucide-react";
import type { Appel } from "@/types/appel";
import type { Commande } from "@/types/commande";
import type { Reservation } from "@/types/reservation";

const POLL_MS = 4000;

function formatAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return "à l'instant";
  if (sec < 3600) return `il y a ${Math.floor(sec / 60)} min`;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminDashboardPage() {
  const [status, setStatus] = useState<{
    is_open: boolean;
    message: string | null;
    blockedCreneaux: string[];
  } | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [appels, setAppels] = useState<Appel[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const poll = useCallback(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));

    fetch("/api/admin/commandes")
      .then((r) => r.json())
      .then((data) => setCommandes(Array.isArray(data) ? data : []))
      .catch(() => setCommandes([]));

    fetch("/api/admin/appels")
      .then((r) => r.json())
      .then((data) => setAppels(Array.isArray(data) ? data : []))
      .catch(() => setAppels([]));

    fetch("/api/admin/reservations")
      .then((r) => r.json())
      .then((data) => setReservations(Array.isArray(data) ? data : []))
      .catch(() => setReservations([]));
  }, []);

  useEffect(() => {
    poll();
    const t = setInterval(poll, POLL_MS);
    return () => clearInterval(t);
  }, [poll]);

  const commandesEnAttente = commandes.filter((c) => c.statut === "en_attente");
  const appelsEnAttente = appels.filter((a) => a.statut === "en_attente");
  const reservationsEnAttente = reservations.filter((r) => r.statut === "en_attente");

  const hasActivity =
    commandesEnAttente.length > 0 ||
    appelsEnAttente.length > 0 ||
    reservationsEnAttente.length > 0;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-jungle-cream">
        Tableau de bord
      </h1>

      {/* Activité en temps réel */}
      <section className="rounded-2xl border border-jungle-800/40 bg-jungle-sage/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-jungle-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Activité en temps réel
        </h2>

        {!hasActivity ? (
          <p className="text-sm text-jungle-500">
            Aucune demande en attente. Les nouvelles commandes, appels et réservations
            s&apos;afficheront ici automatiquement.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Commandes */}
            {commandesEnAttente.length > 0 && (
              <Link
                href="/admin/commandes"
                className="block rounded-xl border border-amber-500/40 bg-amber-500/15 p-4 transition-colors hover:bg-amber-500/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/30">
                      <ShoppingCart className="h-5 w-5 text-amber-200" />
                    </span>
                    <div>
                      <p className="font-semibold text-amber-100">
                        {commandesEnAttente.length} commande
                        {commandesEnAttente.length > 1 ? "s" : ""} en attente
                      </p>
                      <ul className="mt-1 space-y-0.5 text-sm text-amber-200/80">
                        {commandesEnAttente.slice(0, 3).map((c) => (
                          <li key={c.id}>
                            {c.items.length} article(s) — {formatAgo(c.created_at)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-300">Voir →</span>
                </div>
              </Link>
            )}

            {/* Appels */}
            {appelsEnAttente.length > 0 && (
              <Link
                href="/admin/appels"
                className="block rounded-xl border border-amber-500/40 bg-amber-500/15 p-4 transition-colors hover:bg-amber-500/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/30">
                      <Bell className="h-5 w-5 text-amber-200" />
                    </span>
                    <div>
                      <p className="font-semibold text-amber-100">
                        {appelsEnAttente.length} appel
                        {appelsEnAttente.length > 1 ? "s" : ""} en attente
                      </p>
                      <ul className="mt-1 space-y-0.5 text-sm text-amber-200/80">
                        {appelsEnAttente.slice(0, 3).map((a) => (
                          <li key={a.id}>
                            {a.type === "serveur" ? "Serveur" : "Charbon"}
                            {a.numero_table ? ` — Table ${a.numero_table}` : ""} —{" "}
                            {formatAgo(a.created_at)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-300">Voir →</span>
                </div>
              </Link>
            )}

            {/* Réservations */}
            {reservationsEnAttente.length > 0 && (
              <Link
                href="/admin/reservations"
                className="block rounded-xl border border-amber-500/40 bg-amber-500/15 p-4 transition-colors hover:bg-amber-500/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/30">
                      <Calendar className="h-5 w-5 text-amber-200" />
                    </span>
                    <div>
                      <p className="font-semibold text-amber-100">
                        {reservationsEnAttente.length} réservation
                        {reservationsEnAttente.length > 1 ? "s" : ""} en attente
                      </p>
                      <ul className="mt-1 space-y-0.5 text-sm text-amber-200/80">
                        {reservationsEnAttente.slice(0, 3).map((r) => (
                          <li key={r.id}>
                            {r.prenom} {r.nom} — {r.date} {r.creneau} —{" "}
                            {formatAgo(r.created_at)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-300">Voir →</span>
                </div>
              </Link>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-jungle-400">
            Statut du restaurant
          </h2>
          {status ? (
            <div className="space-y-2">
              <p className="text-jungle-cream">
                {status.is_open ? (
                  <span className="text-jungle-300">Table disponible</span>
                ) : (
                  <span className="text-amber-400">Complet ce soir</span>
                )}
              </p>
              {status.message && (
                <p className="text-sm text-jungle-400">{status.message}</p>
              )}
              {status.blockedCreneaux.length > 0 && (
                <p className="text-sm text-jungle-500">
                  {status.blockedCreneaux.length} créneau(x) bloqué(s)
                </p>
              )}
              <Button asChild variant="secondary" size="sm" className="mt-2">
                <Link href="/admin/statut">Modifier le statut</Link>
              </Button>
            </div>
          ) : (
            <p className="text-jungle-500">Chargement…</p>
          )}
        </section>

        <section className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-jungle-400">
            Accès rapide
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/commandes">
                Commandes
                {commandesEnAttente.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500/40 px-1.5 py-0.5 text-xs">
                    {commandesEnAttente.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/appels">
                Appels
                {appelsEnAttente.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500/40 px-1.5 py-0.5 text-xs">
                    {appelsEnAttente.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/reservations">
                Réservations
                {reservationsEnAttente.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500/40 px-1.5 py-0.5 text-xs">
                    {reservationsEnAttente.length}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
