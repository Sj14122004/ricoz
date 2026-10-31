'use client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import PageShell from '@/components/ui/PageShell';
import { EmptyState, ErrorNote, Spinner } from '@/components/ui/States';
import SafetyNotice from '@/components/layout/SafetyNotice';
import { useCart } from '@/context/CartContext';
import { useAsync } from '@/hooks/useAsync';
import { CATEGORIES } from '@/lib/constants';
import { productService } from '@/services/product.service';
import { useAuth } from '@/context/AuthContext';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const { count } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, loading, error } = useAsync(() => productService.list(query, category), [query, category]);

  return (
    <PageShell title="Supplies" subtitle="Everything here is kept in stock for night-time requests.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input !pl-9" placeholder="Search supplies" aria-label="Search supplies" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)} aria-pressed={category === c.value}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${category === c.value ? 'bg-night text-white' : 'bg-white text-night ring-1 ring-night-100 hover:bg-night-100'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {loading ? <Spinner /> : error ? <ErrorNote message={error} /> : !data?.length ? (
          <EmptyState title="Nothing matches that search">Try a different word or choose All.</EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      {count > 0 && user?.role !== 'admin' && (
        <div className="sticky bottom-4 mt-8 flex justify-center">
          <Link href="/request" className="btn-lamp !px-6 !py-3 shadow-lift">Review request ({count})</Link>
        </div>
      )}
      <div className="mt-10"><SafetyNotice /></div>
    </PageShell>
  );
}
