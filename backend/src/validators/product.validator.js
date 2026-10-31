import { z } from 'zod';
import { CATEGORIES } from '../utils/constants.js';

export const productSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(600),
  category: z.enum(CATEGORIES),
  price: z.coerce.number().min(0),
  stockQuantity: z.coerce.number().int().min(0),
  imageEmoji: z.string().max(8).optional(),
  ageSuitability: z.string().max(80).optional(),
  warnings: z.string().max(400).optional(),
  expiryDate: z.string().optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
  isActive: z.boolean().optional(),
});
