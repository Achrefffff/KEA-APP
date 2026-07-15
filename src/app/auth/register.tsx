import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis.';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis.';

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'L\'email n\'est pas valide.';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (password.length < 5) {
      newErrors.password = 'Le mot de passe doit contenir au moins 5 caractères.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const result = await register(firstName.trim(), lastName.trim(), email.trim(), password);

    if (result.success) {
      Alert.alert(
        "Félicitations ! 🎉",
        "Votre compte a été créé avec succès.\n\nUn email d'activation vous a été envoyé. Veuillez vérifier votre boîte de réception (et vos spams) puis cliquer sur le lien pour activer votre compte avant de vous connecter.",
        [
          { 
            text: "J'ai compris", 
            onPress: () => router.replace('/auth/login' as any) 
          }
        ]
      );
    } else {
      setErrors({ general: result.error || 'Une erreur est survenue.' });
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
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez KEA pour suivre vos commandes et profiter d'avantages exclusifs.
            </Text>
          </View>

          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <AuthInput
                label="Prénom"
                placeholder="Sarah"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                error={errors.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <AuthInput
                label="Nom"
                placeholder="Dupont"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                error={errors.lastName}
              />
            </View>
          </View>

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
            placeholder="Minimum 5 caractères"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={errors.password}
          />

          <Button
            label="Créer mon compte"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.submitButton}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Déjà un compte ? </Text>
            <Text
              style={styles.switchLink}
              onPress={() => router.replace('/auth/login' as any)}
            >
              Se connecter
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
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
