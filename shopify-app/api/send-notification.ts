import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin de manière sécurisée avec les variables d'environnement
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

if (!firebasePrivateKey || !firebaseClientEmail || !firebaseProjectId) {
  throw new Error('Variables d\'environnement Firebase manquantes (PrivateKey / ClientEmail / ProjectID)');
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Méthode non autorisée.' });
  }

  const { title, body, target, redirectType, redirectId, imageUrl, scheduledAt } = request.body;

  if (!title || !body) {
    return response.status(400).json({ message: 'Titre et message requis.' });
  }

  try {
    const notificationData = {
      title,
      body,
      target,
      redirectType,
      redirectId: redirectId || null,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
    };

    // Cas 1 : Notification planifiée
    if (scheduledAt) {
      const scheduledRef = db.collection('scheduled_notifications').doc();
      await scheduledRef.set({
        ...notificationData,
        scheduledAt,
        status: 'pending',
      });

      return response.status(200).json({
        success: true,
        message: 'Notification planifiée avec succès !',
      });
    }

    // Cas 2 : Envoi immédiat
    // 1. Récupérer tous les tokens correspondants à la cible
    let queryRef: any = db.collection('push_tokens');
    if (target !== 'all') {
      queryRef = queryRef.where('platform', '==', target);
    }
    const snapshot = await queryRef.get();
    const tokens = snapshot.docs.map((doc: any) => doc.data().token);

    if (tokens.length === 0) {
      return response.status(200).json({
        success: false,
        message: 'Aucun appareil enregistré trouvé pour cette cible.',
      });
    }

    // 2. Préparer les messages pour l'API Expo
    const messages = tokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: { redirectType, redirectId, imageUrl },
    }));

    // Envoi par lots de 100 max (limite API Expo)
    const chunks = [];
    for (let i = 0; i < messages.length; i += 100) {
      chunks.push(messages.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      });
    }

    // 3. Ajouter l'envoi dans l'historique
    const historyRef = db.collection('scheduled_notifications').doc();
    await historyRef.set({
      ...notificationData,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });

    return response.status(200).json({
      success: true,
      message: `Notification envoyée immédiatement à ${tokens.length} appareil(s) !`,
    });
  } catch (error) {
    console.error('Erreur send-notification:', error);
    return response.status(500).json({
      message: 'Erreur lors du traitement de la notification.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
