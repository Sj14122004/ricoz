import { OrderStatus } from '@/types';

export const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'formula', label: 'Formula' },
  { value: 'diapers', label: 'Diapers' },
  { value: 'wipes', label: 'Wipes' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'colic', label: 'Colic' },
];

export const TRACK_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Request sent' },
  { status: 'CONFIRMED', label: 'Stock confirmed' },
  { status: 'PREPARING', label: 'Packing' },
  { status: 'DISPATCHED', label: 'On the way' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Waiting for confirmation',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Packing',
  DISPATCHED: 'On the way',
  DELIVERED: 'Delivered',
  REJECTED: 'Not available',
  CANCELLED: 'Cancelled',
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-lamp-soft text-lamp-deep',
  CONFIRMED: 'bg-night-100 text-night-600',
  PREPARING: 'bg-night-100 text-night-600',
  DISPATCHED: 'bg-night-100 text-night-600',
  DELIVERED: 'bg-ok/15 text-ok',
  REJECTED: 'bg-danger/10 text-danger',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

// What an admin can do next from each status.
export const ADMIN_NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string; tone: 'primary' | 'danger' | 'ghost' }[]>> = {
  PENDING: [
    { to: 'CONFIRMED', label: 'Confirm stock', tone: 'primary' },
    { to: 'REJECTED', label: 'Reject', tone: 'danger' },
  ],
  CONFIRMED: [
    { to: 'PREPARING', label: 'Start packing', tone: 'primary' },
    { to: 'CANCELLED', label: 'Cancel & restock', tone: 'danger' },
  ],
  PREPARING: [{ to: 'DISPATCHED', label: 'Dispatch', tone: 'primary' }],
  DISPATCHED: [{ to: 'DELIVERED', label: 'Mark delivered', tone: 'primary' }],
};

export const EMERGENCY_NUMBER = '112';
