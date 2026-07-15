import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useFavoritesStore } from '@/store/useFavoritesStore';

import { EmptyState } from '@/components/ui/EmptyState';
import { FavoriteHeader } from '@/components/favorites/FavoriteHeader';
import { FavoriteGrid } from '@/components/favorites/FavoriteGrid';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <FavoriteHeader count={favorites.length} />

      {favorites.length > 0 ? (
        <FavoriteGrid favorites={favorites} />
      ) : (
        <EmptyState 
          iconName="heart-outline"
          title="Vos favoris sont vides"
          description="Sauvegardez les articles que vous aimez pour les retrouver facilement plus tard."
          buttonLabel="Découvrir nos produits"
          onButtonPress={() => router.push('/')}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
