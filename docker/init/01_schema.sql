-- Moonkey Paris — Schéma pour Docker (réservations avec prenom, email, experience)

CREATE TABLE IF NOT EXISTS restaurant_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open BOOLEAN NOT NULL DEFAULT true,
  message_custom TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

INSERT INTO restaurant_status (id, is_open, message_custom)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, true, NULL)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS evenements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE,
  description TEXT,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT,
  nombre_personnes INTEGER NOT NULL CHECK (nombre_personnes > 0 AND nombre_personnes <= 20),
  date DATE NOT NULL,
  creneau TEXT NOT NULL,
  commentaire TEXT,
  experience TEXT,
  statut TEXT NOT NULL DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'confirmee', 'annulee', 'terminee')),
  evenement_id UUID REFERENCES evenements(id),
  type_table TEXT CHECK (type_table IN ('standard', 'vue_ecran')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  prix INTEGER NOT NULL CHECK (prix >= 0),
  categorie TEXT NOT NULL CHECK (categorie IN ('entrees', 'plats', 'chichas', 'boissons')),
  image_url TEXT,
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_categorie ON menu_items(categorie);
CREATE INDEX IF NOT EXISTS idx_menu_items_actif_ordre ON menu_items(actif, ordre);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reservations_updated_at ON reservations;
CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS menu_items_updated_at ON menu_items;
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS evenements_updated_at ON evenements;
CREATE TRIGGER evenements_updated_at
  BEFORE UPDATE ON evenements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
