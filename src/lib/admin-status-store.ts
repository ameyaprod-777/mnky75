/**
 * Store en mémoire du statut restaurant (pour la dev sans BDD).
 * GET /api/status lit ici ; PATCH /api/status écrit ici.
 */

export interface AdminStatusState {
  is_open: boolean;
  message: string | null;
  blockedCreneaux: string[];
  /** Délai d'attente affiché sur la page Commander (ex: "5", "10", "20" pour 5 min, 10 min, 20 min), ou null pour ne rien afficher */
  delaiCommandes: string | null;
}

const defaultState: AdminStatusState = {
  is_open: true,
  message: null,
  blockedCreneaux: [],
  delaiCommandes: null,
};

let state: AdminStatusState = { ...defaultState };

export function getAdminStatus(): AdminStatusState {
  return { ...state };
}

export function setAdminStatus(update: Partial<AdminStatusState>): AdminStatusState {
  if (update.is_open !== undefined) state.is_open = update.is_open;
  if (update.message !== undefined) state.message = update.message;
  if (update.blockedCreneaux !== undefined) state.blockedCreneaux = [...update.blockedCreneaux];
  if (update.delaiCommandes !== undefined) state.delaiCommandes = update.delaiCommandes;
  return getAdminStatus();
}
