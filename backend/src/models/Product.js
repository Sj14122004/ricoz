import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/constants.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    imageEmoji: { type: String, default: '🍼' },
    ageSuitability: { type: String, default: '' },
    warnings: { type: String, default: '' },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
