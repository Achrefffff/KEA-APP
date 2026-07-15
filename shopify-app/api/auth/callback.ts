import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { code, shop } = request.query;

  if (!code || !shop) {
    return response.status(400).send('<h1>Erreur : Code ou boutique manquant.</h1>');
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return response.status(500).send('<h1>Erreur : Client ID ou Client Secret manquant sur le serveur.</h1>');
  }

  try {
    // Échanger le code temporaire contre le token permanent shpat_...
    const exchangeUrl = `https://${shop}/admin/oauth/access_token`;
    const exchangeResponse = await fetch(exchangeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    if (!exchangeResponse.ok) {
      throw new Error(`Failed to exchange token: ${exchangeResponse.statusText}`);
    }

    const data = await exchangeResponse.json();
    const accessToken = data.access_token; // C'est le jeton shpat_... !

    // Afficher le jeton en gros sur l'écran de l'utilisateur
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    return response.status(200).send(`
      <div style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 30px; border: 1px solid #e1e3e5; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #2c6ecb;">🎉 Connexion réussie avec Shopify !</h2>
        <p>Voici votre jeton d'accès administrateur permanent (Admin Access Token) :</p>
        <div style="background-color: #f6f6f7; padding: 15px; border-radius: 4px; border: 1px solid #e1e3e5; font-family: monospace; font-size: 16px; font-weight: bold; word-break: break-all; user-select: all; margin: 20px 0;">
          ${accessToken}
        </div>
        <p style="color: #6d7175; font-size: 13px;">👉 Copiez ce jeton (commençant par <strong>shpat_</strong>) et collez-le dans la variable d'environnement <strong>SHOPIFY_ADMIN_ACCESS_TOKEN</strong> sur votre projet Vercel.</p>
      </div>
    `);
  } catch (error) {
    console.error('Erreur échange jeton OAuth:', error);
    return response.status(500).send(`<h1>Erreur lors de la récupération du jeton : ${error instanceof Error ? error.message : String(error)}</h1>`);
  }
}
