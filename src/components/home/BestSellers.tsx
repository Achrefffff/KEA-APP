import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { ProductCard } from '@/components/ProductCard';

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

interface BestSellersProps {
  products: any[];
  title?: string;
  titleImage?: any;
  collectionHandle?: string;
}

export function BestSellers({ products, title = "Nos Best-Sellers ✨", titleImage, collectionHandle }: BestSellersProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {titleImage ? (
          <Image source={titleImage} style={styles.titleImage} contentFit="contain" />
        ) : (
          <Text style={styles.sectionTitle}>
            {title}
          </Text>
        )}
        
        {collectionHandle ? (
          <Link href={{ pathname: '/collection/[handle]', params: { handle: collectionHandle } }} asChild>
            <Pressable>
              <Text style={styles.seeAll}>Tout voir</Text>
            </Pressable>
          </Link>
        ) : (
          <Text style={styles.seeAll}>Tout voir</Text>
        )}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {products.map((product) => (
          <View key={product.id} style={{ width: 180 }}>
            <ProductCard product={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 0, // Padding on section is 0 so the scroll view goes to the edges
    marginTop: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  titleImage: {
    height: 40,
    width: 120, // Ajustable selon l'image
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  scrollContainer: {
    paddingHorizontal: 16, // Adds padding inside the scroll view at the ends
    gap: 16, // Espacement entre les ProductCards (nécessite React Native >= 0.71)
  },
});
