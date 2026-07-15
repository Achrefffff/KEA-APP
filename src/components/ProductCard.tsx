"use client";
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Colors, Spacing } from '@/constants/theme';
import { useCartStore } from '@/store/useCartStore';
import { AppProduct } from '@/services/shopify/types';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface ProductCardProps {
  product: AppProduct & {
    rating?: number;
    reviewCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const router = useRouter();
  
  // Utilisation du store global Zustand
  const addItem = useCartStore((state) => state.addItem);

  const discount = product.compareAtPrice
    ? Math.round(
        ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
          parseFloat(product.compareAtPrice)) *
          100,
      )
    : null;

  const handleAddToCart = () => {
    addItem(product);
    router.push('/(tabs)/cart');
  };

  return (
    <Link href={{ pathname: '/product/[id]', params: { id: encodeURIComponent(product.id) } }} asChild>
      <Pressable style={StyleSheet.flatten([styles.container, { backgroundColor: colors.backgroundElement }])}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Badges overlays */}
          <View style={styles.badgeRow}>
            {product.isBestSeller && (
              <View style={styles.bestSellerBadge}>
                <Text style={styles.bestSellerText}>⭐ Best-Seller</Text>
              </View>
            )}
            {discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
          </View>
          <View style={styles.favoriteContainer}>
            <FavoriteButton product={product} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View>
            {product.surtitre && (
              <Text style={styles.surtitre} numberOfLines={1}>
                {product.surtitre}
              </Text>
            )}

            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {product.title}
            </Text>

            {product.subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                {product.subtitle}
              </Text>
            )}

            {/* Rating */}
            {product.rating && (
              <View style={styles.ratingRow}>
                <Text style={styles.stars}>{'★'.repeat(Math.floor(product.rating))}</Text>
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {product.rating} ({product.reviewCount})
                </Text>
              </View>
            )}

            {/* Note Yuka */}
            {product.noteYuka && (
              <Text style={styles.yukaText} numberOfLines={1}>
                {product.noteYuka}
              </Text>
            )}
          </View>

          <View>
            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.text }]}>
                {product.price}€
              </Text>
              {product.compareAtPrice && (
                <Text style={styles.compareAtPrice}>
                  {product.compareAtPrice}€
                </Text>
              )}
            </View>

            {/* Add Button */}
            <Pressable style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>+ Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1, // Prend toute la hauteur du parent (qui s'aligne sur la carte la plus haute)
    margin: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#fff',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  bestSellerBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestSellerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    backgroundColor: '#e53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  surtitre: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E5A822',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  yukaText: {
    fontSize: 11,
    color: '#4caf50',
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    color: '#E5A822',
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  compareAtPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
