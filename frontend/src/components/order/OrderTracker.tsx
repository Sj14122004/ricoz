import { Check } from 'lucide-react';
import { TRACK_STEPS } from '@/lib/constants';
import { OrderStatus } from '@/types';

export default function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return (
      <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
        {status === 'REJECTED'
          ? 'We could not fulfil this request because the items are not available. You have not been charged.'
          : 'This request was cancelled.'}
      </p>
    );
  }
  const current = TRACK_STEPS.findIndex((s) => s.status === status);

  return (
    <ol className="grid grid-cols-5 gap-1">
      {TRACK_STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step.status} className="flex flex-col items-center text-center">
            <div className="relative flex w-full items-center justify-center">
              <span className={`absolute left-0 right-1/2 h-0.5 ${i === 0 ? 'hidden' : i <= current ? 'bg-night' : 'bg-night-100'}`} />
              <span className={`absolute left-1/2 right-0 h-0.5 ${i === TRACK_STEPS.length - 1 ? 'hidden' : i < current ? 'bg-night' : 'bg-night-100'}`} />
              <span className={`relative grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-night text-lamp' : 'bg-night-100 text-night-600'} ${i === current ? 'ring-4 ring-lamp/50' : ''}`}>
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
            </div>
            <span className={`mt-2 text-xs ${done ? 'font-semibold text-night' : 'text-slate-500'}`}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
