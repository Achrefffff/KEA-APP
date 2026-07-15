import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductCard } from '@/components/ProductCard';
import { Colors } from '@/constants/theme';

interface SearchResultsProps {
  query: string;
  results: any[]; // On utilisera le type Product de notre fichier de types plus tard
}

export function SearchResults({ query, results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun résultat pour "{query}"</Text>
        <Text style={styles.emptySubtext}>Vérifiez l'orthographe ou essayez un autre mot-clé.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultsCount}>{results.length} résultat{results.length > 1 ? 's' : ''}</Text>
      <View style={styles.gridContainer}>
        {results.map((product) => (
          <View key={product.id} style={styles.gridItem}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 24,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
