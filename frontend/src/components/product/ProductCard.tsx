'use client';
import { Check, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { items, add } = useCart();
  const { user } = useAuth();
  const inCart = items.find((i) => i.productId === product._id)?.quantity ?? 0;
  const out = product.stockQuantity === 0;
  const low = !out && product.stockQuantity <= 10;

  return (
    <article className="panel flex flex-col">
      <div className="grid h-32 place-items-center rounded-xl bg-lamp-soft text-6xl" aria-hidden>{product.imageEmoji}</div>
      <div className="mt-4 flex-1">
        <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        {product.ageSuitability && <p className="mt-2 text-xs font-medium text-night-600">For: {product.ageSuitability}</p>}
        {product.warnings && <p className="mt-1 text-xs text-slate-500">{product.warnings}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-display text-xl font-bold text-night">{money(product.price)}</p>
          <p className={`text-xs font-medium ${out ? 'text-danger' : low ? 'text-lamp-deep' : 'text-ok'}`}>
            {out ? 'Out of stock' : low ? `Only ${product.stockQuantity} left` : 'In stock'}
          </p>
        </div>
        {user?.role !== 'admin' && (
          <button className="btn-primary" disabled={out} onClick={() => add(product)}>
            {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {inCart ? `Added (${inCart})` : 'Add'}
          </button>
        )}
      </div>
    </article>
  );
}