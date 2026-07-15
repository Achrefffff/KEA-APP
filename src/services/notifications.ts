import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Configuration : comment afficher les notifs quand l'app est ouverte
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Enregistrer l'appareil et stocker le token
export async function registerForPushNotifications(): Promise<string | null> {
  // Configurer le canal de notification Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'KEA Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E5A822',
    });
  }

  // Vérifier/demander la permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permission notifications refusée par l\'utilisateur');
    return null;
  }

  // Récupérer le projectId (avec fallback)
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.error('❌ Project ID introuvable');
    return null;
  }

  // Récupérer le token Expo Push
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;

    console.log('✅ Push Token:', token);

    // Stocker le token dans Firebase Firestore
    await savePushToken(token);

    return token;
  } catch (error) {
    console.error('❌ Erreur récupération token:', error);
    return null;
  }
}

// Sauvegarder le token dans Firestore
async function savePushToken(token: string) {
  try {
    const tokenRef = doc(db, 'push_tokens', token);
    await setDoc(
      tokenRef,
      {
        token: token,
        platform: Platform.OS,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('✅ Token sauvegardé dans Firestore');
  } catch (error) {
    console.error('❌ Erreur sauvegarde token:', error);
  }
}

// Écouter les notifs reçues (app ouverte)
export function addNotificationListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Écouter les clics sur les notifs
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
