// Types bruts retournés par Shopify GraphQL
export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: { node: ShopifyImage }[];
  };
  metafields: ({ key: string; value: string } | null)[];
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export interface ShopifyCollectionNode {
  id: string;
  title: string;
  handle: string;
  image: ShopifyImage | null;
}

// Types utilisés dans notre UI (propres, plats, faciles à utiliser)
export interface AppProduct {
  id: string;
  variantId: string;
  surtitre?: string;
  title: string;
  subtitle: string;
  price: string;
  compareAtPrice: string | null;
  image: string;
  images: string[];
  isBestSeller: boolean;
  noteYuka?: string;
}

export interface AppCategory {
  id: string;
  name: string;
  handle: string;
  image: any;
}

// Type pour le client connecté
export interface AppCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface AppAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  country: string;
  zip: string;
  phone: string | null;
  isDefault?: boolean;
}

export interface AppOrderLineItem {
  title: string;
  quantity: number;
  imageUrl: string | null;
}

export interface AppOrder {
  id: string;
  orderNumber: number;
  processedAt: string; // ISO string
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: Money;
  lineItems: AppOrderLineItem[];
}
