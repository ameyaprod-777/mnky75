export type TypeAppel = "serveur" | "charbon";
export type StatutAppel = "en_attente" | "traite" | "annulee";

export interface Appel {
  id: string;
  type: TypeAppel;
  statut: StatutAppel;
  numero_table?: string;
  commentaire?: string;
  created_at: string;
  updated_at: string;
}

export interface AppelCreate {
  type: TypeAppel;
  numero_table?: string;
  commentaire?: string;
}
