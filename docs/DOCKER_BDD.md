# Lancer la base de données avec Docker

Pour que les réservations soient enregistrées et visibles dans l’admin, lance PostgreSQL en local avec Docker.

## 1. Démarrer le conteneur

À la racine du projet :

```bash
docker compose up -d
```

Cela crée le conteneur `moonkey-db` (PostgreSQL 16), exécute le schéma dans `docker/init/01_schema.sql` au premier démarrage, et expose le port **5433** sur ta machine (pour éviter le conflit avec un autre PostgreSQL sur 5432).

Vérifier que le conteneur tourne :

```bash
docker compose ps
```

## 2. Configurer l’app

Crée un fichier `.env.local` à la racine (s’il n’existe pas) avec :

```
DATABASE_URL=postgresql://moonkey:moonkey@localhost:5433/moonkey
```

(Utilisateur, mot de passe et base sont définis dans `docker-compose.yml`.)

## 3. Lancer l’app

```bash
npm run dev
```

## 4. Tester une réservation

1. Ouvre **http://localhost:3000/reservation**
2. Remplis le formulaire (prénom, nom, tél., date, créneau, etc.) et envoie
3. Ouvre **http://localhost:3000/admin/reservations** : la réservation doit apparaître dans le tableau

## Commandes utiles

- Arrêter la BDD : `docker compose down`
- Arrêter et supprimer les données : `docker compose down -v`
- Voir les logs : `docker compose logs -f db`

## Dépannage : « password authentication failed for user "moonkey" »

Si PostgreSQL refuse le mot de passe, le volume a souvent été créé avec d’autres identifiants. Recrée la base pour repartir avec les bons (moonkey/moonkey) :

```bash
docker compose down -v
docker compose up -d
```

Attends quelques secondes que PostgreSQL démarre, puis réessaie une réservation. Les données déjà en base seront perdues (normal en dev).

## Statut restaurant en BDD

Le statut (ouvert/complet, message, créneaux bloqués, délai commandes) est enregistré en BDD dans la table `restaurant_status`. Le script `docker/init/03_restaurant_status_extended.sql` ajoute les colonnes `blocked_creneaux` et `delai_commandes`. Si ta BDD existait avant : exécute le contenu de ce fichier sur ta base, ou recrée le volume (`docker compose down -v` puis `up -d`).

## Table Appels (Serveur & Charbon)

Le script `docker/init/04_appels.sql` crée la table `appels` (appels envoyés depuis la page Commander). Si ta BDD existait avant : exécute ce fichier sur ta base ou recrée le volume.

## Nouvelle table Commandes

La page **Commander** et l’onglet admin **Commandes** utilisent la table `commandes`. Celle-ci est créée par le script `docker/init/02_commandes.sql` au **premier** démarrage du conteneur. Si ta BDD existait déjà avant l’ajout de cette fonctionnalité :

- soit tu recrées tout : `docker compose down -v` puis `docker compose up -d` (les données réservations seront perdues) ;
- soit tu exécutes à la main le SQL dans `docker/init/02_commandes.sql` sur ta base (psql ou outil graphique).

## Dépannage : « port is already allocated » (5432)

Un autre logiciel (PostgreSQL installé sur le Mac, autre conteneur) utilise déjà le port 5432. Ce projet utilise donc le port **5433** : l’app se connecte à `localhost:5433`. Si tu as une ancienne config avec 5432, mets à jour `.env.local` avec le port 5433.
