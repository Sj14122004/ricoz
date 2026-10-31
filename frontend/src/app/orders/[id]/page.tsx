'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import RequireAuth from '@/components/layout/RequireAuth';
import OrderSummary from '@/components/order/OrderSummary';
import OrderTracker from '@/components/order/OrderTracker';
import PageShell from '@/components/ui/PageShell';
import StatusBadge from '@/components/ui/StatusBadge';
import { ErrorNote, Spinner } from '@/components/ui/States';
import { useAsync } from '@/hooks/useAsync';
import { STATUS_LABEL } from '@/lib/constants';
import { dateTime, shortId } from '@/lib/format';
import { orderService } from '@/services/order.service';

function Tracking({ id }: { id: string }) {
  const { data: order, loading, error, setData } = useAsync(() => orderService.get(id), [id]);
  const [actionError, setActionError] = useState('');

  if (loading) return <Spinner />;
  if (error || !order) return <ErrorNote message={error || 'Request not found'} />;

  async function cancel() {
    if (!confirm('Cancel this request?')) return;
    try { setData(await orderService.cancel(id)); } catch (e) { setActionError((e as Error).message); }
  }

  return (
    <div className="space-y-6">
      <section className="panel">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-xl font-bold text-night">Request #{shortId(order._id)}</p>
          <StatusBadge status={order.status} />
        </div>
        <OrderTracker status={order.status} />
        {order.status === 'PENDING' && (
          <p className="mt-6 text-sm text-slate-600">We are checking stock. You will see this change to Confirmed once the items are set aside for you.</p>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="panel">
          <h2 className="mb-3 text-lg font-semibold">Items</h2>
          <OrderSummary items={order.items} total={order.totalAmount} />
        </section>
        <section className="panel space-y-4 text-sm">
          <div>
            <h2 className="text-lg font-semibold">{order.fulfillment === 'delivery' ? 'Delivering to' : 'Pickup for'}</h2>
            <p className="mt-1 whitespace-pre-line text-slate-700">{order.deliveryAddress}</p>
            <p className="text-slate-500">Phone {order.contactPhone}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">History</h2>
            <ul className="mt-1 space-y-1 text-slate-600">
              {[...order.statusHistory].reverse().map((h, i) => (
                <li key={i}>{dateTime(h.at)} · {STATUS_LABEL[h.status]}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {actionError && <ErrorNote message={actionError} />}
      {order.status === 'PENDING' && <button className="btn-danger" onClick={cancel}>Cancel request</button>}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <PageShell title="Track your request">
      <RequireAuth><Tracking id={id} /></RequireAuth>
    </PageShell>
  );
}
