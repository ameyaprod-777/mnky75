# Sécuriser l’admin

L’interface admin (`/admin`) est protégée par identifiant/mot de passe.
Les comptes autorisés sont définis via la variable d’environnement `ADMIN_USERS` dans `.env.local`.

## Comptes actifs

Exemple :

```env
ADMIN_USERS=moonkey:moonkey,serveur:serveur,charbon:charbon
```

## Comportement

- Toute visite vers `/admin` ou `/admin/...` est redirigée vers **`/admin/login`** si l’utilisateur n’est pas connecté.
- Si les identifiants sont corrects, un cookie de session est créé.
- Le bouton **Déconnexion** supprime ce cookie et renvoie vers `/admin/login`.

Le cookie est **HttpOnly**, **Secure** en production, et expire au bout de **7 jours**.

## Modifier les comptes admin

Édite `ADMIN_USERS` dans `.env.local` :

- format : `id:motdepasse,id2:motdepasse2`
- redémarre l’application après modification.
