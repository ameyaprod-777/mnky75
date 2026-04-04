-- Ajoute le numéro de table aux commandes (déploiements existants)
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS numero_table TEXT;
