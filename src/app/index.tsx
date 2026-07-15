import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGuest = () => {
    // @ts-ignore
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={styles.topSection}>
          <Image 
            source={require('@/assets/images/KEA_NOIR_SANS_FOND-_3.png')} 
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.title}>Révélez votre beauté naturelle.</Text>
          <Text style={styles.subtitle}>
            Découvrez notre gamme exclusive de soins capillaires, pensés pour vous.
          </Text>
          
          <Button 
            label="Se connecter" 
            onPress={() => router.push('/auth/login' as any)}
            style={styles.loginButton}
            textStyle={{ color: '#fff' }}
          />

          <Button 
            label="Créer un compte" 
            variant="outline"
            onPress={() => router.push('/auth/register' as any)}
            style={styles.registerButton}
            textStyle={{ color: '#000' }}
          />

          <Pressable onPress={handleGuest} style={styles.guestLink}>
            <Text style={styles.guestText}>Continuer en tant qu'invité</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 60,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 16,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#000000',
    marginBottom: 12,
  },
  registerButton: {
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestText: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});

