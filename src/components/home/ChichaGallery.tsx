"use client";

import { motion } from "framer-motion";

const images = [
  {
    src: "/images/chicha-1.png",
    alt: "Table avec chicha rouge/noir, plats et carte MOONKEY PARIS",
  },
  {
    src: "/images/chicha-2.png",
    alt: "Verres et chicha en arrière-plan, ambiance lounge",
  },
  {
    src: "/images/chicha-3.png",
    alt: "Dessert et chicha en fond",
  },
];

export function ChichaGallery() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Titre : petit bandeau doré */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90"
        >
          L&apos;expérience
        </motion.p>
        {/* Sous-titre */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-center font-display text-2xl font-bold tracking-tight text-jungle-cream sm:text-3xl"
        >
          Chicha, cuisine & ambiance
        </motion.h2>
        <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

        {/* 3 photos en grille : 1 colonne mobile, 3 colonnes desktop */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-jungle-800/50 shadow-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dégradé vert en bas au survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
