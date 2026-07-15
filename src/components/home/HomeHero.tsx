import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/useCartStore';

interface HomeHeroProps {
  children: React.ReactNode;
}

const { height } = Dimensions.get('window');

export function HomeHero({ children }: HomeHeroProps) {
  const router = useRouter();
  const itemCount = useCartStore(state => state.getItemCount());

  return (
    <ImageBackground 
      // Image demandée
      source={require('@/assets/images/ChatGPT Image 25 juin 2026, 16_33_10.png')} 
      style={styles.heroBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* Header Transparent Par-dessus */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color="#000" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push('/(tabs)/search')}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </Pressable>
        </View>

        <Image 
          source={require('@/assets/images/KEA_NOIR_SANS_FOND-_3.png')} 
          style={styles.logo}
          contentFit="contain"
          tintColor="#ffffff" // Logo en blanc
        />

        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/(tabs)/cart')}>
            <Ionicons name="cart-outline" size={26} color="#000" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Zone des Stories */}
      <View style={styles.storiesContainer}>
        {children}
      </View>

      {/* Bas du Hero : Produit mis en avant */}
      <View style={styles.bottomSection}>
        <Text style={styles.productName}>Ma chantilly Pastèque</Text>
        <Pressable 
          style={styles.ctaButton} 
          onPress={() => router.push({ 
            pathname: '/product/[id]', 
            params: { id: encodeURIComponent('gid://shopify/Product/12001651523848') } 
          })}
        >
          <Text style={styles.ctaText}>JE DÉCOUVRE</Text>
        </Pressable>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  heroBackground: {
    width: '100%',
    height: height * 0.65, // Réduit à 65% pour être moins imposant
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#1a1a1a',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  storiesContainer: {
    flex: 1, // Prend tout l'espace disponible au milieu
    justifyContent: 'center', // Centre les stories verticalement
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40, // De la place avant la suite de la page
    alignItems: 'flex-end', // Le bouton est à droite sur la maquette
  },
  productName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'right',
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30, // Forme très arrondie type "pilule"
  },
  ctaText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
