import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { ProductCard } from '@/components/ProductCard';
import { fetchCollectionProducts } from '@/services/shopify';
import { AppProduct } from '@/services/shopify/types';

export default function CollectionScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const router = useRouter();
  
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Pour avoir un beau titre basé sur le handle
  const title = handle ? handle.replace(/-/g, ' ').toUpperCase() : 'COLLECTION';

  useEffect(() => {
    async function loadProducts() {
      if (!handle) return;
      try {
        const fetchedProducts = await fetchCollectionProducts(handle, 20);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erreur chargement collection:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [handle]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucun produit dans cette collection.</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {products.map(product => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60, // Espace pour la barre de statut (encoche iOS)
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24, // Espace vertical entre les lignes
  },
  gridItem: {
    width: '48%', // Pour avoir 2 colonnes
  }
});
