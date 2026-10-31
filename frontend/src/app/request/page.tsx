'use client';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import RequireAuth from '@/components/layout/RequireAuth';
import SafetyNotice from '@/components/layout/SafetyNotice';
import PageShell from '@/components/ui/PageShell';
import { TextArea, TextInput } from '@/components/ui/Field';
import { EmptyState, ErrorNote } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { money } from '@/lib/format';
import { orderService } from '@/services/order.service';

function RequestForm() {
  const { items, total, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ deliveryAddress: '', contactPhone: user?.phone ?? '', notes: '' });
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const order = await orderService.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        fulfillment,
        ...form,
      });
      clear();
      router.push(`/orders/${order._id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (!items.length) {
    return <EmptyState title="Your request is empty"><Link href="/products" className="btn-primary">Browse supplies</Link></EmptyState>;
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="panel">
        <h2 className="text-xl font-semibold">Your items</h2>
        <ul className="mt-3 divide-y divide-night-100/70">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3 py-3">
              <span className="text-3xl" aria-hidden>{i.emoji}</span>
              <div className="flex-1">
                <p className="font-medium leading-snug">{i.name}</p>
                <p className="text-sm text-slate-500">{money(i.price)} each</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl ring-1 ring-night-100">
                <button type="button" className="p-2" aria-label="Fewer" onClick={() => setQuantity(i.productId, i.quantity - 1)}><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{i.quantity}</span>
                <button type="button" className="p-2" aria-label="More" onClick={() => setQuantity(i.productId, i.quantity + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <button type="button" className="p-2 text-slate-400 hover:text-danger" aria-label={`Remove ${i.name}`} onClick={() => remove(i.productId)}><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-night-100 pt-3 font-semibold text-night"><span>Total</span><span>{money(total)}</span></p>
      </section>

      <section className="panel space-y-4">
        <h2 className="text-xl font-semibold">Where should we bring it?</h2>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="How do you want to receive it">
          {(['delivery', 'pickup'] as const).map((f) => (
            <button key={f} type="button" role="radio" aria-checked={fulfillment === f} onClick={() => setFulfillment(f)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition ${fulfillment === f ? 'bg-night text-white ring-night' : 'bg-white text-night ring-night-100'}`}>
              {f === 'delivery' ? 'Deliver to me' : 'I will pick up'}
            </button>
          ))}
        </div>
        <TextArea label={fulfillment === 'delivery' ? 'Delivery address' : 'Your name and area'} required minLength={10}
          placeholder="Flat, street, landmark, city" value={form.deliveryAddress} onChange={set('deliveryAddress')} />
        <TextInput label="Phone number" type="tel" required minLength={7} value={form.contactPhone} onChange={set('contactPhone')} />
        <TextArea label="Note for us (optional)" maxLength={300} placeholder="Gate code, allergies on the label you need, anything useful" value={form.notes} onChange={set('notes')} />
        {error && <ErrorNote message={error} />}
        <button className="btn-lamp w-full !py-3" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
        <p className="text-xs text-slate-500">We confirm stock first. Your request is not guaranteed until you see Confirmed.</p>
      </section>
    </form>
  );
}

export default function RequestPage() {
  return (
    <PageShell title="Review your request">
      <RequireAuth><RequestForm /></RequireAuth>
      <div className="mt-8"><SafetyNotice /></div>
    </PageShell>
  );
}
