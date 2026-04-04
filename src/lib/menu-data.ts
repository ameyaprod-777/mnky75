/**
 * Carte Moonkey — Données du menu (inspirées du concept Lounge Chicha).
 * Vous pouvez les remplacer par les vrais articles de votre carte Canva.
 */

export type MenuCategoryId =
  | "entrees"
  | "sandwiches"
  | "plats_thai"
  | "pates"
  | "burgers"
  | "plats"
  | "chichas"
  | "desserts"
  | "soft"
  | "mocktails"
  | "smoothies"
  | "milkshakes"
  | "boissons";

export interface MenuItemVariant {
  key: string;
  label: string;
  prix: number;
}

/** Garnitures proposées pour certains plats (prix inchangé, choix obligatoire). */
function garnitureVariants(prixPlat: number): MenuItemVariant[] {
  return [
    { key: "frites", label: "Frites", prix: prixPlat },
    { key: "puree", label: "Purée", prix: prixPlat },
    { key: "poelee_legumes", label: "Poêlée de légumes", prix: prixPlat },
    { key: "pates_creme", label: "Pâtes à la crème", prix: prixPlat },
  ];
}

/** Goûts chicha (prix inchangé, même logique que garnitureChoice). */
function chichaGoutVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "menthe", label: "MENTHE", prix },
    { key: "hawai", label: "HAWAÏ", prix },
    { key: "love66", label: "LOVE 66", prix },
    { key: "mi_amor", label: "MI AMOR", prix },
    { key: "lady_killer", label: "LADY KILLER", prix },
  ];
}

/** Soft de la carte — source unique pour la catégorie « soft » et CHICHA CELESTE + SOFT. */
const SOFT_DEF: { id: string; nom: string; prix: number }[] = [
  { id: "sf1", nom: "EVIAN", prix: 5 },
  { id: "sf2", nom: "SAN PELLEGRINO", prix: 5 },
  { id: "sf3", nom: "COCA-COLA", prix: 5 },
  { id: "sf4", nom: "FUZETEA", prix: 5 },
  { id: "sf5", nom: "OASIS", prix: 5 },
  { id: "sf6", nom: "SCHWEPPES", prix: 5 },
  { id: "sf7", nom: "SIROP AUX CHOIX", prix: 5 },
  { id: "sf8", nom: "REDBULL", prix: 7 },
];

function softVariantsForChicha(prixChicha: number): MenuItemVariant[] {
  return SOFT_DEF.map((s) => ({
    key: s.id,
    label: s.nom,
    prix: prixChicha,
  }));
}

function briochePerdueVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "nutella", label: "NUTELLA", prix },
    { key: "caramel", label: "CARAMEL", prix },
    { key: "pistache", label: "PISTACHE", prix },
  ];
}

function miniBriochesPerduesVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "nutella", label: "NUTELLA", prix },
    { key: "pistache", label: "PISTACHE", prix },
    { key: "el_mordjene", label: "EL MORDJENE", prix },
  ];
}

function pancakesVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "nutella", label: "NUTELLA", prix },
    { key: "beurre_cacahuetes", label: "BEURRE DE CACAHUETES", prix },
    { key: "sirop_erable", label: "SIROP D'ÉRABLE", prix },
  ];
}

function mojitoVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "menthe", label: "MENTHE", prix },
    { key: "fraise", label: "FRAISE", prix },
    { key: "passion", label: "PASSION", prix },
  ];
}

function floridaVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "banane", label: "Banane", prix },
    { key: "fraise", label: "Fraise", prix },
  ];
}

/** Cuisson pour certains plats (prix inchangé). */
function cuissonPlatVariants(prix: number): MenuItemVariant[] {
  return [
    { key: "bleu", label: "Bleu", prix },
    { key: "saignant", label: "Saignant", prix },
    { key: "a_point", label: "À point", prix },
    { key: "bien_cuit", label: "Bien cuit", prix },
  ];
}

