import { api } from '@/lib/api';
import { Order, OrderStatus } from '@/types';

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  contactPhone: string;
  fulfillment: 'delivery' | 'pickup';
  notes?: string;
}

export const orderService = {
  create: (data: CreateOrderInput) => api.post<Order>('/orders', data),
  mine: () => api.get<Order[]>('/orders/mine'),
  get: (id: string) => api.get<Order>(`/orders/${id}`),
  cancel: (id: string) => api.patch<Order>(`/orders/${id}/cancel`),
  all: (status = '') => api.get<Order[]>(`/orders?status=${status}`),
  setStatus: (id: string, status: OrderStatus) => api.patch<Order>(`/orders/${id}/status`, { status }),
};
