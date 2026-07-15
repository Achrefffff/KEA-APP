"use client";
import { router, DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import {
  registerForPushNotifications,
  addNotificationListener,
  addNotificationResponseListener,
} from '@/services/notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    // Enregistrer pour les push notifications
    registerForPushNotifications();

    // Écouter les notifs reçues (app au premier plan)
    notificationListener.current = addNotificationListener((notification) => {
      console.log('📩 Notification reçue:', notification.request.content.title);
    });

    // Écouter quand l'utilisateur clique sur une notification
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('👆 Notification cliquée, data:', data);

      if (data && data.redirectType) {
        if (data.redirectType === 'product' && data.redirectId) {
          // Si l'ID est sous format numérique REST, on le convertit en GID attendu par le GraphQL Storefront
          const productGid = data.redirectId.startsWith('gid://')
            ? data.redirectId
            : `gid://shopify/Product/${data.redirectId}`;
          
          console.log('🚀 Navigation vers le produit:', productGid);
          router.push(`/product/${encodeURIComponent(productGid)}`);
        } else if (data.redirectType === 'collection' && data.redirectId) {
          console.log('🚀 Navigation vers la collection handle:', data.redirectId);
          router.push(`/collection/${data.redirectId}`);
        }
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null; // Garde le splash screen visible tant que la police n'est pas chargée
  }
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
