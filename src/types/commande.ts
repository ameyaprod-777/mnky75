export type StatutCommande =
  | "en_attente"
  | "en_preparation"
  | "pret"
  | "livre"
  | "annulee";

export interface CommandeItem {
  id: string;
  nom: string;
  quantite: number;
  prix: number;
  categorie?: string;
}

export interface Commande {
  id: string;
  items: CommandeItem[];
  statut: StatutCommande;
  numero_table?: string;
  commentaire?: string;
  created_at: string;
  updated_at: string;
}

export interface CommandeCreate {
  items: CommandeItem[];
  numero_table: string;
  commentaire?: string;
}
