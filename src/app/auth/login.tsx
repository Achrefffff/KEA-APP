import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'L\'email n\'est pas valide.';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login(email.trim(), password);

    if (result.success) {
      // @ts-ignore
      router.replace('/(tabs)');
    } else {
      setErrors({ general: result.error || 'Identifiants incorrects.' });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bon retour !</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour retrouver vos commandes et vos favoris.
            </Text>
          </View>

          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <AuthInput
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <AuthInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={errors.password}
          />

          <Button
            label="Se connecter"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.submitButton}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Pas encore de compte ? </Text>
            <Text
              style={styles.switchLink}
              onPress={() => router.replace('/auth/register' as any)}
            >
              Créer un compte
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: '#fdecea',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
