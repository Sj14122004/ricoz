import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function list({ search, category, includeInactive = false } = {}) {
  const filter = includeInactive ? {} : { isActive: true };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: escapeRegex(String(search)), $options: 'i' };
  return Product.find(filter).sort({ createdAt: 1 });
}

export async function getById(id) {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

export const create = (data) => Product.create(data);

export async function update(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

// Soft delete keeps old orders readable.
export const remove = (id) => update(id, { isActive: false });
