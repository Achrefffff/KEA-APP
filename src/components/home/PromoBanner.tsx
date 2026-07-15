import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PromoBanner() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text style={styles.text}>
        RE D'AMOUR OFFERT DÈS 49€ D'ACHATS 🎁
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#e25822', // Orange color matching the screenshot
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
