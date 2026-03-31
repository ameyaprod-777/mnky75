"use client";

import { motion } from "framer-motion";

export function QuoteSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gold-500/40 bg-jungle-sage/30 px-6 py-8 text-center shadow-lg shadow-black/10 sm:px-10 sm:py-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500/90">
            Offres & formules
          </p>
          <div className="mt-6 space-y-5 sm:space-y-6">
            <p className="font-display text-base font-semibold leading-relaxed text-jungle-cream sm:text-lg">
              Happy hour : 16h – 20h
              <br />
              <span className="text-gold-400/95">
                Chicha Kaloud + soft 15€
                <br />
                Chicha Quasar + soft 20€
              </span>
            </p>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <p className="font-display text-base font-semibold leading-relaxed text-jungle-cream sm:text-lg">
              Nos formules
              <br />
              <span className="text-gold-400/95">
                Plat + chicha (sauf entrecôte) 30€
                <br />
                Entrée + dessert + chicha 30€
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
