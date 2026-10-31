import { money } from '@/lib/format';
import { OrderItem } from '@/types';

export default function OrderSummary({ items, total }: { items: OrderItem[]; total: number }) {
  return (
    <div>
      <ul className="divide-y divide-night-100/70">
        {items.map((i) => (
          <li key={i.product} className="flex items-center justify-between py-2 text-sm">
            <span>{i.imageEmoji} {i.name} <span className="text-slate-500">× {i.quantity}</span></span>
            <span className="font-medium">{money(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex justify-between border-t border-night-100 pt-3 font-semibold text-night">
        <span>Total</span><span>{money(total)}</span>
      </p>
    </div>
  );
}
