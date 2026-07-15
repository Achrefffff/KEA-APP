import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ShopifyProduct } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiService.getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur chargement produits');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
