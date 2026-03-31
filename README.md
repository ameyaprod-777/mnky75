# Moonkey Paris — Restaurant Lounge Chicha

Application web pour **Moonkey Paris**, 192 Rue Raymond Losserand, 75014 Paris.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** + thème Jungle (vert, anthracite, or/cuivre)
- **Shadcn/UI** (composants)
- **Framer Motion** (animations)
- **PostgreSQL** (via `pg`, BDD lancée avec Docker)

## Démarrage

```bash
npm install
docker compose up -d   # BDD locale
cp .env.local.example .env.local
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Voir `docs/DOCKER_BDD.md` pour la config BDD.

## Structure

- `src/app/` — Pages (accueil, menu, réservation, commandes, admin…)
- `src/components/` — Composants (layout, home, ui, commandes, reservation)
- `src/lib/` — Utils, constantes, BDD (`db.ts`), sons de notification
- `src/types/` — Types TypeScript (réservation, commande, appel)
- `docker/init/` — Scripts SQL d’init (réservations, commandes, appels, statut)
- `docs/SCHEMA_BDD.md` — Description du schéma de données

## Configuration

1. **BDD** : `DATABASE_URL` dans `.env.local` (voir `.env.local.example`). En local : `docker compose up -d` puis l’URL indiquée dans la doc.
2. **Admin** : définir `ADMIN_USERS` dans `.env.local` (ex: `moonkey:moonkey,serveur:serveur,charbon:charbon`).
3. **WhatsApp** : modifier `whatsapp` dans `src/lib/constants.ts`.

## Scripts

- `npm run dev` — Serveur de développement
- `npm run build` — Build production
- `npm run start` — Démarrer le serveur production
- `npm run lint` — Linter
