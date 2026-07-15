import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface ShippingProgressProps {
  subtotal: number;
  freeShippingThreshold: number;
}

export function ShippingProgress({ subtotal, freeShippingThreshold }: ShippingProgressProps) {
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(1, subtotal / freeShippingThreshold);

  return (
    <View style={styles.shippingCard}>
      {remaining > 0 ? (
        <Text style={styles.shippingText}>
          🚚 Plus que <Text style={{ fontWeight: '800' }}>{remaining.toFixed(2)}€</Text> pour
          la livraison gratuite !
        </Text>
      ) : (
        <Text style={styles.successText}>
          ✅ Vous bénéficiez de la livraison gratuite !
        </Text>
      )}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: progress >= 1 ? '#10b981' : Colors.light.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shippingCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: Colors.light.backgroundElement,
  },
  shippingText: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.light.text,
  },
  successText: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
    color: '#065f46',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
