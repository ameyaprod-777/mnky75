"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StatusIndicator } from "@/components/reservation/StatusIndicator";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { SITE } from "@/lib/constants";

export function ReservationPageClient() {
  const [status, setStatus] = useState<{
    is_open: boolean;
    blockedCreneaux?: string[];
  } | null>(null);

  const isOpen = status?.is_open ?? true;

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
            Réserver
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
            Une table vous attend
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          <p className="mx-auto mt-5 text-sm text-jungle-300/90">
            {SITE.fullAddress} — Semaine 20h-02h, week-end 20h-04h
          </p>
        </motion.div>

        <div className="mt-10">
          <StatusIndicator className="mb-8" onStatusChange={setStatus} />
          <ReservationForm
            disabled={!isOpen}
            disabledCreneaux={status?.blockedCreneaux ?? []}
          />
        </div>
      </div>
    </section>
  );
}
