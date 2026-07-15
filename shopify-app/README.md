# KEA Push Manager - Shopify Admin Dashboard

Ce dossier contient l'application web d'administration de notifications push de **KEA**, intégrée directement dans le panneau d'administration Shopify (embedded app).

---

## 🏗️ Architecture Technique

* **Frontend :** Single Page Application (SPA) en React + TypeScript + Vite, stylisée avec les composants officiels **Shopify Polaris** pour une intégration native parfaite.
* **Backend :** Serverless API hébergée sur **Vercel** (`/api/*` en Node.js/TypeScript).
* **Base de données :** **Firebase Firestore** pour stocker de manière sécurisée les jetons d'appareils mobiles (`push_tokens`) et l'historique des notifications (`scheduled_notifications`).
* **Envoi Push :** API **Expo Push Service** pour router les notifications vers iOS et Android.

---

## ⏰ Planification & Serveur Cron (Cron-Job.org)

Pour contourner la limitation des comptes gratuits Vercel (limités à 1 seule tâche cron par jour), nous utilisons un service de planification externe.

### Fonctionnement :
1. Lorsqu'une notification planifiée est créée dans le dashboard, elle est stockée dans Firestore avec le statut `pending` (en attente) et la date d'envoi souhaitée.
2. Un service externe (**Cron-Job.org**) appelle l'URL de notre serveur toutes les minutes :
   `GET https://kea-push-manager.vercel.app/api/cron-sender`
3. Le script serveur `/api/cron-sender` se réveille, interroge Firestore pour trouver les notifications `pending` dont l'heure d'envoi est passée, les envoie immédiatement aux téléphones via l'API Expo, puis met à jour leur statut en `sent` (envoyée).

### Configuration de Cron-Job.org :
* **URL à appeler :** `https://kea-push-manager.vercel.app/api/cron-sender`
* **Méthode :** `GET`
* **Fréquence :** Toutes les 1 minute (`Every 1 minute`)

---

## ⚡ Automations & Webhooks (Évolutions futures)

Pour envoyer des notifications automatiques instantanées (ex: "Nouveau produit disponible !", "Panier abandonné !"), **il ne faut pas utiliser de Cron**. On utilise les **Webhooks Shopify**.

### Principe de fonctionnement :
1. Crée un nouvel endpoint Vercel, par exemple `/api/webhooks/new-product.ts`.
2. Configure ce webhook dans ton espace Shopify Partenaire ou dans l'admin Shopify pour l'événement `products/create`.
3. Dès que tu ajoutes un produit, Shopify va envoyer une requête `POST` immédiate à ton endpoint `/api/webhooks/new-product` avec les détails du produit.
4. Ton script serveur intercepte la requête, récupère le titre et l'image du produit, et appelle l'API Expo pour envoyer une notification push instantanée à tous les clients.

---

## 🔑 Variables d'environnement requises (Vercel)

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `SHOPIFY_STORE_DOMAIN` | Domaine Shopify de la boutique | `a5821f-3.myshopify.com` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Jeton d'accès Admin de la boutique (commence par `shpat_`) | `shpat_0e00...864` |
| `SHOPIFY_CLIENT_ID` | Clé API de l'application partenaire | `7d31e6b2330786e8f3f3d8b23246f8c7` |
| `SHOPIFY_CLIENT_SECRET` | Secret de l'application partenaire (commence par `shpss_`) | `shpss_5c2d...99c` |
| `FIREBASE_PROJECT_ID` | ID de projet Firebase | `sustained-hold-400914` |
| `FIREBASE_CLIENT_EMAIL` | Email du compte de service Firebase | `firebase-adminsdk-fbsvc@...iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Clé privée Firebase (compte de service) | `-----BEGIN PRIVATE KEY-----\nMIIE...==\n-----END PRIVATE KEY-----\n` |

---

## 📱 Routage des Notifications sur l'App Mobile

Le traitement du clic utilisateur sur la notification s'effectue dans le fichier mobile [src/app/_layout.tsx](file:///c:/Users/Windows/Desktop/dev-Achraf/Application-kea/src/app/_layout.tsx) :

* **Format d'identifiant (Produits) :** Le backend Shopify Admin renvoie des identifiants REST numériques (ex: `818817290123`), alors que l'application mobile utilise GraphQL GIDs (ex: `gid://shopify/Product/818817290123`). L'application effectue la conversion automatique lors du clic.
* **Handles (Collections) :** Pour les collections, le backend transmet le `handle` (ex: `curly`, `kids-routines-capillaires`). L'application utilise ce handle pour charger la collection dynamique.
* **Délai de sécurité :** Un `setTimeout` de 500ms est appliqué pour laisser le temps à l'application d'initialiser son système de navigation avant de déclencher la redirection.
