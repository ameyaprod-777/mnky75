# Améliorations possibles

Pistes d’évolution pour la webapp Moonkey Paris (Docker + PostgreSQL déjà en place).

---

## 1. Sécurité admin

**Actuel** : L’admin (`/admin`) est accessible à toute personne qui connaît l’URL.

**Amélioration** : Protéger l’accès par au moins une des options suivantes :

- **Secret dans l’URL** : ex. `/admin?key=SECRET` vérifié dans un middleware — rapide à mettre en place.
- **Auth simple** : page de login (mot de passe stocké en variable d’environnement ou hash en BDD) + cookie de session.
- **Auth complète** : NextAuth.js, Clerk ou autre, si tu veux plusieurs comptes ou rôles plus tard.

---

## 2. Données à personnaliser

- **WhatsApp** : Remplacer `+33600000000` dans `src/lib/constants.ts` par le vrai numéro du restaurant.
- Vérifier **adresse**, **Instagram**, **Google Maps** dans le même fichier si besoin.

---

## 3. Expérience utilisateur

- **Page 404** : Ajouter `src/app/not-found.tsx` pour une page d’erreur au style du site (évite aussi les warnings de build Next.js si besoin).
- **Feedback formulaire** : Message de succès plus visible ou redirection après réservation / commande.
- **Menu** : Si le menu vient d’une source externe (Canva, etc.), documenter la procédure de mise à jour dans le README ou une doc dédiée.

---

## 4. Production (si déploiement hors Docker local)

- **Variables d’env** : Définir `DATABASE_URL` vers une base PostgreSQL de prod (Neon, Railway, Vercel Postgres, etc.).
- **Build** : Vérifier que `npm run build` passe ; corriger les erreurs éventuelles (ex. `not-found`).
- **`.gitignore`** : S’assurer que `.env.local`, `node_modules/`, `.next/` sont ignorés.

---

## 5. Optionnel (plus tard)

- **Temps réel** : Aujourd’hui l’admin interroge la BDD toutes les 5 secondes (polling) pour afficher les nouvelles commandes, appels et réservations. Une amélioration serait d’utiliser des **WebSockets** ou **Server-Sent Events** pour que la liste se mette à jour **dès** qu’une nouvelle donnée arrive, sans attendre le prochain cycle de 5 s. Utile si tu veux une réactivité maximale côté écran serveur.
- **SEO** : JSON-LD (restaurant, horaires), métadonnées Open Graph, sitemap.
- **PWA** : Manifest et service worker pour installation sur mobile.
- **Réglages des notifications** : Les sons et les pop-ups navigateur (commandes, appels, réservations) sont déjà en place. Tu peux les affiner plus tard : par exemple un **bouton dans l’admin pour activer/désactiver le son**, ou **ne plus redemander la permission** si l’utilisateur a déjà refusé les notifications, ou encore **personnaliser les textes** des notifications (titres, messages).

---

En résumé : avec Docker et la BDD déjà en place, les principaux leviers d’amélioration sont la **protection de l’admin**, la **personnalisation des constantes** (WhatsApp, etc.) et, si tu déploies en prod, la **config `DATABASE_URL`** et le **build**.
