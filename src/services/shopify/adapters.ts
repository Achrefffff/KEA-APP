import { ShopifyProductNode, ShopifyCollectionNode, AppProduct, AppCategory } from './types';

// Convertit un produit Shopify en un format simple pour notre application
export function adaptProduct(node: ShopifyProductNode): AppProduct {
  // On récupère la première image (s'il y en a une)
  const rawImageUrl = node.images.edges.length > 0 
    ? node.images.edges[0].node.url 
    : 'https://via.placeholder.com/400';

  // Redimensionner l'image pour les vignettes (ProductCard) — réduit la RAM
  // Shopify CDN supporte le redimensionnement via paramètre URL
  const imageUrl = rawImageUrl.includes('cdn.shopify.com')
    ? (rawImageUrl.includes('?') ? `${rawImageUrl}&width=400` : `${rawImageUrl}?width=400`)
    : rawImageUrl;

  const images = node.images.edges.map(edge => edge.node.url);

  // Compare at price : Shopify renvoie parfois 0.0, il faut gérer ça.
  const compareAtPriceAmount = node.compareAtPriceRange?.minVariantPrice?.amount;
  const priceAmount = node.priceRange.minVariantPrice.amount;

  const hasDiscount = compareAtPriceAmount && parseFloat(compareAtPriceAmount) > parseFloat(priceAmount);

  // Extraction des metafields
  const metafields = node.metafields || [];
  const surtitre = metafields.find(m => m?.key === 'surtitre')?.value;
  const subtitle = metafields.find(m => m?.key === 'productsubtitle')?.value;
  const noteYuka = metafields.find(m => m?.key === 'note_yuka')?.value;

  // Extraction de la première variante
  const variantId = (node.variants?.edges && node.variants.edges.length > 0)
    ? node.variants.edges[0].node.id
    : '';

  return {
    id: node.id, // ID unique Shopify (ex: gid://shopify/Product/1234)
    variantId: variantId,
    surtitre: surtitre,
    title: node.title,
    subtitle: subtitle || node.title.split(' ')[0], // Fallback
    price: parseFloat(priceAmount).toFixed(2),
    compareAtPrice: hasDiscount ? parseFloat(compareAtPriceAmount).toFixed(2) : null,
    image: imageUrl,
    images: images,
    isBestSeller: false, // À déterminer plus tard via des Tags Shopify
    noteYuka: noteYuka,
  };
}

// Convertit une collection Shopify en un format simple pour notre application
export function adaptCollection(node: ShopifyCollectionNode): AppCategory {
  return {
    id: node.id,
    name: node.title,
    handle: node.handle,
    image: node.image?.url || 'https://via.placeholder.com/200',
  };
}
