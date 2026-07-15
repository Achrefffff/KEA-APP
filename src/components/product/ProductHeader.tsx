import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ProductHeaderProps {
  title: string;
  subtitle: string;
  price: string;
  compareAtPrice?: string | null;
  rating: number;
  reviewCount: number;
}

export function ProductHeader({ title, subtitle, price, compareAtPrice, rating, reviewCount }: ProductHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}€</Text>
      </View>
      
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      <View style={styles.ratingRow}>
        <View style={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Ionicons 
              key={i} 
              name={i < Math.floor(rating) ? 'star' : 'star-outline'} 
              size={14} 
              color="#FFD700" 
            />
          ))}
        </View>
        <Text style={styles.ratingText}>{rating} ({reviewCount} avis)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});
