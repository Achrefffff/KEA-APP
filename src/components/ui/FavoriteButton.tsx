import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { AppProduct } from '@/services/shopify/types';

interface FavoriteButtonProps {
  product: AppProduct;
  size?: number;
  color?: string;
  activeColor?: string;
}

export function FavoriteButton({ 
  product, 
  size = 24, 
  color = '#999', 
  activeColor = '#e53935' 
}: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const handlePress = () => {
    toggleFavorite(product);
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      hitSlop={15} // Zone de clic élargie
    >
      <Ionicons 
        name={isFavorite ? 'heart' : 'heart-outline'} 
        size={size} 
        color={isFavorite ? activeColor : color} 
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond semi-transparent pour visibilité sur image
  },
});
