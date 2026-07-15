import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { MenuRow } from '@/components/ui/MenuRow';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { AuthPrompt } from '@/components/auth/AuthPrompt';

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoggedIn, customer, logout } = useAuthStore();

  const handlePress = (action: string) => {
    console.log(`Action: ${action}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Si non connecté → afficher l'écran d'invitation à se connecter
  if (!isLoggedIn || !customer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AuthPrompt />
      </SafeAreaView>
    );
  }

  // Si connecté → afficher le profil complet
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <ProfileHeader 
          name={fullName || 'Client KEA'} 
          email={customer.email} 
        />

        <ProfileSection title="Mes Achats">
          <MenuRow 
            iconName="cube-outline" 
            title="Mes commandes" 
            subtitle="Suivre, retourner ou racheter" 
            onPress={() => router.push('/account/orders' as any)} 
          />
          <MenuRow 
            iconName="receipt-outline" 
            title="Factures" 
            onPress={() => handlePress('factures')} 
          />
        </ProfileSection>

        <ProfileSection title="Mon Compte">
          <MenuRow 
            iconName="person-outline" 
            title="Informations personnelles" 
            onPress={() => router.push('/account/personal-info' as any)} 
          />
          <MenuRow 
            iconName="location-outline" 
            title="Adresses de livraison" 
            onPress={() => router.push('/account/addresses' as any)} 
          />
          <MenuRow 
            iconName="card-outline" 
            title="Moyens de paiement" 
            onPress={() => handlePress('paiement')} 
          />
        </ProfileSection>

        <ProfileSection title="Assistance">
          <MenuRow 
            iconName="help-circle-outline" 
            title="Centre d'aide (FAQ)" 
            onPress={() => handlePress('faq')} 
          />
          <MenuRow 
            iconName="chatbubble-ellipses-outline" 
            title="Nous contacter" 
            onPress={() => handlePress('contact')} 
          />
        </ProfileSection>

        <ProfileSection>
          <MenuRow 
            iconName="log-out-outline" 
            title="Se déconnecter" 
            isDestructive 
            onPress={handleLogout} 
          />
        </ProfileSection>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});

