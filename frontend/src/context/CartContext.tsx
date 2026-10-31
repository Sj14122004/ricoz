'use client';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const KEY = 'epod-cart';
const MAX_PER_ITEM = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartValue>(() => ({
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    total: items.reduce((n, i) => n + i.quantity * i.price, 0),
    add: (p) => setItems((prev) => {
      const found = prev.find((i) => i.productId === p._id);
      const cap = Math.min(MAX_PER_ITEM, p.stockQuantity);
      if (found) return prev.map((i) => (i.productId === p._id ? { ...i, quantity: Math.min(cap, i.quantity + 1) } : i));
      return [...prev, { productId: p._id, name: p.name, price: p.price, emoji: p.imageEmoji, stock: p.stockQuantity, quantity: 1 }];
    }),
    setQuantity: (id, q) => setItems((prev) =>
      prev.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, Math.min(MAX_PER_ITEM, i.stock, q)) } : i))),
    remove: (id) => setItems((prev) => prev.filter((i) => i.productId !== id)),
    clear: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
