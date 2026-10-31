import { STATUS_LABEL, STATUS_STYLE } from '@/lib/constants';
import { OrderStatus } from '@/types';

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
