import type { MenuCategoryId } from "@/lib/menu-data";

/** Prix d'une formule (plat hors entrecôte + chicha, ou entrée + dessert + chicha). */
export const PRIX_FORMULE_COMMANDE = 30;

export type LignePanierFormule = {
  item: {
    id: string;
    categorie: MenuCategoryId;
    prix: number;
  };
  quantite: number;
};

function baseMenuId(item: { id: string }): string {
  return item.id.split("__")[0];
}

function consumeQuantity(
  pool: { item: LignePanierFormule["item"]; qty: number }[],
  predicate: (item: LignePanierFormule["item"]) => boolean
): boolean {
  const idx = pool.findIndex((p) => p.qty > 0 && predicate(p.item));
  if (idx < 0) return false;
  pool[idx].qty -= 1;
  return true;
}

/**
 * Applique les formules à 30 € : d'abord entrée + dessert + chicha, puis plat (≠ entrecôte) + chicha.
 * L’entrecôte (id menu p2) ne compte pas pour la formule plat + chicha.
 */
export function computeCommandeFormules(cart: LignePanierFormule[]): {
  brut: number;
  total: number;
  remise: number;
  bundlesEdc: number;
  bundlesPc: number;
} {
  const brut = cart.reduce((acc, { item, quantite }) => acc + item.prix * quantite, 0);

  const pool = cart.map((c) => ({ item: c.item, qty: c.quantite }));

  let bundlesEdc = 0;
  while (true) {
    const hasE = pool.some((p) => p.qty > 0 && p.item.categorie === "entrees");
    const hasD = pool.some((p) => p.qty > 0 && p.item.categorie === "desserts");
    const hasC = pool.some((p) => p.qty > 0 && p.item.categorie === "chichas");
    if (!hasE || !hasD || !hasC) break;
    consumeQuantity(pool, (i) => i.categorie === "entrees");
    consumeQuantity(pool, (i) => i.categorie === "desserts");
    consumeQuantity(pool, (i) => i.categorie === "chichas");
    bundlesEdc++;
  }

  let bundlesPc = 0;
  while (true) {
    const hasP = pool.some(
      (p) =>
        p.qty > 0 &&
        p.item.categorie === "plats" &&
        baseMenuId(p.item) !== "p2"
    );
    const hasC = pool.some((p) => p.qty > 0 && p.item.categorie === "chichas");
    if (!hasP || !hasC) break;
    consumeQuantity(
      pool,
      (i) => i.categorie === "plats" && baseMenuId(i) !== "p2"
    );
    consumeQuantity(pool, (i) => i.categorie === "chichas");
    bundlesPc++;
  }

  const restSum = pool.reduce((acc, p) => acc + p.item.prix * p.qty, 0);
  const total =
    bundlesEdc * PRIX_FORMULE_COMMANDE +
    bundlesPc * PRIX_FORMULE_COMMANDE +
    restSum;
  const remise = Math.max(0, brut - total);

  return {
    brut,
    total: Math.round(total * 100) / 100,
    remise: Math.round(remise * 100) / 100,
    bundlesEdc,
    bundlesPc,
  };
}
