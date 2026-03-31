"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ALL_CRENEAUX } from "@/lib/constants";

const DELAI_OPTIONS = [
  { value: "", label: "Aucun" },
  { value: "5", label: "5 min" },
  { value: "10", label: "10 min" },
  { value: "20", label: "20 min" },
] as const;

type StatusState = {
  is_open: boolean;
  message: string | null;
  blockedCreneaux: string[];
  delaiCommandes: string | null;
};

export default function AdminStatutPage() {
  const [status, setStatus] = useState<StatusState | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StatusState>({
    is_open: true,
    message: null,
    blockedCreneaux: [],
    delaiCommandes: null,
  });

  const load = useCallback(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => {
        setStatus(data);
        setForm({
          is_open: data.is_open,
          message: data.message ?? "",
          blockedCreneaux: data.blockedCreneaux ?? [],
          delaiCommandes: data.delaiCommandes ?? null,
        });
      })
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleCreneau = (creneau: string) => {
    setForm((prev) => ({
      ...prev,
      blockedCreneaux: prev.blockedCreneaux.includes(creneau)
        ? prev.blockedCreneaux.filter((c) => c !== creneau)
        : [...prev.blockedCreneaux, creneau],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_open: form.is_open,
          message: form.message?.trim() || null,
          blockedCreneaux: form.blockedCreneaux,
          delaiCommandes: form.delaiCommandes || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setForm({
          is_open: data.is_open,
          message: data.message ?? "",
          blockedCreneaux: data.blockedCreneaux ?? [],
          delaiCommandes: data.delaiCommandes ?? null,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (status === null && form.blockedCreneaux.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-jungle-cream">
          Statut du restaurant
        </h1>
        <p className="text-jungle-500">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-jungle-cream">
        Statut du restaurant
      </h1>

      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-6">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-jungle-400">
            Affichage public
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="is_open"
                checked={form.is_open === true}
                onChange={() => setForm((p) => ({ ...p, is_open: true }))}
                className="h-4 w-4 accent-gold-500"
              />
              <span className="text-jungle-cream">Table disponible</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="is_open"
                checked={form.is_open === false}
                onChange={() => setForm((p) => ({ ...p, is_open: false }))}
                className="h-4 w-4 accent-gold-500"
              />
              <span className="text-jungle-cream">Complet ce soir</span>
            </label>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
              Message personnalisé (optionnel)
            </label>
            <input
              type="text"
              value={form.message ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value || null }))
              }
              placeholder="Ex: Réouverture à 18h"
              className="w-full max-w-md rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-2.5 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-jungle-400">
            Délai d&apos;attente (page Commander)
          </h2>
          <p className="mb-4 text-sm text-jungle-500">
            Message affiché sur la page de commande en cas d&apos;attente.
          </p>
          <div className="flex flex-wrap gap-2">
            {DELAI_OPTIONS.map((opt) => (
              <label
                key={opt.value || "aucun"}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 has-[:checked]:border-gold-500/50 has-[:checked]:bg-gold-500/10"
              >
                <input
                  type="radio"
                  name="delaiCommandes"
                  checked={(form.delaiCommandes ?? "") === opt.value}
                  onChange={() => setForm((p) => ({ ...p, delaiCommandes: opt.value || null }))}
                  className="h-4 w-4 accent-gold-500"
                />
                <span className="text-sm text-jungle-cream">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-jungle-800/30 bg-jungle-sage/40 p-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-jungle-400">
            Créneaux bloqués / tables complètes
          </h2>
          <p className="mb-4 text-sm text-jungle-500">
            Les créneaux cochés sont considérés comme{" "}
            <span className="font-semibold text-amber-300">complets</span> sur le
            formulaire de réservation (non proposés aux clients et affichés
            comme « Complet » dans l’aperçu des disponibilités). Horaires:
            semaine 20h-02h, week-end 20h-04h.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_CRENEAUX.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 has-[:checked]:border-amber-500/50 has-[:checked]:bg-amber-500/10"
              >
                <input
                  type="checkbox"
                  checked={form.blockedCreneaux.includes(c)}
                  onChange={() => toggleCreneau(c)}
                  className="h-4 w-4 accent-amber-500"
                />
                <span className="text-sm text-jungle-cream">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer le statut"}
        </Button>
      </form>
    </div>
  );
}
