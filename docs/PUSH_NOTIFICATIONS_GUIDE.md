# 🔔 Guide : Push Notifications KEA App

## Architecture du système

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐     ┌──────────────┐
│  App KEA     │────▶│ Firebase Firestore│     │ Expo Push API │────▶│ FCM / APNs   │
│ (téléphone)  │     │ (stocke tokens)   │◀────│ (envoie notif)│     │ (délivre)    │
└─────────────┘     └──────────────────┘     └───────────────┘     └──────────────┘
                              ▲                        ▲
                              │                        │
                     ┌────────┴────────┐      ┌───────┴───────┐
                     │ Cloud Function  │──────│ Script admin  │
                     │ (optionnel)     │      │ ou dashboard  │
                     └─────────────────┘      └───────────────┘
```

## Flux simplifié

1. L'utilisateur installe l'app → l'app demande la permission notif
2. Si accepté → l'app reçoit un **Expo Push Token**
3. Le token est envoyé et stocké dans **Firebase Firestore**
4. Pour envoyer une notif → un script lit les tokens dans Firestore → appelle l'**Expo Push API**
5. Expo transmet à FCM (Android) / APNs (iOS) → le téléphone reçoit la notif

---

## ÉTAPE 1 : Créer le projet Firebase

### 1.1 Console Firebase
1. Aller sur https://console.firebase.google.com
2. Cliquer "Ajouter un projet" → nommer "kea-app"
3. Désactiver Google Analytics (pas nécessaire)
4. Créer le projet

### 1.2 Ajouter l'app Android
1. Dans le projet Firebase → "Ajouter une application" → Android
2. Nom du package : `com.achraf.keashop` (doit correspondre à app.json)
3. Télécharger le fichier `google-services.json`
4. Le placer à la racine du projet Expo

### 1.3 Ajouter l'app iOS (pour plus tard)
1. "Ajouter une application" → iOS
2. Bundle ID : `com.achraf.keashop`
3. Télécharger `GoogleService-Info.plist`
4. Le placer à la racine du projet Expo

### 1.4 Activer Firestore
1. Dans le menu Firebase → "Firestore Database"
2. Cliquer "Créer une base de données"
3. Choisir "Mode production"
4. Choisir la région `europe-west1` (Belgique, proche de la France)

### 1.5 Règles Firestore
Dans Firestore → Règles, mettre :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les tokens peuvent être écrits par n'importe qui (l'app)
    match /push_tokens/{tokenId} {
      allow create, update: if true;
      allow read, delete: if false; // Seul le backend/admin peut lire
    }
  }
}
```

---

## ÉTAPE 2 : Configurer l'app Expo

### 2.1 Installer les packages

```bash
npx expo install expo-notifications expo-device expo-constants
npx expo install @react-native-firebase/app @react-native-firebase/messaging
# OU plus simple avec le SDK Firebase JS :
npm install firebase
```

> **Note** : On utilise le SDK Firebase JS (pas react-native-firebase) car c'est
> plus simple avec Expo et suffisant pour Firestore.

### 2.2 Configurer app.json

Ajouter dans `app.json` → `expo` :

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#1a1a1a"
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### 2.3 Configurer les credentials FCM dans EAS

```bash
# Récupérer la Server Key FCM depuis Firebase Console :
# Firebase → Paramètres projet → Cloud Messaging → Server key (V1)
# Puis :
eas credentials
# → Android → Push Notifications → Ajouter la FCM Server Key
```

---

## ÉTAPE 3 : Code dans l'app

### 3.1 Initialiser Firebase — `src/services/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TA_API_KEY",
  authDomain: "kea-app.firebaseapp.com",
  projectId: "kea-app",
  storageBucket: "kea-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abcdef"
};

// Ces valeurs se trouvent dans Firebase Console → Paramètres → Général

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3.2 Service de notifications — `src/services/notifications.ts`

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Configuration : comment afficher les notifs quand l'app est ouverte
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Récupérer le push token et le stocker dans Firestore
export async function registerForPushNotifications(): Promise<string | null> {
  // Vérifier que c'est un vrai appareil (pas un simulateur)
  if (!Device.isDevice) {
    console.log('Les notifications ne marchent pas sur simulateur');
    return null;
  }

  // Demander la permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission notifications refusée');
    return null;
  }

  // Configuration Android : canal de notification
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'KEA Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E5A822',
    });
  }

  // Récupérer le token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenData.data;

  console.log('Push Token:', token);

  // Stocker le token dans Firebase Firestore
  await savePushToken(token);

  return token;
}

// Sauvegarder le token dans Firestore
async function savePushToken(token: string) {
  try {
    // On utilise le token comme ID du document (évite les doublons)
    const tokenRef = doc(db, 'push_tokens', token);
    await setDoc(tokenRef, {
      token: token,
      platform: Platform.OS,
      createdAt: new Date().toISOString(),
      // Si tu as un système d'auth, ajoute l'ID utilisateur ici :
      // userId: currentUser?.id || null,
    }, { merge: true }); // merge: true = met à jour si existe déjà

    console.log('Token sauvegardé dans Firestore');
  } catch (error) {
    console.error('Erreur sauvegarde token:', error);
  }
}

