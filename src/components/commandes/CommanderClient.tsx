"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Bell,
  Flame,
  Trash2,
} from "lucide-react";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  resolveMenuVariantLine,
  type MenuItemData,
  type MenuCategoryId,
} from "@/lib/menu-data";
import type { CommandeItem } from "@/types/commande";
import {
  computeCommandeFormules,
  PRIX_FORMULE_COMMANDE,
} from "@/lib/formules-commande";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrix(prix: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export function CommanderClient() {
  const [cart, setCart] = useState<{ item: MenuItemData; quantite: number }[]>([]);
  const [commentaire, setCommentaire] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delaiCommandes, setDelaiCommandes] = useState<string | null>(null);
  const [numeroTable, setNumeroTable] = useState("");
  const [appelSending, setAppelSending] = useState<"serveur" | "charbon" | null>(null);
  const [appelSuccess, setAppelSuccess] = useState<"serveur" | "charbon" | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId | null>(null);
  const [variantPick, setVariantPick] = useState<Record<string, string>>({});
  const [cuissonPick, setCuissonPick] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => setDelaiCommandes(data.delaiCommandes ?? null))
      .catch(() => setDelaiCommandes(null));
  }, []);

  const pricing = useMemo(
    () =>
      computeCommandeFormules(
        cart.map(({ item, quantite }) => ({
          quantite,
          item: {
            id: item.id,
            categorie: item.categorie,
            prix: item.prix,
          },
        }))
      ),
    [cart]
  );
  const total = pricing.total;

  const filteredItems =
    activeCategory === null
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.categorie === activeCategory);

  const groupedByCategory = MENU_CATEGORIES.map((cat) => ({
    ...cat,
    items: filteredItems.filter((i) => i.categorie === cat.id),
  })).filter((g) => g.items.length > 0);

  const add = (item: MenuItemData, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((c) => c.item.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i].quantite += qty;
        return next;
      }
      return [...prev, { item, quantite: qty }];
    });
  };

  const remove = (itemId: string, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((c) => c.item.id === itemId);
      if (i < 0) return prev;
      const next = [...prev];
      if (next[i].quantite <= qty) {
        next.splice(i, 1);
        return next;
      }
      next[i].quantite -= qty;
      return next;
    });
  };

  const submit = async () => {
    if (cart.length === 0) return;
    setError(null);
    if (!numeroTable.trim()) {
      setError("Merci d'indiquer votre numéro de table avant d'envoyer la commande.");
      return;
    }
    setSending(true);
    try {
      const items: CommandeItem[] = cart.map(({ item, quantite }) => ({
        id: item.id,
        nom: item.nom,
        quantite,
        prix: item.prix,
        categorie: item.categorie,
      }));
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          numero_table: numeroTable.trim(),
          commentaire: commentaire.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi.");
        return;
      }
      setSuccess(true);
      setCart([]);
      setCommentaire("");
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  const sendAppel = async (type: "serveur" | "charbon") => {
    if (!numeroTable.trim()) {
      setError("Merci d'indiquer votre numéro de table avant d'appeler.");
      return;
    }
    setAppelSending(type);
    setAppelSuccess(null);
    try {
      const res = await fetch("/api/appels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          numero_table: numeroTable.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'appel.");
        return;
      }
      setAppelSuccess(type);
      setTimeout(() => setAppelSuccess(null), 4000);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setAppelSending(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
          À table
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-jungle-cream sm:text-4xl">
          Commander
        </h1>
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <p className="mx-auto mt-5 max-w-lg text-sm text-jungle-300/90">
          Chichas, boissons, plats — votre commande sera transmise au bar.
        </p>
        <p className="mx-auto mt-4 max-w-lg rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3 text-center text-xs leading-relaxed text-jungle-300/95">
          <span className="font-semibold text-gold-400/90">Formules {PRIX_FORMULE_COMMANDE} €</span>
          {" — "}
          entrée + dessert + chicha, ou plat (sauf entrecôte) + chicha. Le total
          s&apos;ajuste automatiquement dans le panier.
        </p>
      </motion.div>

      {delaiCommandes && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200/90"
        >
          <Clock className="h-4 w-4 shrink-0" />
          <span>Délai d&apos;attente estimé : {delaiCommandes} min</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-xl bg-jungle-600/30 border border-jungle-500/30 px-4 py-3 text-center text-jungle-cream"
        >
          Commande envoyée
        </motion.div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-center text-red-400">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl border border-jungle-800/40 bg-jungle-sage/40 px-4 py-3 sm:inline-flex sm:max-w-md sm:items-center sm:gap-4"
      >
        <label
          htmlFor="numero-table-global"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-jungle-400 sm:mb-0 sm:shrink-0"
        >
          Numéro de table <span className="text-amber-400/90">(obligatoire)</span>
        </label>
        <input
          id="numero-table-global"
          type="text"
          value={numeroTable}
          onChange={(e) => {
            setNumeroTable(e.target.value);
            if (error?.includes("numéro de table")) setError(null);
          }}
          placeholder="Ex : 12"
          aria-required="true"
          autoComplete="off"
          className="w-full min-w-[100px] rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 text-sm text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30 sm:max-w-[140px]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl border border-jungle-800/40 bg-jungle-sage/40 p-5"
      >
        <div className="mb-3 flex items-center gap-2 text-jungle-cream">
          <Bell className="h-5 w-5 text-gold-400" />
          <h2 className="font-display text-lg font-semibold">Appel Serveur & Charbon</h2>
        </div>
        <p className="mb-4 text-sm text-jungle-400">
          Besoin d&apos;un serveur ou de charbon pour la chicha ? Envoyez un signal, l&apos;équipe sera prévenue.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            disabled={!!appelSending}
            onClick={() => sendAppel("serveur")}
            className="gap-2"
          >
            <Bell className="h-4 w-4" />
            {appelSending === "serveur" ? "Envoi…" : "Appeler le serveur"}
          </Button>
          <Button
            variant="secondary"
            disabled={!!appelSending}
            onClick={() => sendAppel("charbon")}
            className="gap-2"
          >
            <Flame className="h-4 w-4" />
            {appelSending === "charbon" ? "Envoi…" : "Demander du charbon"}
          </Button>
        </div>
        {appelSuccess && (
          <p className="mt-3 text-sm text-jungle-300">
            {appelSuccess === "serveur" ? "Serveur prévenu." : "Demande de charbon envoyée."}
          </p>
        )}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        <div>
          {/* Filtres par catégorie */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
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
                onClick={() => setActiveCategory(cat.id)}
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

          {groupedByCategory.map((group) => (
            <section key={group.id} className="mb-10">
              <h2 className="mb-4 font-display text-xl font-semibold text-gold-400/90">
                {group.label}
              </h2>
              <ul className="space-y-2">
                {group.items.map((item) => {
                  const hasVariants = Boolean(item.variants?.length);
                  const line = hasVariants
                    ? resolveMenuVariantLine(item, variantPick, cuissonPick)
                    : item;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-jungle-800/40 bg-jungle-sage/30 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-jungle-cream">
                          {item.nom}
                        </span>
                        {item.description && (
                          <p className="text-xs text-jungle-500">
                            {item.description}
                          </p>
                        )}
                        {hasVariants && item.variants && (
                          <>
                            <label className="mt-2 block max-w-sm">
                              <span className="sr-only">Choisir une option</span>
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
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-medium text-gold-400/90">
                          {formatPrix(line.prix)}
                        </span>
                        <div className="flex items-center gap-1 rounded-lg border border-jungle-700/50 bg-jungle-sage/50">
                          <button
                            type="button"
                            aria-label="Retirer"
                            className="flex h-8 w-8 items-center justify-center text-jungle-400 hover:bg-jungle-700/50 hover:text-jungle-cream rounded-l-md transition-colors"
                            onClick={() => remove(line.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[24px] text-center text-sm text-jungle-cream">
                            {cart.find((c) => c.item.id === line.id)?.quantite ?? 0}
                          </span>
                          <button
                            type="button"
                            aria-label="Ajouter"
                            className="flex h-8 w-8 items-center justify-center text-jungle-400 hover:bg-jungle-700/50 hover:text-jungle-cream rounded-r-md transition-colors"
                            onClick={() => add(line)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-jungle-800/40 bg-jungle-sage/40 p-5">
            <div className="mb-4 flex items-center gap-2 text-jungle-cream">
              <ShoppingCart className="h-5 w-5 text-gold-400" />
              <h3 className="font-display text-lg font-semibold">Panier</h3>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-jungle-500">
                Ajoutez des articles depuis le menu.
              </p>
            ) : (
              <>
                <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto text-sm">
                  {cart.map(({ item, quantite }) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-jungle-800/30 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="min-w-0 flex-1 text-jungle-300">
                        {item.nom}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-0 rounded-lg border border-jungle-700/50 bg-jungle-sage/50">
                          <button
                            type="button"
                            aria-label="Retirer une unité"
                            className="flex h-8 w-8 items-center justify-center text-jungle-400 hover:bg-jungle-700/50 hover:text-jungle-cream rounded-l-md transition-colors"
                            onClick={() => remove(item.id, 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[28px] text-center text-sm text-jungle-cream">
                            {quantite}
                          </span>
                          <button
                            type="button"
                            aria-label="Ajouter une unité"
                            className="flex h-8 w-8 items-center justify-center text-jungle-400 hover:bg-jungle-700/50 hover:text-jungle-cream rounded-r-md transition-colors"
                            onClick={() => add(item, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Retirer du panier"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-jungle-700/50 text-jungle-500 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          onClick={() => remove(item.id, quantite)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="min-w-[4.5rem] text-right text-gold-400/90">
                          {formatPrix(item.prix * quantite)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {pricing.remise > 0.005 && (
                  <div className="mb-3 space-y-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-jungle-300">
                    <p className="flex justify-between gap-2">
                      <span>Sous-total articles</span>
                      <span>{formatPrix(pricing.brut)}</span>
                    </p>
                    {pricing.bundlesEdc > 0 && (
                      <p className="text-emerald-400/90">
                        {pricing.bundlesEdc}× formule entrée + dessert + chicha à{" "}
                        {PRIX_FORMULE_COMMANDE} €
                      </p>
                    )}
                    {pricing.bundlesPc > 0 && (
                      <p className="text-emerald-400/90">
                        {pricing.bundlesPc}× formule plat + chicha à{" "}
                        {PRIX_FORMULE_COMMANDE} €
                      </p>
                    )}
                    <p className="flex justify-between gap-2 border-t border-emerald-500/15 pt-1 text-emerald-300/95">
                      <span>Remise formules</span>
                      <span>−{formatPrix(pricing.remise)}</span>
                    </p>
                  </div>
                )}
                <p className="text-base font-semibold text-jungle-cream">
                  Total : {formatPrix(total)}
                </p>
                <label className="mt-3 block">
                  <span className="mb-1 block text-xs text-jungle-500">
                    Commentaire (facultatif)
                  </span>
                  <input
                    type="text"
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Allergie, précision sur la commande…"
                    className="w-full rounded-lg border border-jungle-700/50 bg-jungle-sage/40 px-3 py-2 text-sm text-jungle-cream placeholder-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                  />
                </label>
                <Button
                  className="mt-4 w-full"
                  disabled={sending || !numeroTable.trim()}
                  onClick={submit}
                >
                  {sending ? "Envoi…" : "Envoyer la commande"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
