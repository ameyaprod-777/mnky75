-- Migration: autoriser le statut "annulee" pour les appels
ALTER TABLE appels DROP CONSTRAINT IF EXISTS appels_statut_check;
ALTER TABLE appels
  ADD CONSTRAINT appels_statut_check
  CHECK (statut IN ('en_attente', 'traite', 'annulee'));

