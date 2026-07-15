import { create } from 'zustand';
import { AppProduct } from '@/services/shopify/types';

export interface CartItem extends AppProduct {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: AppProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, qty = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          )
        };
      }
      
      return { items: [...state.items, { ...product, quantity: qty }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },

  updateQuantity: (productId, delta) => {
    set((state) => ({
      items: state.items.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    }));
  },

  clearCart: () => set({ items: [] }),

  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
