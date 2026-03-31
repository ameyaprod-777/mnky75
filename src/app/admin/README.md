# Admin — Accès en développement

## Comment accéder au dashboard

En **version dev** (serveur local) :

1. Démarre l’app : `npm run dev`
2. Ouvre dans le navigateur : **http://localhost:3000/admin**

Aucun mot de passe ni clé n’est demandé en dev. L’interface est réservée à ton usage local.

Pour que les réservations s’affichent dans l’admin, lance la BDD avec Docker et configure `DATABASE_URL` — voir **docs/DOCKER_BDD.md**.

## Pages disponibles

- **Tableau de bord** (`/admin`) : résumé statut + lien vers réservations
- **Statut** (`/admin/statut`) : modifier “Table disponible” / “Complet ce soir”, message personnalisé, créneaux bloqués
- **Réservations** (`/admin/reservations`) : liste des réservations (remplie une fois la base de données connectée)

## Production

En production, protège l’accès à `/admin` (auth, cookie session, ou secret dans l’URL, etc.).
