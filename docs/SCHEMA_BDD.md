# Schéma de base de données — Moonkey Paris

Base : **PostgreSQL**. Scripts d’init dans `docker/init/` (01 à 04).

---

## 1. Statut du restaurant (`restaurant_status`)

Table **singleton** pour l’indicateur "Table disponible" / "Complet ce soir".

| Colonne       | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| id            | UUID      | PK, une seule ligne (id fixe)        |
| is_open       | BOOLEAN   | `true` = on accepte les résas        |
| message_custom| TEXT      | Message optionnel (ex. "Complet ce soir") |
| updated_at    | TIMESTAMPTZ | Dernière modification               |
| updated_by    | UUID      | (Optionnel) Admin qui a modifié      |

**Usage** : le dashboard admin met à jour cette table ; la landing et la page réservation lisent `is_open` (+ `message_custom`) pour afficher le bandeau ou désactiver le formulaire.

---

## 2. Réservations (`reservations`)

| Colonne          | Type        | Description |
|------------------|-------------|-------------|
| id               | UUID        | PK          |
| nom              | TEXT        | Nom du client |
| telephone        | TEXT        | Téléphone   |
| nombre_personnes | INTEGER     | 1–20        |
| date             | DATE        | Date de la résa (YYYY-MM-DD) |
| creneau          | TEXT        | Ex. "20h00", "20h30" |
| commentaire      | TEXT        | Optionnel   |
| statut           | TEXT        | `en_attente` \| `confirmee` \| `annulee` \| `terminee` |
| evenement_id     | UUID        | FK vers `evenements` (optionnel) |
| type_table       | TEXT        | `standard` \| `vue_ecran` (event-based seating) |
| created_at       | TIMESTAMPTZ |             |
| updated_at       | TIMESTAMPTZ |             |

**Index** : `date`, `statut`, `created_at DESC` pour les listes admin et les filtres.

---

## 3. Événements (`evenements`)

Pour les **soirs de match** ou événements spéciaux (places "vue écran", etc.).

| Colonne     | Type        | Description |
|-------------|-------------|-------------|
| id          | UUID        | PK          |
| nom         | TEXT        | Ex. "Match PSG" |
| date_debut  | DATE        |             |
| date_fin    | DATE        | Optionnel   |
| description | TEXT        |             |
| actif       | BOOLEAN     | Affiché ou non |
| created_at  | TIMESTAMPTZ |             |
| updated_at  | TIMESTAMPTZ |             |

---

## 4. Menu (`menu_items`)

| Colonne    | Type        | Description |
|------------|-------------|-------------|
| id         | UUID        | PK          |
| nom        | TEXT        | Nom du plat / chicha / boisson |
| description| TEXT        | Optionnel   |
| prix       | INTEGER     | **En centimes** (ex. 1250 = 12,50 €) |
| categorie  | TEXT        | `entrees` \| `plats` \| `chichas` \| `boissons` |
| image_url  | TEXT        | URL image   |
| actif      | BOOLEAN     | Affiché sur le menu public |
| ordre      | INTEGER     | Ordre d’affichage dans la catégorie |
| created_at | TIMESTAMPTZ |             |
| updated_at | TIMESTAMPTZ |             |

**Index** : `categorie`, `(actif, ordre)` pour la page menu.

---

## 5. Sécurité (RLS) et rôles

- **Lecture publique** : `restaurant_status` (statut), `menu_items` où `actif = true`.
- **Insertion** : tout le monde peut insérer dans `reservations` (formulaire public).
- **Admin** : à protéger côté application (middleware, auth, etc.) ; pas de RLS activé par défaut.

---

## 6. Temps réel (optionnel)

L’admin utilise du **polling** (rafraîchissement toutes les 5 s) pour les commandes, appels et réservations. Pour du vrai temps réel plus tard : WebSockets ou Server-Sent Events.

---

## Résumé des flux

1. **Client** : formulaire réservation → INSERT `reservations` ; lecture `restaurant_status` pour afficher "Table disponible" ou "Complet".
2. **Admin** : UPDATE `restaurant_status` ; SELECT/UPDATE `reservations` ; CRUD `menu_items` et `evenements`.
3. **Menu public** : SELECT `menu_items` WHERE `actif = true` ORDER BY `ordre`.
