import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AppCustomer } from '@/services/shopify/types';
import { loginCustomer, registerCustomer, fetchCustomer, AuthResult } from '@/services/shopify/auth';

// ─────────────────────────────────────────────
// Constantes & Storage Helpers
// ─────────────────────────────────────────────

const TOKEN_KEY = 'kea_customer_token';

const setStoredToken = async (token: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('localStorage non disponible', e);
    }
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

const getStoredToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.warn('localStorage non disponible', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
};

const removeStoredToken = async () => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('localStorage non disponible', e);
    }
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// ─────────────────────────────────────────────
// Interface du store
// ─────────────────────────────────────────────

interface AuthState {
  token: string | null;
  customer: AppCustomer | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  customer: null,
  isLoggedIn: false,
  isLoading: false,

  /**
   * Connexion : appelle le service, stocke le token de manière sécurisée ou web storage.
   */
  login: async (email, password) => {
    set({ isLoading: true });

    const result = await loginCustomer(email, password);

    if (result.success && result.token) {
      await setStoredToken(result.token);
      set({
        token: result.token,
        customer: result.customer ?? null,
        isLoggedIn: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    return result;
  },

  /**
   * Inscription : crée le compte sans connexion automatique (nécessite validation email).
   */
  register: async (firstName, lastName, email, password) => {
    set({ isLoading: true });
    const result = await registerCustomer(firstName, lastName, email, password);
    set({ isLoading: false });
    return result;
  },

  /**
   * Déconnexion : supprime le token.
   */
  logout: async () => {
    await removeStoredToken();
    set({
      token: null,
      customer: null,
      isLoggedIn: false,
    });
  },

  /**
   * Hydrate : au lancement de l'app, vérifie si un token existe.
   * Si oui, récupère les infos du client.
   */
  hydrate: async () => {
    try {
      const storedToken = await getStoredToken();
      if (!storedToken) return;

      const customer = await fetchCustomer(storedToken);
      if (customer) {
        set({
          token: storedToken,
          customer,
          isLoggedIn: true,
        });
      } else {
        // Token expiré ou invalide → nettoyage
        await removeStoredToken();
      }
    } catch (error) {
      console.error('Erreur hydrate auth:', error);
    }
  },
}));
