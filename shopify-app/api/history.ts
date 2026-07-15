import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin de manière sécurisée
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

if (!firebasePrivateKey || !firebaseClientEmail || !firebaseProjectId) {
  throw new Error('Variables d\'environnement Firebase manquantes');
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
  response.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Cas 1 : Récupérer l'historique (GET)
  if (request.method === 'GET') {
    try {
      const snapshot = await db.collection('scheduled_notifications')
        .orderBy('createdAt', 'desc')
        .limit(30)
        .get();

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return response.status(200).json(list);
    } catch (error) {
      console.error('Erreur GET history:', error);
      return response.status(500).json({
        message: 'Impossible de charger l\'historique.',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Cas 2 : Supprimer/Annuler une notification planifiée (DELETE)
  if (request.method === 'DELETE') {
    const { id } = request.query;

    if (!id || typeof id !== 'string') {
      return response.status(400).json({ message: 'ID de la notification requis.' });
    }

    try {
      await db.collection('scheduled_notifications').doc(id).delete();
      return response.status(200).json({ success: true, message: 'Notification supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur DELETE history:', error);
      return response.status(500).json({
        message: 'Impossible de supprimer la notification.',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return response.status(405).json({ message: 'Méthode non autorisée.' });
}
