"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Commande } from "@/types/commande";

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  en_preparation: "En préparation",
  pret: "Prêt",
  livre: "Livré",
  annulee: "Annulée",
};

const POLL_INTERVAL_MS = 5000;

export default function AdminCommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/commandes")
      .then((r) => r.json())
      .then((data) => setCommandes(Array.isArray(data) ? data : []))
      .catch(() => setCommandes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [load]);

  const setStatut = async (id: string, statut: Commande["statut"]) => {
    try {
      const res = await fetch(`/api/admin/commandes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) load();
    } catch {
      // ignore
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-jungle-cream">
        Commandes
      </h1>
      <p className="text-sm text-jungle-400">
        Commandes passées depuis la page Commander (chichas, boissons, etc.).
        Pour afficher un message de délai d&apos;attente (5 / 10 / 20 min) sur la page Commander, allez dans{" "}
        <Link href="/admin/statut" className="text-gold-400 hover:underline">Statut</Link> → Délai d&apos;attente.
      </p>

      {loading ? (
        <p className="text-jungle-500">Chargement…</p>
      ) : commandes.length === 0 ? (
        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-8 text-center text-jungle-500">
          Aucune commande. Les commandes passées sur la page Commander
          apparaîtront ici.
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-jungle-500">
                    {formatDate(c.created_at)}
                  </span>
                  {c.numero_table && (
                    <span className="rounded-full bg-jungle-700/50 px-2 py-0.5 text-xs text-gold-400/90">
                      Table {c.numero_table}
                    </span>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    c.statut === "livre"
                      ? "bg-jungle-600/50 text-jungle-300"
                      : c.statut === "annulee"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-jungle-700/50 text-jungle-400"
                  }`}
                >
                  {STATUT_LABELS[c.statut] ?? c.statut}
                </span>
              </div>
              <ul className="mb-3 space-y-1 text-sm text-jungle-cream">
                {c.items.map((item, i) => (
                  <li key={i}>
                    {item.quantite}× {item.nom} — {(item.prix * item.quantite).toFixed(2)} €
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                {c.statut !== "annulee" && c.statut !== "livre" && (
                  <>
                    {c.statut === "en_attente" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setStatut(c.id, "en_preparation")}
                      >
                        En préparation
                      </Button>
                    )}
                    {c.statut === "en_preparation" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setStatut(c.id, "pret")}
                      >
                        Prêt
                      </Button>
                    )}
                    {c.statut === "pret" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setStatut(c.id, "livre")}
                      >
                        Livré
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                      onClick={() => setStatut(c.id, "annulee")}
                    >
                      Annuler
                    </Button>
                  </>
                )}
              </div>
              {c.commentaire && (
                <p className="mt-2 text-xs text-jungle-500">
                  Note : {c.commentaire}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
