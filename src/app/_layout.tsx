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
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

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
      const data = response.notification.request.content.data as any;
      console.log('👆 Notification cliquée, data:', data);

      if (data && data.redirectType) {
        if (data.redirectType === 'product' && data.redirectId) {
          // Si l'ID est sous format numérique REST, on le convertit en GID attendu par le GraphQL Storefront
          const redirectIdStr = String(data.redirectId);
          const productGid = redirectIdStr.startsWith('gid://')
            ? redirectIdStr
            : `gid://shopify/Product/${redirectIdStr}`;
          
          console.log('🚀 Navigation vers le produit:', productGid);
          // Attendre un court instant que l'arbre de navigation de l'app soit prêt
          setTimeout(() => {
            router.push(`/product/${encodeURIComponent(productGid)}`);
          }, 500);
        } else if (data.redirectType === 'collection' && data.redirectId) {
          console.log('🚀 Navigation vers la collection handle:', data.redirectId);
          // Attendre un court instant que l'arbre de navigation de l'app soit prêt
          setTimeout(() => {
            router.push(`/collection/${data.redirectId}`);
          }, 500);
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
