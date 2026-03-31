"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ReservationCta() {
  return (
    <section id="reservation" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl border border-jungle-800/40 bg-jungle-sage/50 backdrop-blur-sm"
          >
            <div className="p-10 text-center sm:p-14 lg:p-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
                Réserver
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
                Une table vous attend
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              <p className="mx-auto mt-5 max-w-lg text-sm text-jungle-300/90">
                Réservez en ligne ou via WhatsApp pour garantir votre place en
                soirée.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-jungle-300/90">
                <a
                  href={SITE.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-gold-400"
                >
                  <MapPin className="h-4 w-4 text-gold-500/70" />
                  {SITE.fullAddress}
                </a>
                <span className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-gold-500/70" />
                  Soirées & week-ends
                </span>
              </div>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/reservation"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gold-500/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-deep transition-all hover:bg-gold-400 sm:w-auto"
                >
                  Réserver en ligne
                </Link>
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(SITE.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-jungle-300/40 bg-jungle-300/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-cream transition-all hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-400 sm:w-auto"
                >
                  Réserver via WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
    </section>
  );
}
