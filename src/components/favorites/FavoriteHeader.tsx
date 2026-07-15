import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface FavoriteHeaderProps {
  count: number;
}

export function FavoriteHeader({ count }: FavoriteHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mes Favoris</Text>
      <Text style={styles.count}>{count} article{count > 1 ? 's' : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundElement,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
  },
  count: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
