"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-jungle-900/30 via-transparent to-jungle-deep" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-jungle-deep to-transparent pointer-events-none" />

      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-500/90"
        >
          Restaurant Lounge Chicha
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5"
        >
          <Image
            src="/images/logo-moonkey-gold.png"
            alt="Moonkey Paris"
            width={280}
            height={120}
            priority
            className="mx-auto h-auto w-40 sm:w-56 md:w-72 lg:w-80"
          />
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-md text-base leading-relaxed text-jungle-300/90 sm:text-lg"
        >
          Chichas, cuisine et ambiance
          lounge dans un cadre d&apos;exception.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="/reservation"
            className="inline-flex items-center justify-center rounded-full bg-gold-500/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-deep transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20"
          >
            Réserver une table
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-jungle-300/40 bg-jungle-300/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-cream transition-all duration-300 hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-400"
          >
            Voir le menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
