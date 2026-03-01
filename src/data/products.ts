export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: 'BESTSELLER' | 'SALE';
  emoji: string;
  description: string;
  rating: number;
  stars: number;
}

export const products: Product[] = [
  {
    id: 1, name: 'Grandmaster Rosewood Set', category: 'Chess Sets', price: 8499, originalPrice: 10999,
    badge: 'BESTSELLER', emoji: '♟', description: 'Tournament-grade Staunton pieces in Indian rosewood', rating: 4.9, stars: 5,
  },
  {
    id: 2, name: 'Walnut & Maple Board', category: 'Boards', price: 4299,
    emoji: '♜', description: 'Handcrafted 21-inch board, 55mm squares', rating: 4.8, stars: 5,
  },
  {
    id: 3, name: 'Classic Staunton Pieces', category: 'Pieces', price: 3199, originalPrice: 3999,
    badge: 'SALE', emoji: '♛', description: 'Weighted felted base, triple-koah wood', rating: 4.6, stars: 4,
  },
  {
    id: 4, name: 'DGT 3000 Chess Clock', category: 'Accessories', price: 2899,
    emoji: '⏱', description: 'Official FIDE tournament clock', rating: 5.0, stars: 5,
  },
  {
    id: 5, name: 'Fischer Random Set', category: 'Chess Sets', price: 6799,
    emoji: '♟', description: 'Chess960 ready, maple construction', rating: 4.7, stars: 4,
  },
  {
    id: 6, name: 'Leather Travel Board', category: 'Boards', price: 1899,
    emoji: '♜', description: 'Roll-up genuine leather, magnetic pieces included', rating: 4.5, stars: 4,
  },
  {
    id: 7, name: 'My System — Nimzowitsch', category: 'Books', price: 549,
    emoji: '📖', description: 'The timeless chess strategy classic', rating: 4.9, stars: 5,
  },
  {
    id: 8, name: 'Silicone Tournament Board', category: 'Boards', price: 1299, originalPrice: 1599,
    badge: 'SALE', emoji: '♜', description: 'FIDE approved, rollable, waterproof', rating: 4.6, stars: 4,
  },
  {
    id: 9, name: 'Chess Bag Deluxe', category: 'Accessories', price: 1199,
    emoji: '🎒', description: 'Fits full set + clock, padded interior', rating: 4.4, stars: 4,
  },
];

export const categories = [
  { name: 'Chess Sets', emoji: '♟', count: 42 },
  { name: 'Boards', emoji: '♜', count: 28 },
  { name: 'Pieces', emoji: '♛', count: 35 },
  { name: 'Accessories', emoji: '⏱', count: 67 },
];

export const filterOptions = ['All', 'Chess Sets', 'Boards', 'Pieces', 'Accessories', 'Books'];

export const reviews = [
  {
    id: 1,
    text: 'The rosewood set I ordered is absolutely stunning. The pieces have perfect weight and the board arrived immaculately packed.',
    author: 'Arjun Mehta',
    title: 'Club Player',
    city: 'Mumbai',
    rating: 5,
    initials: 'AM',
  },
  {
    id: 2,
    text: 'ChessCraft is my go-to for tournament gear. The DGT clock works flawlessly and their customer support is brilliant.',
    author: 'Priya Nair',
    title: 'FIDE Rated Player',
    city: 'Bangalore',
    rating: 5,
    initials: 'PN',
  },
  {
    id: 3,
    text: 'Got the leather travel board for my son. Beautiful quality, pieces are magnetic and stay in place. Highly recommend!',
    author: 'Ramesh Iyer',
    title: 'Parent',
    city: 'Chennai',
    rating: 5,
    initials: 'RI',
  },
];
