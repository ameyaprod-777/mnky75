"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/reservation";

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
  terminee: "Terminée",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const EXPERIENCE_LABELS: Record<string, string> = {
    chicha_boissons: "Chicha & boissons",
    repas_chicha: "Repas + chicha",
    chicha_uniquement: "Chicha uniquement",
    repas_uniquement: "Repas uniquement",
    anniversaire: "Anniversaire",
  };

  const load = useCallback(() => {
    fetch("/api/admin/reservations")
      .then((r) => r.json())
      .then((data) => {
        setReservations(Array.isArray(data) ? data : []);
      })
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatut = async (id: string, statut: "confirmee" | "annulee") => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) load();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-jungle-cream">
        Réservations
      </h1>
      <p className="text-sm text-jungle-400">
        Acceptez ou refusez les demandes de réservation.
      </p>

      {loading ? (
        <p className="text-jungle-500">Chargement…</p>
      ) : reservations.length === 0 ? (
        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-8 text-center text-jungle-500">
          Aucune réservation pour l’instant. Les demandes envoyées depuis le
          formulaire apparaîtront ici une fois la base de données connectée.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-jungle-800/30 bg-jungle-sage/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-jungle-800/50">
                <th className="px-4 py-3 font-medium text-jungle-400">Date</th>
                <th className="px-4 py-3 font-medium text-jungle-400">Créneau</th>
                <th className="px-4 py-3 font-medium text-jungle-400">Client</th>
                <th className="px-4 py-3 font-medium text-jungle-400">Tél.</th>
                <th className="px-4 py-3 font-medium text-jungle-400">Pers.</th>
                <th className="px-4 py-3 font-medium text-jungle-400">
                  Type de soirée
                </th>
                <th className="px-4 py-3 font-medium text-jungle-400">Statut</th>
                <th className="px-4 py-3 font-medium text-jungle-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-jungle-800/30 last:border-0"
                >
                  <td className="px-4 py-3 text-jungle-cream">
                    {formatDate(r.date)}
                  </td>
                  <td className="px-4 py-3 text-jungle-300">{r.creneau}</td>
                  <td className="px-4 py-3 text-jungle-cream">
                    {r.prenom} {r.nom}
                  </td>
                  <td className="px-4 py-3 text-jungle-300">{r.telephone}</td>
                  <td className="px-4 py-3 text-jungle-300">
                    {r.nombre_personnes}
                  </td>
                  <td className="px-4 py-3 text-jungle-300">
                    {r.experience
                      ? EXPERIENCE_LABELS[r.experience] ?? r.experience
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        r.statut === "confirmee"
                          ? "bg-jungle-600/50 text-jungle-300"
                          : r.statut === "annulee"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-jungle-700/50 text-jungle-400"
                      }`}
                    >
                      {STATUT_LABELS[r.statut] ?? r.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.statut === "en_attente" && (
                      <span className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setStatut(r.id, "confirmee")}
                        >
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                          onClick={() => setStatut(r.id, "annulee")}
                        >
                          Refuser
                        </Button>
                      </span>
                    )}
                    {r.statut !== "en_attente" && (
                      <span className="text-jungle-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
