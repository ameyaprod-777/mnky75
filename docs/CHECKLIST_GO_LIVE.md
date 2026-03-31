# Checklist Go-Live (15 points)

Checklist pratique avant mise en production de la webapp Moonkey Paris.

## Technique & sécurité

1. Définir toutes les variables d’environnement en prod (`DATABASE_URL`, `SMTP_*`, `MAIL_FROM`, `ADMIN_SECRET`).
2. Vérifier que **aucun secret** n’est commité dans le repo (mot de passe SMTP, clés, tokens).
3. Régénérer/rotater les identifiants exposés pendant les tests.
4. Protéger `/admin` et tester login/logout sur mobile et desktop.
5. Activer HTTPS/TLS et redirection HTTP → HTTPS.

## Base de données

6. Vérifier la connexion PostgreSQL depuis le serveur de prod.
7. Appliquer le schéma SQL nécessaire (tables réservations, commandes, appels, statut).
8. Tester les sauvegardes (backup) + restauration.

## Parcours métier

9. Tester une réservation complète (création + visibilité admin + changement de statut).
10. Tester l’envoi email : reçu / confirmé / refusé (inbox + spam).
11. Tester les commandes (création, changement de statut, notifications admin).
12. Tester les appels serveur/charbon (création, traitement, notifications admin).

## Qualité & conformité

13. Vérifier responsive mobile des pages clés (accueil, réservation, commandes, admin).
14. Vérifier pages légales en ligne : mentions légales, confidentialité, cookies.
15. Lancer build prod + smoke test final (`npm run build`, puis test manuel des routes principales).

