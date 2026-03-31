"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Flame } from "lucide-react";
import type { Appel } from "@/types/appel";

const POLL_INTERVAL_MS = 4000;

export default function AdminAppelsPage() {
  const [appels, setAppels] = useState<Appel[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/admin/appels")
      .then((r) => r.json())
      .then((data) => setAppels(Array.isArray(data) ? data : []))
      .catch(() => setAppels([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [load]);

  const traiter = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "traite" }),
      });
      if (res.ok) load();
    } catch {
      // ignore
    }
  };

  const annulerCharbon = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "annulee" }),
      });
      if (res.ok) load();
    } catch {
      // ignore
    }
  };

  const formatDate = (s: string) => {
    return new Date(s).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const enAttente = appels.filter((a) => a.statut === "en_attente");

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-jungle-cream">
        Appels Serveur & Charbon
      </h1>
      <p className="text-sm text-jungle-400">
        Demandes envoyées depuis la page Commander. Cliquez sur &quot;Traiter&quot; une fois l&apos;appel pris en charge.
      </p>

      {enAttente.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-200/90">
          <strong>{enAttente.length}</strong> appel{enAttente.length > 1 ? "s" : ""} en attente
        </div>
      )}

      {loading ? (
        <p className="text-jungle-500">Chargement…</p>
      ) : appels.length === 0 ? (
        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-8 text-center text-jungle-500">
          Aucun appel pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-3">
          {appels.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 ${
                a.statut === "en_attente"
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-jungle-800/30 bg-jungle-sage/40"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {a.type === "serveur" ? (
                    <Bell className="h-5 w-5 text-gold-400" />
                  ) : (
                    <Flame className="h-5 w-5 text-amber-400" />
                  )}
                  <div>
                    <span className="font-medium text-jungle-cream">
                      {a.type === "serveur" ? "Appel serveur" : "Demande charbon"}
                    </span>
                    <span className="ml-2 text-sm text-jungle-500">
                      {formatDate(a.created_at)}
                    </span>
                    {(a.numero_table || a.commentaire) && (
                      <p className="mt-0.5 text-sm text-jungle-400">
                        {a.numero_table && `Table ${a.numero_table}`}
                        {a.numero_table && a.commentaire && " — "}
                        {a.commentaire}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.statut === "en_attente" ? (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => traiter(a.id)}>
                        Traiter
                      </Button>
                      {a.type === "charbon" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                          onClick={() => annulerCharbon(a.id)}
                        >
                          Annulé
                        </Button>
                      )}
                    </>
                  ) : (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        a.statut === "annulee"
                          ? "bg-red-500/15 text-red-300"
                          : "bg-jungle-700/50 text-jungle-400"
                      }`}
                    >
                      {a.statut === "annulee" ? "Annulé" : "Traité"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
