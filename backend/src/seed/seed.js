import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

const products = [
  { name: 'Infant Formula Milk (Stage 1)', imageEmoji: '🍼', category: 'formula', price: 649, stockQuantity: 40,
    description: 'Ready-to-mix powdered formula for newborns, 400 g tin.', ageSuitability: '0–6 months',
    warnings: 'Always follow the tin instructions. Ask your pediatrician which formula suits your baby.' },
  { name: 'Hypoallergenic Diapers (M, 20 pack)', imageEmoji: '👶', category: 'diapers', price: 399, stockQuantity: 60,
    description: 'Soft, fragrance-free diapers with a wetness indicator.', ageSuitability: '6–11 kg',
    warnings: 'Change often. Stop use and see a doctor if a rash appears.' },
  { name: 'Colic Relief Drops', imageEmoji: '💧', category: 'colic', price: 185, stockQuantity: 25,
    description: 'Simethicone-based drops, 30 ml bottle.', ageSuitability: 'Ask your doctor',
    warnings: 'Use only as directed by a doctor. Not a treatment for serious symptoms.' },
  { name: 'Silicone Nipple Shields (2 pack)', imageEmoji: '🫧', category: 'feeding', price: 299, stockQuantity: 30,
    description: 'Thin, BPA-free silicone shields with a carry case.', ageSuitability: 'Breastfeeding mothers',
    warnings: 'Sterilise before first use. Talk to a lactation consultant if feeding hurts.' },
  { name: 'Organic Baby Wipes (72 count)', imageEmoji: '🧻', category: 'wipes', price: 229, stockQuantity: 80,
    description: 'Water-based wipes with aloe, free of alcohol and perfume.', ageSuitability: 'Newborn+',
    warnings: 'Keep away from eyes.' },
  { name: 'Gripe Water', imageEmoji: '🌿', category: 'colic', price: 159, stockQuantity: 35,
    description: 'Herbal gripe water, 150 ml bottle.', ageSuitability: 'Ask your doctor',
    warnings: 'Check age on the label. Ask your pediatrician before first use.' },
];

await connectDB();
await Promise.all([Product.deleteMany(), Order.deleteMany(), User.deleteMany()]);
await Product.insertMany(products);
await User.create([
  { name: 'Pod Admin', email: 'admin@pod.com', role: 'admin', passwordHash: await bcrypt.hash('Admin@123', 10) },
  { name: 'Demo Parent', email: 'parent@pod.com', phone: '9000000000', passwordHash: await bcrypt.hash('Parent@123', 10) },
]);
console.log('Seeded 6 products, admin@pod.com / Admin@123, parent@pod.com / Parent@123');
await mongoose.disconnect();