// Écouter les notifs reçues quand l'app est ouverte
export function addNotificationListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Écouter quand l'utilisateur CLIQUE sur une notif
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
```

### 3.3 Appeler dans le layout principal — `src/app/_layout.tsx`

Ajouter dans le composant RootLayout (ou le layout principal) :

```typescript
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  addNotificationListener,
  addNotificationResponseListener,
} from '@/services/notifications';

export default function RootLayout() {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // Enregistrer pour les push notifications
    registerForPushNotifications();

    // Écouter les notifs reçues (app ouverte)
    notificationListener.current = addNotificationListener((notification) => {
      console.log('Notif reçue:', notification);
    });

    // Écouter les clics sur les notifs
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notif cliquée, data:', data);

      // Exemple : naviguer vers un produit
      // if (data.productId) {
      //   router.push(`/product/${data.productId}`);
      // }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // ... reste du layout
}
```

---

## ÉTAPE 4 : Envoyer des notifications

### 4.1 Script Node.js pour envoyer (à mettre dans `scripts/send-notification.js`)

```javascript
// Usage : node scripts/send-notification.js "Titre" "Message"

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialiser Firebase Admin (côté serveur)
// Télécharger la clé de service depuis :
// Firebase Console → Paramètres → Comptes de service → Générer une clé privée
const serviceAccount = require('./firebase-service-key.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function sendNotificationToAll(title, body, data = {}) {
  // 1. Récupérer tous les tokens depuis Firestore
  const snapshot = await db.collection('push_tokens').get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  console.log(`Envoi à ${tokens.length} appareils...`);

  // 2. Expo Push API accepte max 100 tokens par requête
  const chunks = [];
  for (let i = 0; i < tokens.length; i += 100) {
    chunks.push(tokens.slice(i, i + 100));
  }

  // 3. Envoyer par lots
  for (const chunk of chunks) {
    const messages = chunk.map(token => ({
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: data, // Données custom (ex: { productId: '123', screen: 'promo' })
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log('Résultat:', result);
  }

  console.log('✅ Notifications envoyées !');
}

// Récupérer les arguments de la ligne de commande
const title = process.argv[2] || '🔥 Nouveauté KEA';
const body = process.argv[3] || 'Découvrez nos nouveaux produits !';

sendNotificationToAll(title, body);
```

### 4.2 Comment envoyer une notif

```bash
# Installer firebase-admin (une seule fois)
npm install firebase-admin

# Envoyer une notif à tous les utilisateurs
node scripts/send-notification.js "🔥 -30% sur tout !" "Profitez de notre vente flash"

# Avec des données custom (pour ouvrir un écran spécifique)
# → Modifier le script pour passer les data
```

---

## ÉTAPE 5 : Fonctionnalités avancées (pour plus tard)

### 5.1 Notif ciblée (un seul utilisateur)
Stocker le `userId` avec le token dans Firestore, puis filtrer.

### 5.2 Notifs par segment
Ajouter des tags aux tokens (ex: "a_acheté", "nouveau_client") pour cibler.

### 5.3 Notifs programmées
Utiliser Firebase Cloud Functions avec un scheduler (cron).

### 5.4 Notifs automatiques
Webhook Shopify → quand un nouveau produit est ajouté → Cloud Function → envoie notif.

### 5.5 Page admin dans l'app
Créer un écran admin dans l'app pour envoyer des notifs directement depuis l'app.

---

## Résumé des coûts

| Service | Coût | Limite gratuite |
|---------|------|-----------------|
| Firebase Firestore | Gratuit | 50K lectures/jour, 20K écritures/jour |
| Expo Push API | Gratuit | Illimité |
| FCM (Google) | Gratuit | Illimité |
| APNs (Apple) | Gratuit | Illimité (inclus dans Apple Developer) |

**Total : 0€** pour des milliers d'utilisateurs.

---

## Checklist d'implémentation

- [ ] Créer projet Firebase
- [ ] Ajouter app Android dans Firebase
- [ ] Télécharger `google-services.json`
- [ ] Activer Firestore
- [ ] Installer `expo-notifications`, `firebase`
- [ ] Configurer `app.json` (plugin expo-notifications)
- [ ] Configurer FCM credentials dans EAS
- [ ] Créer `src/services/firebase.ts`
- [ ] Créer `src/services/notifications.ts`
- [ ] Intégrer dans `_layout.tsx`
- [ ] Créer le script d'envoi `scripts/send-notification.js`
- [ ] Tester sur un vrai appareil
- [ ] Rebuild l'app avec `eas build`
