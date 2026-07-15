import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ShopifyCollection } from '../services/api';

export function useCollections() {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiService.getCollections()
      .then((data) => {
        if (isMounted) {
          setCollections(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur chargement collections');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { collections, loading, error };
}
