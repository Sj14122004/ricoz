'use client';
import { useState } from 'react';
import OrdersPanel from '@/components/admin/OrdersPanel';
import ProductsPanel from '@/components/admin/ProductsPanel';
import RequireAuth from '@/components/layout/RequireAuth';
import PageShell from '@/components/ui/PageShell';

const TABS = [
  { id: 'orders', label: 'Requests' },
  { id: 'inventory', label: 'Inventory' },
] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('orders');
  return (
    <PageShell title="Admin" subtitle="Confirm stock, pack and dispatch requests, and keep inventory current.">
      <RequireAuth role="admin">
        <div className="mb-6 flex gap-2" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold ${tab === t.id ? 'bg-night text-white' : 'bg-white ring-1 ring-night-100'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'orders' ? <OrdersPanel /> : <ProductsPanel />}
      </RequireAuth>
    </PageShell>
  );
}
