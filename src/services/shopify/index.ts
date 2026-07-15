import { shopifyFetch } from './client';
import { GET_PRODUCTS_QUERY, GET_COLLECTIONS_QUERY, GET_COLLECTION_PRODUCTS_QUERY, GET_PRODUCT_QUERY, SEARCH_PRODUCTS_QUERY, CART_CREATE_MUTATION } from './queries';
import { adaptProduct, adaptCollection } from './adapters';
import { AppProduct, AppCategory } from './types';

// Récupère les X derniers produits
export async function fetchProducts(first: number = 10): Promise<AppProduct[]> {
  try {
    const { data } = await shopifyFetch<any>({
      query: GET_PRODUCTS_QUERY,
      variables: { first },
    });

    const edges = data?.products?.edges || [];
    return edges.map((edge: any) => adaptProduct(edge.node));
  } catch (error) {
    console.error('Erreur fetchProducts:', error);
    return [];
  }
}

// Récupère les produits d'une collection spécifique via son handle
export async function fetchCollectionProducts(handle: string, first: number = 10): Promise<AppProduct[]> {
  try {
    const { data } = await shopifyFetch<any>({
      query: GET_COLLECTION_PRODUCTS_QUERY,
      variables: { handle, first },
    });

    const edges = data?.collection?.products?.edges || [];
    return edges.map((edge: any) => adaptProduct(edge.node));
  } catch (error) {
    console.error(`Erreur fetchCollectionProducts (${handle}):`, error);
    return [];
  }
}

// Récupère les X premières collections (pour les Stories en haut)
export async function fetchCollections(first: number = 10): Promise<AppCategory[]> {
  try {
    const { data } = await shopifyFetch<any>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
    });

    const edges = data?.collections?.edges || [];
    return edges.map((edge: any) => adaptCollection(edge.node));
  } catch (error) {
    console.error('Erreur fetchCollections:', error);
    return [];
  }
}

// Récupère un seul produit via son ID
export async function fetchProduct(id: string): Promise<AppProduct | null> {
  try {
    const { data } = await shopifyFetch<any>({
      query: GET_PRODUCT_QUERY,
      variables: { id },
    });

    if (data?.product) {
      return adaptProduct(data.product);
    }
    return null;
  } catch (error) {
    console.error(`Erreur fetchProduct (${id}):`, error);
    return null;
  }
}

// Recherche des produits par terme
export async function searchProducts(query: string, first: number = 20): Promise<AppProduct[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const { data } = await shopifyFetch<any>({
      query: SEARCH_PRODUCTS_QUERY,
      variables: { query, first },
    });

    const edges = data?.products?.edges || [];
    return edges.map((edge: any) => adaptProduct(edge.node));
  } catch (error) {
    console.error(`Erreur searchProducts (${query}):`, error);
    return [];
  }
}

// Fonction de paiement
export async function checkout(items: any[], token?: string | null): Promise<string | null> {
  if (items.length === 0) return null;

  try {
    const lines = items.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity
    }));

    const input: any = { lines };
    
    // Si l'utilisateur est connecté, on l'associe au panier pour pré-remplir ses infos
    if (token) {
      input.buyerIdentity = {
        customerAccessToken: token
      };
    }

    const { data } = await shopifyFetch<any>({
      query: CART_CREATE_MUTATION,
      variables: { input }
    });

    if (data?.cartCreate?.userErrors?.length > 0) {
      console.error('Erreur cartCreate:', data.cartCreate.userErrors);
      return null;
    }

    return data?.cartCreate?.cart?.checkoutUrl || null;
  } catch (error) {
    console.error('Erreur checkout:', error);
    return null;
  }
}
