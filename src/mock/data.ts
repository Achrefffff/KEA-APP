// Mock data avec des images placeholder qui fonctionnent
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: "Mon Philtre d'Amour",
    subtitle: 'Soin capillaire nourrissant',
    price: '49.00',
    compareAtPrice: '69.00',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    title: "L'Enfant Sauvage",
    subtitle: 'Huile capillaire protectrice',
    price: '39.00',
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    title: "Chantilly Karité & Coco",
    subtitle: 'Crème hydratante corps',
    price: '25.00',
    compareAtPrice: '30.00',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 64,
  },
  {
    id: '4',
    title: "Sérum Pousse Extrême",
    subtitle: 'Booster de croissance capillaire',
    price: '35.00',
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee38f1?w=400&h=400&fit=crop',
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 203,
  },
];

export const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Cheveux', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&h=200&fit=crop' },
  { id: 'c2', name: 'Corps', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop' },
  { id: 'c3', name: 'Visage', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=200&h=200&fit=crop' },
  { id: 'c4', name: 'Coffrets', image: 'https://images.unsplash.com/photo-1615397323136-1e072b2260ea?w=200&h=200&fit=crop' },
];
