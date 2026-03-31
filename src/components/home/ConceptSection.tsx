"use client";

import { motion } from "framer-motion";

const highlights = [
  {
    title: "Ambiance cosy, chic & festive",
    description:
      "Selon la soirée, l’atmosphère passe du lounge intimiste aux soirées plus animées avec événements, matchs ou DJ sets.",
  },
  {
    title: "Un cadre d’exception pour vos repas",
    description:
      "Tables confortables, service attentif et carte soignée pour partager un repas entre amis ou en amoureux.",
  },
  {
    title: "Un décor classe et chaleureux",
    description:
      "Mélange de végétal, de dorures et de lumières tamisées pour un lieu à la fois élégant, cosy et instagrammable.",
  },
];

export function ConceptSection() {
  return (
    <section id="concept" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
              Le concept
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
              Bien plus qu&apos;un bar à chicha
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-jungle-300/90">
              Moonkey Paris réunit l&apos;art de la chicha, une cuisine soignée et
              une atmosphère lounge unique. Idéal pour un dîner, un afterwork ou
              une soirée entre amis.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {highlights.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group rounded-2xl border border-jungle-800/40 bg-jungle-sage/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-jungle-700/50 hover:bg-jungle-sage/50"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 font-display text-lg font-semibold text-gold-400 transition-colors group-hover:bg-gold-500/20">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-jungle-cream">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-jungle-300/80">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
    </section>
  );
}
