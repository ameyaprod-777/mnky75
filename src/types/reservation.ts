export type StatutReservation =
  | "en_attente"
  | "confirmee"
  | "annulee"
  | "terminee";

export type ExperienceReservation =
  | "chicha_boissons"
  | "repas_chicha"
  | "chicha_uniquement"
  | "repas_uniquement"
  | "anniversaire";

export interface Reservation {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  email?: string;
  nombre_personnes: number;
  date: string; // ISO date YYYY-MM-DD
  creneau: string;
  commentaire?: string;
  experience?: ExperienceReservation;
  statut: StatutReservation;
  created_at: string;
  updated_at: string;
  // Optionnel : pour événements (match, etc.)
  evenement_id?: string;
  type_table?: "standard" | "vue_ecran";
}

export interface ReservationCreate {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  nombre_personnes: number;
  date: string;
  creneau: string;
  commentaire?: string;
  experience?: ExperienceReservation;
  evenement_id?: string;
  type_table?: "standard" | "vue_ecran";
}
