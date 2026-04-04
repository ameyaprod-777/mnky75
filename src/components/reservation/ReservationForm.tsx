"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getReservationCreneaux } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ReservationCreate } from "@/types/reservation";

const MIN_DATE = new Date().toISOString().slice(0, 10);

interface Props {
  disabled?: boolean;
  disabledCreneaux?: string[];
}

export function ReservationForm({ disabled, disabledCreneaux = [] }: Props) {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<
    { creneau: string; available: boolean }[] | null
  >(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [form, setForm] = useState<
    ReservationCreate & { commentaire?: string }
  >({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    nombre_personnes: 2,
    date: "",
    creneau: "",
    experience: "chicha_boissons",
    commentaire: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email.trim(),
          commentaire: form.commentaire?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setSuccess(true);
      setForm({
        prenom: "",
        nom: "",
        telephone: "",
        email: "",
        nombre_personnes: 2,
        date: "",
        creneau: "",
        experience: "chicha_boissons",
        commentaire: "",
      });
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez-nous par WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!form.date) {
      setAvailability(null);
      setAvailabilityError(null);
      return;
    }
    const controller = new AbortController();
    setAvailabilityError(null);
    fetch(
      `/api/reservation?date=${form.date}&partySize=${form.nombre_personnes}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.slots)) {
          setAvailability(
            data.slots.map((s: { creneau: string; available: boolean }) => ({
              creneau: s.creneau,
              available: !!s.available,
            }))
          );
        } else {
          setAvailability(null);
        }
      })
      .catch((e) => {
        if ((e as Error).name === "AbortError") return;
        setAvailability(null);
        setAvailabilityError("Impossible de charger les disponibilités pour cette date.");
      });
    return () => controller.abort();
  }, [form.date, form.nombre_personnes]);

  useEffect(() => {
    if (!form.creneau) return;
    const allowedCreneaux = getReservationCreneaux(form.date);
    if (!allowedCreneaux.includes(form.creneau)) {
      setForm((prev) => ({ ...prev, creneau: "" }));
    }
  }, [form.date, form.creneau]);

  const parsedAvailability = useMemo(() => {
    if (!availability) return null;
    return availability.map((slot) => {
      const blocked = disabledCreneaux.includes(slot.creneau);
      const busy = blocked || !slot.available;

      return {
        creneau: slot.creneau,
        blocked,
        busy,
      };
    });
  }, [availability, disabledCreneaux]);

  const dateCreneaux = useMemo(() => getReservationCreneaux(form.date), [form.date]);

  const selectableSlots = useMemo(() => {
    const baseParsed = parsedAvailability;
    if (!baseParsed) {
      return dateCreneaux.filter((c) => !disabledCreneaux.includes(c));
    }

    return baseParsed
      .filter((s) => !s.busy)
      .map((s) => s.creneau);
  }, [disabledCreneaux, parsedAvailability, dateCreneaux]);

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-jungle-700/50 bg-jungle-sage/40 p-8 text-center"
      >
        <p className="font-display text-lg font-semibold text-jungle-cream">
          Demande envoyée
        </p>
        <p className="mt-2 text-sm text-jungle-300/90">
          Nous vous recontacterons pour confirmer votre réservation.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium text-gold-400 underline-offset-2 hover:underline"
        >
          Faire une autre réservation
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Prénom
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={form.prenom}
            onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
            placeholder="Votre prénom"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Nom
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={form.nom}
            onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
            placeholder="Votre nom"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Téléphone
          </span>
          <input
            type="tel"
            required
            value={form.telephone}
            onChange={(e) => setForm((p) => ({ ...p, telephone: e.target.value }))}
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
            placeholder="06 12 34 56 78"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Email
          </span>
          <input
            type="email"
            required
            value={form.email ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
            placeholder="vous@example.com"
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Nombre de personnes
          </span>
          <select
            required
            value={form.nombre_personnes}
            onChange={(e) =>
              setForm((p) => ({ ...p, nombre_personnes: Number(e.target.value) }))
            }
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "personne" : "personnes"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
            Date
          </span>
          <input
            type="date"
            required
            min={MIN_DATE}
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            disabled={disabled}
            className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
          Créneau
        </span>
        <select
          required
          value={form.creneau}
          onChange={(e) => setForm((p) => ({ ...p, creneau: e.target.value }))}
          disabled={disabled}
          className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
        >
          <option value="">Choisir un horaire</option>
          {selectableSlots.map((c) => (
            <option key={c} value={c}>
              {c} — Disponible
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
          Type de soirée
        </span>
        <select
          required
          value={form.experience ?? "chicha_boissons"}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              experience: e.target.value as ReservationCreate["experience"],
            }))
          }
          disabled={disabled}
          className="w-full rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
        >
          <option value="chicha_boissons">Chicha & boissons</option>
          <option value="repas_chicha">Repas + chicha</option>
          <option value="repas_uniquement">Repas uniquement</option>
          <option value="anniversaire">Anniversaire</option>
        </select>
        {form.experience === "anniversaire" && (
          <p className="mt-1.5 text-xs text-gold-400/90">
            Pour les anniversaires, nous vous contacterons par téléphone pour vous
            donner plus de détails sur l&apos;offre et confirmer si la demande est
            acceptée.
          </p>
        )}
        <p className="mt-1.5 text-xs text-jungle-500">
          La cuisine ferme à 23h. Pour dîner, merci de choisir un créneau
          adapté.
        </p>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jungle-400">
          Commentaire <span className="text-jungle-500">(optionnel)</span>
        </span>
        <textarea
          value={form.commentaire ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, commentaire: e.target.value }))}
          disabled={disabled}
          rows={3}
          className="w-full resize-none rounded-xl border border-jungle-700/50 bg-jungle-sage/40 px-4 py-3 text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50"
          placeholder="Allergie, demande spéciale…"
        />
      </label>
      <button
        type="submit"
        disabled={disabled || sending}
        className={cn(
          "w-full rounded-full py-3.5 text-sm font-semibold uppercase tracking-widest transition-all disabled:opacity-50",
          disabled
            ? "cursor-not-allowed border border-jungle-700 text-jungle-500"
            : "bg-gold-500/90 text-jungle-deep hover:bg-gold-400"
        )}
      >
        {sending ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </motion.form>
  );
}
