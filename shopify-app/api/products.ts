import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Gérer le CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopifyDomain || !adminToken) {
    return response.status(500).json({
      message: 'Configuration Shopify manquante sur le serveur (Store Domain / Token Admin)',
    });
  }

  try {
    // Appeler l'API REST Shopify Admin
    const url = `https://${shopifyDomain}/admin/api/2026-07/products.json?fields=id,title,handle,images&limit=250`;
    
    const shopifyResponse = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
    });

    if (!shopifyResponse.ok) {
      throw new Error(`Shopify API responded with status ${shopifyResponse.status}`);
    }

    const data = await shopifyResponse.json();

    // Formater les données pour le frontend
    const products = data.products.map((p: any) => ({
      id: String(p.id),
      title: p.title,
      handle: p.handle,
      image: p.images && p.images.length > 0 ? p.images[0].src : undefined,
    }));

    return response.status(200).json(products);
  } catch (error) {
    console.error('Erreur API Products:', error);
    return response.status(500).json({
      message: 'Impossible de récupérer les produits Shopify.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
