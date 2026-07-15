import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ProductCard } from '@/components/ProductCard';

interface FavoriteGridProps {
  favorites: any[]; // Remplacer par le type Product plus tard
}

export function FavoriteGrid({ favorites }: FavoriteGridProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.gridContainer}>
        {favorites.map((product) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
  },
});
