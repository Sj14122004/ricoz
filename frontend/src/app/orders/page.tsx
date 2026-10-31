'use client';
import Link from 'next/link';
import RequireAuth from '@/components/layout/RequireAuth';
import PageShell from '@/components/ui/PageShell';
import StatusBadge from '@/components/ui/StatusBadge';
import { EmptyState, ErrorNote, Spinner } from '@/components/ui/States';
import { useAsync } from '@/hooks/useAsync';
import { dateTime, money, shortId } from '@/lib/format';
import { orderService } from '@/services/order.service';

function MyOrders() {
  const { data, loading, error } = useAsync(orderService.mine);
  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;
  if (!data?.length) return <EmptyState title="No requests yet"><Link href="/products" className="btn-primary">Get supplies</Link></EmptyState>;

  return (
    <ul className="space-y-3">
      {data.map((o) => (
        <li key={o._id}>
          <Link href={`/orders/${o._id}`} className="panel flex flex-wrap items-center justify-between gap-3 transition hover:ring-night-600">
            <div>
              <p className="font-semibold text-night">Request #{shortId(o._id)}</p>
              <p className="text-sm text-slate-500">{dateTime(o.createdAt)} · {o.items.reduce((n, i) => n + i.quantity, 0)} items · {money(o.totalAmount)}</p>
            </div>
            <StatusBadge status={o.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function OrdersPage() {
  return (
    <PageShell title="My requests">
      <RequireAuth><MyOrders /></RequireAuth>
    </PageShell>
  );
}
