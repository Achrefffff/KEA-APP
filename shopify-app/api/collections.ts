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
    // 1. Récupérer les collections personnalisées (custom_collections)
    const customUrl = `https://${shopifyDomain}/admin/api/2026-07/custom_collections.json?fields=id,title,handle&limit=50`;
    const customResponse = await fetch(customUrl, {
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
    });

    // 2. Récupérer les collections automatiques (smart_collections)
    const smartUrl = `https://${shopifyDomain}/admin/api/2026-07/smart_collections.json?fields=id,title,handle&limit=50`;
    const smartResponse = await fetch(smartUrl, {
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
    });

    let collections: any[] = [];

    if (customResponse.ok) {
      const data = await customResponse.json();
      collections = [...collections, ...(data.custom_collections || [])];
    }

    if (smartResponse.ok) {
      const data = await smartResponse.json();
      collections = [...collections, ...(data.smart_collections || [])];
    }

    // Formater et dédoublonner
    const formattedCollections = collections.map((c: any) => ({
      id: String(c.id),
      title: c.title,
      handle: c.handle,
    }));

    return response.status(200).json(formattedCollections);
  } catch (error) {
    console.error('Erreur API Collections:', error);
    return response.status(500).json({
      message: 'Impossible de récupérer les collections Shopify.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
