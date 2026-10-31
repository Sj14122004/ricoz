'use client';
import { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { EmptyState, ErrorNote, Spinner } from '@/components/ui/States';
import { useAsync } from '@/hooks/useAsync';
import { ADMIN_NEXT, STATUS_LABEL } from '@/lib/constants';
import { dateTime, shortId } from '@/lib/format';
import { orderService } from '@/services/order.service';
import { OrderStatus } from '@/types';
import OrderSummary from '@/components/order/OrderSummary';

const FILTERS: ('' | OrderStatus)[] = ['', 'PENDING', 'CONFIRMED', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'REJECTED', 'CANCELLED'];

export default function OrdersPanel() {
  const [filter, setFilter] = useState<'' | OrderStatus>('PENDING');
  const [actionError, setActionError] = useState('');
  const { data, loading, error, reload } = useAsync(() => orderService.all(filter), [filter]);

  async function move(id: string, status: OrderStatus) {
    setActionError('');
    try { await orderService.setStatus(id, status); reload(); } catch (e) { setActionError((e as Error).message); }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f || 'all'} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === f ? 'bg-night text-white' : 'bg-white ring-1 ring-night-100'}`}>
            {f ? STATUS_LABEL[f] : 'All'}
          </button>
        ))}
      </div>
      {actionError && <div className="mb-4"><ErrorNote message={actionError} /></div>}
      {loading ? <Spinner /> : error ? <ErrorNote message={error} /> : !data?.length ? (
        <EmptyState title="No requests in this list" />
      ) : (
        <ul className="space-y-4">
          {data.map((o) => {
            const customer = typeof o.user === 'string' ? null : o.user;
            return (
              <li key={o._id} className="panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold text-night">#{shortId(o._id)} · {customer?.name}</p>
                    <p className="text-sm text-slate-500">{dateTime(o.createdAt)} · {o.fulfillment} · {o.contactPhone}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{o.deliveryAddress}</p>
                {o.notes && <p className="mt-1 text-sm italic text-slate-500">“{o.notes}”</p>}
                <div className="mt-3"><OrderSummary items={o.items} total={o.totalAmount} /></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ADMIN_NEXT[o.status]?.map((a) => (
                    <button key={a.to} className={a.tone === 'danger' ? 'btn-danger' : 'btn-primary'} onClick={() => move(o._id, a.to)}>{a.label}</button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
