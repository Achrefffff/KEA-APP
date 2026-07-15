import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

if (getApps().length === 0 && firebasePrivateKey && firebaseClientEmail && firebaseProjectId) {
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
  // Sécuriser l'endpoint Cron pour n'être déclenché que par Vercel Cron
  const authHeader = request.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ message: 'Non autorisé.' });
  }

  try {
    const now = new Date().toISOString();

    // 1. Chercher les notifications planifiées "en attente" dont l'heure de publication est passée
    const pendingNotifications = await db
      .collection('scheduled_notifications')
      .where('status', '==', 'pending')
      .where('scheduledAt', '<=', now)
      .get();

    if (pendingNotifications.empty) {
      return response.status(200).json({ message: 'Aucune notification à traiter.' });
    }

    console.log(`⏱️ Traitement de ${pendingNotifications.size} notification(s) planifiée(s)...`);

    for (const doc of pendingNotifications.docs) {
      const notif = doc.data();
      const notifId = doc.id;

      try {
        // 2. Récupérer les tokens correspondants à la cible
        let queryRef: any = db.collection('push_tokens');
        if (notif.target !== 'all') {
          queryRef = queryRef.where('platform', '==', notif.target);
        }
        const tokensSnapshot = await queryRef.get();
        const tokens = tokensSnapshot.docs.map((tDoc: any) => tDoc.data().token);

        if (tokens.length > 0) {
          // 3. Préparer les messages pour l'API Expo
          const messages = tokens.map((token: string) => ({
            to: token,
            sound: 'default',
            title: notif.title,
            body: notif.body,
            data: { 
              redirectType: notif.redirectType, 
              redirectId: notif.redirectId, 
              imageUrl: notif.imageUrl 
            },
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

          // 4. Marquer comme envoyée
          await doc.ref.update({
            status: 'sent',
            sentAt: new Date().toISOString(),
          });
          console.log(`✅ Notification ${notifId} envoyée à ${tokens.length} appareil(s)`);
        } else {
          // Si aucun appareil, marquer quand même comme traitée mais avec 0 envois
          await doc.ref.update({
            status: 'sent',
            sentAt: new Date().toISOString(),
            notes: 'Aucun appareil cible trouvé lors de la planification.',
          });
          console.log(`ℹ️ Notification planifiée ${notifId} traitée (0 appareils cibles)`);
        }
      } catch (notifError) {
        console.error(`❌ Erreur envoi notif planifiée ${notifId}:`, notifError);
        await doc.ref.update({
          status: 'failed',
          errorLog: notifError instanceof Error ? notifError.message : String(notifError),
        });
      }
    }

    return response.status(200).json({ success: true, processedCount: pendingNotifications.size });
  } catch (error) {
    console.error('Erreur globale Cron Sender:', error);
    return response.status(500).json({
      message: 'Erreur lors du traitement du Cron.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
