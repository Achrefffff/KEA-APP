import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  isLoading?: boolean;
  onCheckout: () => void;
}

export function CartSummary({ subtotal, isLoading = false, onCheckout }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('');

  return (
    <View style={styles.footer}>
      
      {/* Promo Code Section */}
      <View style={styles.promoContainer}>
        <TextInput 
          style={styles.promoInput}
          placeholder="Code promo ou carte cadeau"
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
        />
        <Pressable style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Appliquer</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Sous-total</Text>
        <Text style={styles.summaryPrice}>
          {subtotal.toFixed(2)}€
        </Text>
      </View>
      
      <Text style={styles.taxInfo}>
        Taxes incluses · Frais de port calculés au paiement
      </Text>
      
      <Button 
        label="Passer à la caisse" 
        onPress={onCheckout} 
        style={styles.checkoutBtn} 
        isLoading={isLoading}
      />
      
      <View style={styles.trustRow}>
        <Text style={styles.trustBadge}>🔒 Paiement sécurisé</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    paddingBottom: 30, // Juste assez d'espace pour le bas de l'écran
    backgroundColor: Colors.light.backgroundElement,
    borderTopColor: Colors.light.border,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 20,
  },
  promoInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  promoButton: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  taxInfo: {
    fontSize: 11,
    marginBottom: 16,
    color: Colors.light.textSecondary,
  },
  checkoutBtn: {
    width: '100%',
  },
  trustRow: {
    alignItems: 'center',
    marginTop: 12,
  },
  trustBadge: {
    fontSize: 12,
    color: '#888',
  },
});
