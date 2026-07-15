"use client";
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '@/constants/theme';

import { PromoBanner } from '@/components/home/PromoBanner';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeStories } from '@/components/home/HomeStories';
import { BestSellers } from '@/components/home/BestSellers';
import { PromoCurlyJelly } from '@/components/home/PromoCurlyJelly';

import { fetchCollectionProducts, fetchCollections } from '@/services/shopify';
import { AppProduct, AppCategory } from '@/services/shopify/types';

export default function Home() {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [chantillyProducts, setChantillyProducts] = useState<AppProduct[]>([]);
  const [kidsProducts, setKidsProducts] = useState<AppProduct[]>([]);
  const [shampoingProducts, setShampoingProducts] = useState<AppProduct[]>([]);
  const [serumProducts, setSerumProducts] = useState<AppProduct[]>([]);
  const [nosCurlyProducts, setNosCurlyProducts] = useState<AppProduct[]>([]);
  const [collections, setCollections] = useState<AppCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShopifyData() {
      try {
        const [fetchedProducts, fetchedChantilly, fetchedKids, fetchedShampoings, fetchedSerums, fetchedNosCurly, fetchedCollections] = await Promise.all([
          fetchCollectionProducts('curly', 10),
          fetchCollectionProducts('chantilly', 10),
          fetchCollectionProducts('kids-routines-capillaires', 10), // Changé pour "Kea Kids - Les Routines Capillaires"
          fetchCollectionProducts('shampoings-1', 10),
          fetchCollectionProducts('nos-serums', 10),
          fetchCollectionProducts('nos-curly', 10),
          fetchCollections(100) // Augmenté pour être sûr de toutes les avoir (incluant kids)
        ]);
        
        // Correspondance exacte, ordre des stories et images locales
        const targetStories = [
          { keyword: 'chantilly', shortName: 'Chantilly', localImage: require('@/assets/images/menustory/keapasteque.png') },
          { keyword: 'curly', shortName: 'Curly', localImage: require('@/assets/images/menustory/CURLYFORNIALOVE_formart.png') },
          { keyword: 'kids', shortName: 'Kids', localImage: require('@/assets/images/menustory/sauvageriyutiue (1).png') },
          { keyword: 'shampoing', shortName: 'Shampoings', localImage: require('@/assets/images/menustory/creme_de_soie_ac915cf6-edf3-4bff-bf7e-de061cf1e2e9.png') },
          { keyword: 'serum', shortName: 'Sérums', localImage: require('@/assets/images/menustory/elixirformarcorrect (1).png') },
          { keyword: 'routine', shortName: 'Routines', localImage: require('@/assets/images/menustory/ROUTINECURLY1.png') }
        ];

        const finalStories: typeof fetchedCollections = [];
        
        targetStories.forEach(target => {
          // On cherche d'abord une correspondance EXACTE avec le handle pour éviter les confusions (ex: "kids" vs "kids-shampoings")
          let found = fetchedCollections.find(c => c.handle.toLowerCase() === target.keyword);
          
          // Si pas trouvé, on cherche si ça contient le mot-clé
          if (!found) {
            found = fetchedCollections.find(c => 
              c.handle.toLowerCase().includes(target.keyword) || 
              c.name.toLowerCase().includes(target.keyword)
            );
          }
          
          if (found) {
            finalStories.push({
              ...found,
              name: target.shortName, // Nom court
              image: target.localImage // Remplace l'image Shopify par l'image locale
            });
          }
        });

        setProducts(fetchedProducts);
        setChantillyProducts(fetchedChantilly);
        setKidsProducts(fetchedKids);
        setShampoingProducts(fetchedShampoings);
        setSerumProducts(fetchedSerums);
        setNosCurlyProducts(fetchedNosCurly);
        setCollections(finalStories);
      } catch (error) {
        console.error("Failed to load Shopify data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadShopifyData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Chargement de la boutique...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Bandeau d'annonce en haut */}
        <PromoBanner />

        {/* Hero Section avec la photo en plein écran et le header transparent */}
        <HomeHero>
          <HomeStories categories={collections} />
        </HomeHero>

        {/* Liste des produits réels de la collection curly */}
        <BestSellers title="Routine Bouclés" products={products} collectionHandle="curly" />
        
        {/* Liste des produits réels de la collection chantilly */}
        <BestSellers title="Nos Chantilly" products={chantillyProducts} collectionHandle="chantilly" />

        {/* Liste des produits réels de la collection kids */}
        <BestSellers 
          titleImage={require('@/assets/images/logo-kids-cropped.png')} 
          products={kidsProducts} 
          collectionHandle="kids-routines-capillaires"
        />

        {/* Liste des produits réels de la collection shampoings */}
        <BestSellers title="Shampoing KEA sans sulfates" products={shampoingProducts} collectionHandle="shampoings-1" />

        {/* Liste des produits réels de la collection serums */}
        <BestSellers title="Sérums KEA" products={serumProducts} collectionHandle="nos-serums" />

        {/* Bannière promo Curly Jelly Pop */}
        <PromoCurlyJelly />

        {/* Liste des produits réels de la collection nos-curly */}
        <BestSellers title="Nos Curly" products={nosCurlyProducts} collectionHandle="nos-curly" />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  }
});
