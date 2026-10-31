import { api } from '@/lib/api';
import { Product } from '@/types';

export type ProductInput = Partial<Omit<Product, '_id'>>;

export const productService = {
  list: (search = '', category = '') =>
    api.get<Product[]>(`/products?search=${encodeURIComponent(search)}&category=${category}`),
  listAll: () => api.get<Product[]>('/products/admin/all'),
  create: (data: ProductInput) => api.post<Product>('/products', data),
  update: (id: string, data: ProductInput) => api.put<Product>(`/products/${id}`, data),
};