/** Pour panier / commande : une ligne par variante (id du type `th1__poulet` ou `p1__frites__a_point`). */
export function resolveMenuVariantLine(
  item: MenuItemData,
  pick: Record<string, string>,
  cuissonPick: Record<string, string> = {}
): MenuItemData {
  if (!item.variants?.length) return item;
  const first = item.variants[0];
  const chosenKey =
    pick[item.id] && item.variants.some((v) => v.key === pick[item.id])
      ? pick[item.id]
      : first.key;
  const v = item.variants.find((x) => x.key === chosenKey)!;
  const isGarniture = item.garnitureChoice === true;
  let line: MenuItemData = {
    ...item,
    id: `${item.id}__${v.key}`,
    nom: isGarniture ? `${item.nom} — ${v.label}` : v.label,
    prix: isGarniture ? item.prix : v.prix,
    description: undefined,
    variants: undefined,
    cuissonVariants: undefined,
  };
  if (item.cuissonVariants?.length) {
    const cFirst = item.cuissonVariants[0];
    const cChosenKey =
      cuissonPick[item.id] &&
      item.cuissonVariants.some((x) => x.key === cuissonPick[item.id])
        ? cuissonPick[item.id]
        : cFirst.key;
    const c = item.cuissonVariants.find((x) => x.key === cChosenKey)!;
    line = {
      ...line,
      id: `${line.id}__${c.key}`,
      nom: `${line.nom} — ${c.label}`,
    };
  }
  return line;
}

export interface MenuItemData {
  id: string;
  nom: string;
  description?: string;
  prix: number; // en euros (prix affiché par défaut si variantes)
  categorie: MenuCategoryId;
  /** Si défini : choix obligatoire (ex. Pad thaï poulet / bœuf / crevettes) */
  variants?: MenuItemVariant[];
  /** Si true avec variants : choix de garniture, prix du plat inchangé */
  garnitureChoice?: boolean;
  /** Cuisson au choix (ex. plats), prix inchangé ; affiché en second menu après les variantes */
  cuissonVariants?: MenuItemVariant[];
}

/** Grandes lignes affichées sur la page d'accueil (liens vers la carte filtrée) */
export const MENU_MAIN_CATEGORIES: { id: MenuCategoryId; label: string }[] = [
  { id: "entrees", label: "Entrées" },
  { id: "plats", label: "Plats" },
  { id: "desserts", label: "Desserts" },
  { id: "boissons", label: "Boissons" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "chichas", label: "Chichas" },
];

export const MENU_CATEGORIES: { id: MenuCategoryId; label: string }[] = [
  { id: "entrees", label: "Entrées" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "plats_thai", label: "Plats thaï" },
  { id: "pates", label: "Pâtes" },
  { id: "burgers", label: "Burgers" },
  { id: "plats", label: "Plats" },
  { id: "chichas", label: "Chichas" },
  { id: "desserts", label: "Desserts" },
  { id: "soft", label: "Soft" },
  { id: "mocktails", label: "Mocktails" },
  { id: "smoothies", label: "Smoothies" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "boissons", label: "Boissons" },
];

