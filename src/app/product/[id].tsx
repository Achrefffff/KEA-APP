import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { IconButton } from '@/components/ui/IconButton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductAccordion } from '@/components/product/ProductAccordion';
import { ProductActions } from '@/components/product/ProductActions';
import { fetchProduct } from '@/services/shopify';
import { AppProduct } from '@/services/shopify/types';
import { useCartStore } from '@/store/useCartStore';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<AppProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        // L'ID peut avoir été encodé (ex: %3A au lieu de :)
        const decodedId = decodeURIComponent(id);
        const fetchedProduct = await fetchProduct(decodedId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Erreur chargement produit:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleAddToCart = (quantity: number) => {
    if (product) {
      addItem(product, quantity);
      router.push('/(tabs)/cart');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Produit introuvable.</Text>
        <IconButton icon="arrow-back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* En-tête avec bouton de retour flottant */}
        <View style={styles.galleryContainer}>
          <ProductGallery images={product.images?.length > 0 ? product.images : [product.image]} />
          
          <SafeAreaView edges={['top']} style={styles.floatingHeader}>
            <IconButton 
              icon="arrow-back" 
              backgroundColor="rgba(255,255,255,0.8)" 
              onPress={() => router.back()} 
            />
            <IconButton 
              icon="heart-outline" 
              backgroundColor="rgba(255,255,255,0.8)" 
              onPress={() => {}} 
            />
          </SafeAreaView>
        </View>

        <ProductHeader 
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          rating={4.8} // Faux avis pour l'instant
          reviewCount={127}
        />

        <ProductAccordion 
          description="Découvrez notre soin phare aux ingrédients naturels. Idéal pour revitaliser et redonner de l'éclat."
          usage="Appliquer une noisette sur cheveux humides ou secs. Ne pas rincer."
          ingredients="Aqua, Aloe Barbadensis, Huile d'Argan, Parfum naturel."
        />

      </ScrollView>

      {/* Bouton d'action toujours visible en bas */}
      <ProductActions price={product.price} onAddToCart={handleAddToCart} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  galleryContainer: {
    position: 'relative',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
