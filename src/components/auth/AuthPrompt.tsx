import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

/**
 * Affiché dans l'onglet Profil quand le client n'est pas connecté.
 * Propose de se connecter ou de créer un compte.
 */
export function AuthPrompt() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="person-circle-outline" size={80} color={Colors.light.textSecondary} />
      </View>

      <Text style={styles.title}>Mon Espace</Text>
      <Text style={styles.subtitle}>
        Connectez-vous pour suivre vos commandes, gérer vos adresses et retrouver vos favoris.
      </Text>

      <Button
        label="Se connecter"
        onPress={() => router.push('/auth/login' as any)}
        style={styles.loginButton}
      />

      <Button
        label="Créer un compte"
        variant="outline"
        onPress={() => router.push('/auth/register' as any)}
        style={styles.registerButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
  },
  registerButton: {
    width: '100%',
  },
});