export const MENU_ITEMS: MenuItemData[] = [
  // ——— Entrées ———
  { id: "e1", nom: "BURATTA", description: "Et ses tomates cerises", prix: 9, categorie: "entrees" },
  { id: "e2", nom: "CROQUE MOONKEY", description: "BÉCHAMEL, JAMBON ET MOZZARELLA", prix: 10, categorie: "entrees" },
  { id: "e4", nom: "TRIO DE TACOS KEBAB", description: "VIANDE DE KEBAB, SAUCE BLANCHE REVISITÉE, ET CONDIMENTS DE PICKLES", prix: 12, categorie: "entrees" },
  { id: "e5", nom: "SALADE CESAR FAÇON MOONKEY", description: "MIX DE JEUNES POUSSES, TOMATES, OIGNONS, POULET, ET SAUCE CÉSAR", prix: 12, categorie: "entrees" },
  { id: "e6", nom: "ASSORTIMENT ASIATIQUE", prix: 12, categorie: "entrees" },
  { id: "e7", nom: "DYNAMITE POULET", prix: 7, categorie: "entrees" },
  { id: "e8", nom: "DYNAMITE CREVETTE", prix: 8, categorie: "entrees" },
  // ——— Sandwiches ———
  { id: "sw1", nom: "Sandwich Poulet", description: "AVEC FRITES", prix: 10, categorie: "sandwiches" },
  { id: "sw2", nom: "Sandwich Américain", description: "AVEC FRITES", prix: 10, categorie: "sandwiches" },
  // ——— Plats thaï ———
  {
    id: "th1",
    nom: "Pad thaï",
    description: "Choisissez votre option ci-dessous",
    prix: 14,
    categorie: "plats_thai",
    variants: [
      { key: "poulet", label: "Pad thaï poulet", prix: 14 },
      { key: "boeuf", label: "Pad thaï bœuf", prix: 15 },
      { key: "crevettes", label: "Pad thaï crevettes", prix: 16 },
    ],
  },
  {
    id: "th2",
    nom: "Riz thaï",
    description: "Choisissez votre option ci-dessous",
    prix: 13,
    categorie: "plats_thai",
    variants: [
      { key: "poulet", label: "Riz thaï poulet", prix: 13 },
      { key: "boeuf", label: "Riz thaï bœuf", prix: 14 },
      { key: "crevettes", label: "Riz thaï crevettes", prix: 15 },
      { key: "poulet_croustillant", label: "Riz thaï poulet croustillant", prix: 16 },
    ],
  },
  { id: "th3", nom: "BOEUF LOC LAC", prix: 16, categorie: "plats_thai" },
  // ——— Pâtes ———
  { id: "pa1", nom: "RIGATONI FORESTIÈRE", prix: 13, categorie: "pates" },
  { id: "pa2", nom: "RIGATONI CARBONARA", prix: 14, categorie: "pates" },
  // ——— Burgers ———
  { id: "bu1", nom: "MOONKEY BURGER", description: "STEAK SMASHÉ PUR BOEUF, SAUCE MAISON, CHEDDAR", prix: 12, categorie: "burgers" },
  { id: "bu2", nom: "CHICKEN BURGER", description: "MAYO EPICÉE, FILET DE POULET CHAPELURE PANKO, CHEDDAR ET SALADE", prix: 13, categorie: "burgers" },
  // ——— Plats (garniture au choix, prix identique) ———
  {
    id: "p1",
    nom: "ESCALOPE DE POULET GRATINÉE A LA MOZZARELA",
    description:
      "Choisissez votre garniture et la cuisson ci-dessous",
    prix: 15,
    categorie: "plats",
    garnitureChoice: true,
    variants: garnitureVariants(15),
    cuissonVariants: cuissonPlatVariants(15),
  },
  {
    id: "p2",
    nom: "ENTRECÔTE GRILLÉE",
    description:
      "Au beurre moussoux thym et ail, sauce poivre — choisissez votre garniture et la cuisson ci-dessous",
    prix: 18,
    categorie: "plats",
    garnitureChoice: true,
    variants: garnitureVariants(18),
    cuissonVariants: cuissonPlatVariants(18),
  },
  {
    id: "p3",
    nom: "CORDON BLEU MAISON",
    description: "Choisissez votre garniture ci-dessous",
    prix: 16,
    categorie: "plats",
    garnitureChoice: true,
    variants: garnitureVariants(16),
  },
  {
    id: "p4",
    nom: "ESCAKIOE DE OIYKET FARCIE AU PESTO",
    description:
      "Choisissez votre garniture et la cuisson ci-dessous",
    prix: 16,
    categorie: "plats",
    garnitureChoice: true,
    variants: garnitureVariants(16),
    cuissonVariants: cuissonPlatVariants(16),
  },
  // ——— Chichas ———
  {
    id: "c1",
    nom: "CHICHA CELESTE + SOFT",
    description: "Choisissez votre soft ci-dessous",
    prix: 15,
    categorie: "chichas",
    garnitureChoice: true,
    variants: softVariantsForChicha(15),
  },
  { id: "c2", nom: "CHICHA KALOUD", prix: 15, categorie: "chichas" },
  { id: "c3", nom: "CHICHA QUASAR", prix: 20, categorie: "chichas" },
  { id: "c4", nom: "TÊTE SUPPLÉMENTAIRE", prix: 5, categorie: "chichas" },
  {
    id: "c5",
    nom: "GOÛTS DISPONIBLE",
    description: "Choisissez votre goût ci-dessous",
    prix: 0,
    categorie: "chichas",
    garnitureChoice: true,
    variants: chichaGoutVariants(0),
  },
  // ——— Desserts ———
  {
    id: "d1",
    nom: "BRIOCHE PERDUE",
    description: "Choisissez votre parfum ci-dessous",
    prix: 10,
    categorie: "desserts",
    garnitureChoice: true,
    variants: briochePerdueVariants(10),
  },
  {
    id: "d2",
    nom: "MINI BRIOCHES PERDUES",
    description: "Choisissez votre parfum ci-dessous",
    prix: 10,
    categorie: "desserts",
    garnitureChoice: true,
    variants: miniBriochesPerduesVariants(10),
  },
  {
    id: "d3",
    nom: "PANCAKES",
    description: "Choisissez votre parfum ci-dessous",
    prix: 10,
    categorie: "desserts",
    garnitureChoice: true,
    variants: pancakesVariants(10),
  },
  { id: "d4", nom: "FONDANT AU CHOCOLAT, CRÈME ANGLAISE ET GLACE VANILLE", prix: 8, categorie: "desserts" },
  // ——— Soft ———
  ...SOFT_DEF.map(
    (s): MenuItemData => ({
      id: s.id,
      nom: s.nom,
      prix: s.prix,
      categorie: "soft",
    })
  ),
  // ——— Mocktails ———
  {
    id: "m1",
    nom: "MOJITO",
    description: "Choisissez votre parfum ci-dessous",
    prix: 9,
    categorie: "mocktails",
    garnitureChoice: true,
    variants: mojitoVariants(9),
  },
  { id: "m2", nom: "MOONKEY CUBA", description: "ORANGE, ANANAS, CITRON ALLONGÉ A LA LIMONADE", prix: 8, categorie: "mocktails" },
  { id: "m3", nom: "FRESH LEMON/MINT", description: "CITRON FRAPPÉ, MENTHE FRAICHE, LIMONADE", prix: 9, categorie: "mocktails" },
  { id: "m4", nom: "TIKI MARACUJA", description: "FRUIT DE LA PASSION, MANGUE, CITRON VERT", prix: 9, categorie: "mocktails" },
  { id: "m5", nom: "NIKITA COLADA", description: "COCO FRAPPÉE, ANANAS FRAIS", prix: 9, categorie: "mocktails" },
  // ——— Smoothies ———
  { id: "sm1", nom: "MANGUE", prix: 8, categorie: "smoothies" },
  { id: "sm2", nom: "FRAISE", prix: 8, categorie: "smoothies" },
  { id: "sm3", nom: "ANANAS", prix: 8, categorie: "smoothies" },
  { id: "sm4", nom: "BANANE", prix: 8, categorie: "smoothies" },
  {
    id: "sm5",
    nom: "FLORIDA",
    description: "Choisissez votre parfum ci-dessous",
    prix: 10,
    categorie: "smoothies",
    garnitureChoice: true,
    variants: floridaVariants(10),
  },
  // ——— Milkshakes ———
  { id: "ms1", nom: "KINDER BUENO", description: "VANILLE, KINDER BUENO AU LAIT", prix: 8, categorie: "milkshakes" },
  { id: "ms2", nom: "COOKIES", description: "VANILLE, COOKIES, LAIT", prix: 8, categorie: "milkshakes" },
  { id: "ms3", nom: "OREO", description: "VANILLE, OREO, LAIT", prix: 8, categorie: "milkshakes" },
  { id: "ms4", nom: "M&MS", description: "VANILLE, M&MS, LAIT", prix: 8, categorie: "milkshakes" },
  { id: "ms5", nom: "MANGO BERRIES", description: "MANGUE, FRAISE, LAIT", prix: 8, categorie: "milkshakes" },
  // ——— Boissons ———
  { id: "b1", nom: "Thé à la menthe", description: "Traditionnel", prix: 5, categorie: "boissons" },
  { id: "b2", nom: "Café expresso / allongé", prix: 3, categorie: "boissons" },
  { id: "b3", nom: "Bouteille d'eau", prix: 3, categorie: "boissons" },
];
