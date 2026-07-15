import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GiftBannerProps {
  remainingForGift: number;
}

export function GiftBanner({ remainingForGift }: GiftBannerProps) {
  if (remainingForGift <= 0) return null;

  return (
    <View style={styles.giftCard}>
      <Text style={styles.giftText}>
        🎁 Plus que <Text style={{ fontWeight: '800' }}>{remainingForGift.toFixed(2)}€</Text> pour recevoir votre{' '}
        <Text style={{ fontWeight: '800' }}>cadeau gratuit</Text> !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  giftCard: {
    backgroundColor: '#fef3c7',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  giftText: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
  },
});
