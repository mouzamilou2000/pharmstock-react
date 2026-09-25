# PharmStock — React + Supabase

Application de gestion de pharmacie (stock, alertes, entrées/sorties, fournisseurs, rapports),
convertie depuis la version HTML/JS statique vers React (Vite) avec Supabase comme backend.

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), créez un nouveau projet.
2. Dans **SQL Editor**, collez et exécutez le contenu de `supabase/schema.sql`.
   Cela crée les 4 tables (`medicaments`, `fournisseurs`, `entrees`, `sorties`),
   les policies RLS, et deux fonctions RPC (`enregistrer_entree`, `enregistrer_sortie`)
   qui mettent à jour le stock de façon atomique.
3. Dans **Project Settings > API**, récupérez `Project URL` et `anon public key`.

### Authentification

Les policies RLS par défaut exigent un utilisateur **authentifié** (`auth.role() = 'authenticated'`).
Le plus simple : activez l'auth par email dans Supabase (**Authentication > Providers**) et
ajoutez un écran de connexion — ou, pour tester rapidement en développement, remplacez
temporairement les policies par un accès public (voir le commentaire en bas de `schema.sql`).

## 2. Configurer le projet local

```bash
npm install
copy .env.example .env.local    :: (Windows CMD)
```

Ouvrez `.env.local` et renseignez :

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

## 3. Lancer en local

```bash
npm run dev
```

## 4. Déployer sur Vercel

1. Poussez ce dossier sur un dépôt Git (GitHub/GitLab).
2. Sur Vercel : **New Project** → importez le dépôt (framework détecté : Vite).
3. Dans **Settings > Environment Variables**, ajoutez `VITE_SUPABASE_URL` et
   `VITE_SUPABASE_ANON_KEY` (mêmes valeurs que `.env.local`).
4. Déployez.

## Structure du projet

```
src/
  supabaseClient.js      Client Supabase (lit les variables d'environnement)
  hooks/
    useTable.js           Hook générique : lecture + abonnement temps réel
    useMedicaments.js      CRUD médicaments
    useMouvements.js       Entrées/sorties (via RPC atomique)
    useFournisseurs.js     CRUD fournisseurs
  components/
    views/                 Les 7 écrans (Dashboard, Stock, Alertes, ...)
    modals/                Les formulaires en popup
    Sidebar.jsx, Topbar.jsx, BottomNav.jsx
  App.jsx                  Assemblage : état de navigation + modales
supabase/
  schema.sql               Tables, RLS, fonctions RPC, realtime
```

## Fonctionnalités

- Synchronisation en temps réel (Supabase Realtime) : si deux postes sont ouverts,
  les changements de l'un apparaissent chez l'autre sans rafraîchir la page.
- Mouvements de stock atomiques : une entrée/sortie et la mise à jour de la quantité
  se font dans une seule transaction côté base (fonctions RPC), pour éviter les
  incohérences en cas d'erreur réseau.
- Le design (couleurs, mise en page, responsive mobile) reprend fidèlement la version
  HTML d'origine.

## Installation sur téléphone / ordinateur (PWA)

L'application est une PWA (Progressive Web App) : une fois déployée (Vercel, HTTPS obligatoire),
elle peut être **installée comme une app native**.

- **Android (Chrome)** : menu ⋮ → "Installer l'application" (ou bannière automatique).
- **iPhone/iPad (Safari)** : bouton Partager → "Sur l'écran d'accueil".
- **Ordinateur (Chrome/Edge)** : icône d'installation dans la barre d'adresse.

Une fois installée : icône dédiée, ouverture en plein écran (sans barre de navigateur),
et un cache local permet de recharger l'app même sans connexion (les données Supabase,
elles, nécessitent une connexion pour se rafraîchir — voir `vite.config.js`, section `workbox`).

En développement (`npm run dev`), le service worker est désactivé (`devOptions.enabled: false`) ;
il ne s'active que sur un build de production (`npm run build` / déploiement Vercel).

## Impression et export PDF du stock

Dans l'écran **Stock & Médicaments**, le bouton **"Imprimer / PDF"** ouvre la boîte de dialogue
d'impression du navigateur avec une mise en page épurée (sans menu ni boutons, avec un
en-tête récapitulatif : date, filtres appliqués, nombre de références, valeur totale).

- Pour imprimer sur papier : choisissez votre imprimante puis "Imprimer".
- Pour exporter en PDF : dans la même boîte de dialogue, choisissez la destination
  **"Enregistrer en PDF"** (disponible nativement dans tous les navigateurs modernes,
  aucune librairie supplémentaire n'est nécessaire).

Le résultat respecte le filtre de recherche et de catégorie actuellement appliqué à l'écran :
filtrez avant d'imprimer pour n'exporter qu'une catégorie, par exemple.

## Ce qui a changé par rapport à la version HTML

- Le stockage `localStorage` a été remplacé par Supabase (Postgres).
- L'état de l'application (médicaments, entrées, sorties, fournisseurs) est géré par
  des hooks React dédiés au lieu d'un objet global `db`.
- Chaque écran et chaque modale est un composant React séparé.
"# pharmstock-react" 
