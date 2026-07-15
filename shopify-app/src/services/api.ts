export interface ShopifyProduct {
  id: string;
  title: string;
  image?: string;
  handle: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  target: 'all' | 'android' | 'ios';
  redirectType: 'home' | 'product' | 'collection';
  redirectId?: string; // ID du produit ou de la collection
  imageUrl?: string;
  scheduledAt?: string; // Date ISO si planifié
}

// Fonction utilitaire pour fetcher les API Vercel
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Service pour communiquer avec nos fonctions Serverless
export const apiService = {
  // Récupérer les produits pour la sélection dans le formulaire
  getProducts: () => fetchApi<ShopifyProduct[]>('/api/products'),

  // Envoyer ou planifier une notification push
  sendNotification: (payload: NotificationPayload) => 
    fetchApi<{ success: boolean; message: string }>('/api/send-notification', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
