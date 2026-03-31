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

export interface MenuItemData {
  id: string;
  nom: string;
  description?: string;
  prix: number; // en euros
  categorie: MenuCategoryId;
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
  { id: "th1", nom: "Pad thaï", description: "POULET/BOEUF(+1€)/CREVETTES(+2€)", prix: 14, categorie: "plats_thai" },
  { id: "th2", nom: "KRAO PAD", description: "RIZ THAI POULET/BOEUF(+1€)/CREVETTES(+2€)/POULET CROUSTILLANT(+3€)", prix: 13, categorie: "plats_thai" },
  { id: "th3", nom: "BOEUF LOC LAC", prix: 16, categorie: "plats_thai" },
  // ——— Pâtes ———
  { id: "pa1", nom: "RIGATONI FORESTIÈRE", prix: 13, categorie: "pates" },
  { id: "pa2", nom: "RIGATONI CARBONARA", prix: 14, categorie: "pates" },
  // ——— Burgers ———
  { id: "bu1", nom: "MOONKEY BURGER", description: "STEAK SMASHÉ PUR BOEUF, SAUCE MAISON, CHEDDAR", prix: 12, categorie: "burgers" },
  { id: "bu2", nom: "CHICKEN BURGER", description: "MAYO EPICÉE, FILET DE POULET CHAPELURE PANKO, CHEDDAR ET SALADE", prix: 13, categorie: "burgers" },
  // ——— Plats ———
  { id: "p1", nom: "ESCALOPE DE POULET GRATINÉE A LA MOZZARELA", description: "GARNITURE AU CHOIX: FRITES, PURÉE, POÊLÉE DE LÉGUMES OU PÂTES A LA CRÈME", prix: 15, categorie: "plats" },
  { id: "p2", nom: "ENTRECÔTE GRILLÉE", description: "AU BEURRE MOUSSEUX THYM ET AIL, ACCOMPAGNÉE D'UNE SAUCE POIVRE, GARNITURE AU CHOIX", prix: 18, categorie: "plats" },
  { id: "p3", nom: "CORDON BLEU MAISON", description: "GARNITURE AU CHOIX", prix: 16, categorie: "plats" },
  { id: "p4", nom: "ESCAKIOE DE OIYKET FARCIE AU PESTO", description: "GARNITURE AU CHOIX", prix: 16, categorie: "plats" },
  // ——— Chichas ———
  { id: "c1", nom: "CHICHA CELESTE + SOFT", prix: 15, categorie: "chichas" },
  { id: "c2", nom: "CHICHA KALOUD", prix: 15, categorie: "chichas" },
  { id: "c3", nom: "CHICHA QUASAR", prix: 20, categorie: "chichas" },
  { id: "c4", nom: "TÊTE SUPPLÉMENTAIRE", prix: 5, categorie: "chichas" },
  { id: "c5", nom: "GOÛTS DISPONIBLE", description: "MENTHE, HAWAÏ, LOVE 66, MI AMOR, LADY KILLER", prix: 0, categorie: "chichas" },
  // ——— Desserts ———
  { id: "d1", nom: "BRIOCHE PERDUE", description: "NUTELLA, CARAMEL OU PISTACHE", prix: 10, categorie: "desserts" },
  { id: "d2", nom: "MINI BRIOCHES PERDUES", description: "NUTELLA, PISTACHE OU EL MORDJENE", prix: 10, categorie: "desserts" },
  { id: "d3", nom: "PANCAKES", description: "NUTELLA, BEURRE DE CACAHUETES OU SIROP D'ÉRABLE", prix: 10, categorie: "desserts" },
  { id: "d4", nom: "FONDANT AU CHOCOLAT, CRÈME ANGLAISE ET GLACE VANILLE", prix: 8, categorie: "desserts" },
  // ——— Soft ———
  { id: "sf1", nom: "EVIAN", prix: 5, categorie: "soft" },
  { id: "sf2", nom: "SAN PELLEGRINO", prix: 5, categorie: "soft" },
  { id: "sf3", nom: "COCA-COLA", prix: 5, categorie: "soft" },
  { id: "sf4", nom: "FUZETEA", prix: 5, categorie: "soft" },
  { id: "sf5", nom: "OASIS", prix: 5, categorie: "soft" },
  { id: "sf6", nom: "SCHWEPPES", prix: 5, categorie: "soft" },
  { id: "sf7", nom: "SIROP AUX CHOIX", prix: 5, categorie: "soft" },
  { id: "sf8", nom: "REDBULL", prix: 7, categorie: "soft" },
  // ——— Mocktails ———
  { id: "m1", nom: "MOJITO", description: "MENTHE, FRAISE, PASSION", prix: 9, categorie: "mocktails" },
  { id: "m2", nom: "MOONKEY CUBA", description: "ORANGE, ANANAS, CITRON ALLONGÉ A LA LIMONADE", prix: 8, categorie: "mocktails" },
  { id: "m3", nom: "FRESH LEMON/MINT", description: "CITRON FRAPPÉ, MENTHE FRAICHE, LIMONADE", prix: 9, categorie: "mocktails" },
  { id: "m4", nom: "TIKI MARACUJA", description: "FRUIT DE LA PASSION, MANGUE, CITRON VERT", prix: 9, categorie: "mocktails" },
  { id: "m5", nom: "NIKITA COLADA", description: "COCO FRAPPÉE, ANANAS FRAIS", prix: 9, categorie: "mocktails" },
  // ——— Smoothies ———
  { id: "sm1", nom: "MANGUE", prix: 8, categorie: "smoothies" },
  { id: "sm2", nom: "FRAISE", prix: 8, categorie: "smoothies" },
  { id: "sm3", nom: "ANANAS", prix: 8, categorie: "smoothies" },
  { id: "sm4", nom: "BANANE", prix: 8, categorie: "smoothies" },
  { id: "sm5", nom: "FLORIDA", description: "BANANE OU FRAISE", prix: 10, categorie: "smoothies" },
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
