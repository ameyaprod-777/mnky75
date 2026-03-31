-- Table des commandes (chicha, boissons, etc.) envoyées depuis la page /commandes

CREATE TABLE IF NOT EXISTS commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB NOT NULL DEFAULT '[]',  -- [{ "id": "c1", "nom": "...", "quantite": 2, "prix": 15 }]
  statut TEXT NOT NULL DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'en_preparation', 'pret', 'livre', 'annulee')),
  commentaire TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON commandes(created_at DESC);

DROP TRIGGER IF EXISTS commandes_updated_at ON commandes;
CREATE TRIGGER commandes_updated_at
  BEFORE UPDATE ON commandes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
