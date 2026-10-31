import { z } from 'zod';
import { ORDER_STATUS } from '../utils/constants.js';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().length(24),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1),
  deliveryAddress: z.string().min(10).max(300),
  contactPhone: z.string().min(7).max(20),
  fulfillment: z.enum(['delivery', 'pickup']).default('delivery'),
  notes: z.string().max(300).optional(),
});

export const statusSchema = z.object({
  status: z.enum(Object.values(ORDER_STATUS)),
  note: z.string().max(200).optional(),
});
