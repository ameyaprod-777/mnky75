"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { MENU_MAIN_CATEGORIES } from "@/lib/menu-data";

export function MenuPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
            La carte
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
            Notre menu
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          <p className="mx-auto mt-5 max-w-md text-sm text-jungle-300/90">
            Entrées, plats, desserts, boissons, milkshakes et chichas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MENU_MAIN_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="flex items-center gap-4 rounded-xl border border-jungle-800/40 bg-jungle-sage/40 px-5 py-4 transition-all hover:border-jungle-700/50 hover:bg-jungle-sage/60 hover:shadow-lg hover:shadow-black/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500/90">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-medium text-jungle-cream">{cat.label}</span>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-gold-400 transition-all duration-300 hover:bg-gold-500/20 hover:border-gold-400/60"
          >
            Voir la carte complète
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
