const domain = process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, any>;
}

export async function shopifyFetch<T>({ query, variables = {} }: ShopifyFetchParams): Promise<{ data: T; errors?: any[] }> {
  if (!domain || !storefrontAccessToken) {
    throw new Error('Shopify API credentials are not configured in .env');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await response.json();

    if (body.errors) {
      console.error('Shopify API Errors:', body.errors);
      return { data: body.data, errors: body.errors };
    }

    return { data: body.data };
  } catch (error) {
    console.error('Network error while fetching from Shopify:', error);
    throw error;
  }
}
