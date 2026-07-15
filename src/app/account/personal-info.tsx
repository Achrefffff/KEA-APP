import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/theme';
import { AuthInput } from '@/components/auth/AuthInput';

export default function PersonalInfoScreen() {
  const { customer } = useAuthStore();

  if (!customer) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Données personnelles</Text>
        
        <AuthInput 
          label="Prénom" 
          value={customer.firstName} 
          editable={false} 
        />
        
        <AuthInput 
          label="Nom" 
          value={customer.lastName} 
          editable={false} 
        />
        
        <AuthInput 
          label="Email" 
          value={customer.email} 
          editable={false} 
        />
        
        {customer.phone && (
          <AuthInput 
            label="Téléphone" 
            value={customer.phone} 
            editable={false} 
          />
        )}
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>
          Pour modifier ces informations, veuillez vous rendre sur le site web de la boutique.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  footerInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
