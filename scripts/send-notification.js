// ============================================
// Script pour envoyer des push notifications KEA
// Usage : node scripts/send-notification.js "Titre" "Message"
// ============================================

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Charger la clé de service Firebase Admin
const serviceAccount = require('./firebase-service-key.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function sendNotificationToAll(title, body, data = {}) {
  // 1. Récupérer tous les tokens depuis Firestore
  const snapshot = await db.collection('push_tokens').get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  if (tokens.length === 0) {
    console.log('❌ Aucun appareil enregistré !');
    console.log('   → Installe d\'abord l\'app sur un téléphone.');
    return;
  }

  console.log(`📱 Envoi à ${tokens.length} appareil(s)...`);

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
      data: data,
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    // Vérifier les erreurs
    if (result.data) {
      result.data.forEach((ticket, i) => {
        if (ticket.status === 'error') {
          console.log(`  ❌ Erreur pour ${chunk[i]}:`, ticket.message);
        }
      });
    }
  }

  console.log('✅ Notifications envoyées avec succès !');
}

// Récupérer les arguments
const title = process.argv[2] || '🔥 Nouveauté KEA';
const body = process.argv[3] || 'Découvrez nos nouveaux produits !';

sendNotificationToAll(title, body);
