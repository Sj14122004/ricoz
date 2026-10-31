export type Role = 'parent' | 'admin';
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';

export interface User { id: string; name: string; email: string; phone?: string; role: Role }

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageEmoji: string;
  ageSuitability: string;
  warnings: string;
  isActive: boolean;
}

export interface OrderItem { product: string; name: string; imageEmoji?: string; quantity: number; unitPrice: number }

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  status: OrderStatus;
  fulfillment: 'delivery' | 'pickup';
  deliveryAddress: string;
  contactPhone: string;
  notes: string;
  totalAmount: number;
  statusHistory: { status: OrderStatus; note?: string; at: string }[];
  createdAt: string;
}

export interface CartItem { productId: string; name: string; price: number; emoji: string; stock: number; quantity: number }
