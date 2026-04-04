"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  resolveMenuVariantLine,
  type MenuCategoryId,
} from "@/lib/menu-data";
import { cn } from "@/lib/utils";

const VALID_CATEGORY_IDS = new Set(
  MENU_CATEGORIES.map((c) => c.id)
) as Set<MenuCategoryId>;

function formatPrix(prix: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

function getCategoryFromUrl(searchParams: ReturnType<typeof useSearchParams>): MenuCategoryId | null {
  const c = searchParams.get("category");
  return c && VALID_CATEGORY_IDS.has(c as MenuCategoryId)
    ? (c as MenuCategoryId)
    : null;
}

export function MenuClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [variantPick, setVariantPick] = useState<Record<string, string>>({});
  const [cuissonPick, setCuissonPick] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId | null>(
    () => getCategoryFromUrl(searchParams)
  );

  useEffect(() => {
    setActiveCategory(getCategoryFromUrl(searchParams));
  }, [searchParams]);

  const handleFilter = (category: MenuCategoryId | null) => {
    setActiveCategory(category);
    const url = category ? `/menu?category=${category}` : "/menu";
    router.replace(url);
  };

  const filteredItems =
    activeCategory === null
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.categorie === activeCategory);

  const groupedByCategory = MENU_CATEGORIES.map((cat) => ({
    ...cat,
    items: filteredItems.filter((item) => item.categorie === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
            La carte
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
            Carte Moonkey
          </h1>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          <p className="mx-auto mt-5 max-w-lg text-sm text-jungle-300/90">
            Sandwiches, plats thaï, pâtes, burgers, soft, mocktails, smoothies et plus.
          </p>
        </motion.div>

        {/* Filtres par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => handleFilter(null)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
              activeCategory === null
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                : "border border-jungle-700/60 text-jungle-300/90 hover:border-jungle-600 hover:text-jungle-200"
            )}
          >
            Tout
          </button>
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleFilter(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
                activeCategory === cat.id
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                  : "border border-jungle-700/60 text-jungle-300/90 hover:border-jungle-600 hover:text-jungle-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Liste des plats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-14 space-y-12"
        >
          <AnimatePresence mode="wait">
            {groupedByCategory.map((group, gi) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-lg font-semibold text-gold-400/90 mb-6 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  {group.label}
                </h2>
                <ul className="space-y-1">
                  {group.items.map((item, i) => {
                    const hasVariants = Boolean(item.variants?.length);
                    const line = hasVariants
                      ? resolveMenuVariantLine(item, variantPick, cuissonPick)
                      : item;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i }}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-jungle-800/40 py-4 last:border-0"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-jungle-cream">
                            {item.nom}
                          </span>
                          {item.description && (
                            <p className="mt-0.5 text-sm text-jungle-400/80">
                              {item.description}
                            </p>
                          )}
                          {hasVariants && item.variants && (
                            <>
                              <label className="mt-2 block max-w-sm">
                                <span className="sr-only">Option</span>
                                <select
                                  value={
                                    variantPick[item.id] &&
                                    item.variants.some((v) => v.key === variantPick[item.id])
                                      ? variantPick[item.id]
                                      : item.variants[0].key
                                  }
                                  onChange={(e) =>
                                    setVariantPick((p) => ({
                                      ...p,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                  className="w-full rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 text-sm text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                                >
                                  {item.variants.map((v) => (
                                    <option key={v.key} value={v.key}>
                                      {item.garnitureChoice
                                        ? v.label
                                        : `${v.label} — ${formatPrix(v.prix)}`}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              {item.cuissonVariants && item.cuissonVariants.length > 0 && (
                                <label className="mt-2 block max-w-sm">
                                  <span className="sr-only">Cuisson</span>
                                  <select
                                    value={
                                      cuissonPick[item.id] &&
                                      item.cuissonVariants.some(
                                        (c) => c.key === cuissonPick[item.id]
                                      )
                                        ? cuissonPick[item.id]
                                        : item.cuissonVariants[0].key
                                    }
                                    onChange={(e) =>
                                      setCuissonPick((p) => ({
                                        ...p,
                                        [item.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 text-sm text-jungle-cream focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                                  >
                                    {item.cuissonVariants.map((c) => (
                                      <option key={c.key} value={c.key}>
                                        {c.label}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              )}
                            </>
                          )}
                        </div>
                        {line.prix > 0 && (
                          <span className="shrink-0 font-display text-base font-semibold text-gold-400/90">
                            {formatPrix(line.prix)}
                          </span>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <p className="mt-14 text-center text-sm text-jungle-500">
            Aucun article dans cette catégorie.
          </p>
        )}
      </div>
    </section>
  );
}
