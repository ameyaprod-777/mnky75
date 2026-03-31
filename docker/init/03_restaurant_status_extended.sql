-- Étendre restaurant_status : créneaux bloqués et délai commandes

ALTER TABLE restaurant_status
  ADD COLUMN IF NOT EXISTS blocked_creneaux JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS delai_commandes TEXT;

-- Mettre à jour la ligne singleton si besoin (valeurs par défaut)
UPDATE restaurant_status
SET blocked_creneaux = COALESCE(blocked_creneaux, '[]'::jsonb),
    delai_commandes = delai_commandes
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;
