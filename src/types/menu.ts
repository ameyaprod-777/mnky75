export type CategorieMenu =
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

export interface MenuItem {
  id: string;
  nom: string;
  description?: string;
  prix: number; // en centimes ou en euros selon votre convention
  categorie: CategorieMenu;
  image_url?: string;
  actif: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
}
