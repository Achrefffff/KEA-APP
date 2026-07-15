import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProduct } from '@/services/shopify/types';

interface FavoritesState {
  favorites: AppProduct[];
  addFavorite: (product: AppProduct) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: AppProduct) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (product) => {
        set((state) => {
          if (state.favorites.some((p) => p.id === product.id)) {
            return state;
          }
          return { favorites: [...state.favorites, product] };
        });
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));
      },

      toggleFavorite: (product) => {
        const state = get();
        if (state.favorites.some((p) => p.id === product.id)) {
          state.removeFavorite(product.id);
        } else {
          state.addFavorite(product);
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },
    }),
    {
      name: 'favorites-storage', // Nom de la clé dans l'AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
