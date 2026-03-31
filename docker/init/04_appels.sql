-- Appels serveur & charbon (depuis la page Commander)

CREATE TABLE IF NOT EXISTS appels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('serveur', 'charbon')),
  statut TEXT NOT NULL DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'traite', 'annulee')),
  numero_table TEXT,
  commentaire TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appels_statut ON appels(statut);
CREATE INDEX IF NOT EXISTS idx_appels_created_at ON appels(created_at DESC);

DROP TRIGGER IF EXISTS appels_updated_at ON appels;
CREATE TRIGGER appels_updated_at
  BEFORE UPDATE ON appels
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
