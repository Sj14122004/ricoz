import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // snapshot, so history survives edits
    imageEmoji: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    status: String,
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    fulfillment: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    deliveryAddress: { type: String, required: true },
    contactPhone: { type: String, required: true },
    notes: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    statusHistory: [historySchema],
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
