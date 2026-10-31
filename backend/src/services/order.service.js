import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ORDER_STATUS, TRANSITIONS } from '../utils/constants.js';

const restock = (items) =>
  Promise.all(
    items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { stockQuantity: i.quantity } }))
  );

// Atomic per-product decrement: the `$gte` guard means two requests can never
// sell the same unit. If any line fails, earlier lines are rolled back.
async function reserveStock(items) {
  const done = [];
  try {
    for (const item of items) {
      const res = await Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } }
      );
      if (!res.modifiedCount) throw new ApiError(409, `Not enough stock for ${item.name}`);
      done.push(item);
    }
  } catch (err) {
    await restock(done);
    throw err;
  }
}

export async function create(userId, payload) {
  const ids = payload.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  // Prices come from the database, never from the client.
  const items = payload.items.map(({ productId, quantity }) => {
    const p = byId.get(productId);
    if (!p) throw new ApiError(404, 'A product in your request is no longer available');
    if (p.stockQuantity < quantity) throw new ApiError(409, `Only ${p.stockQuantity} left of ${p.name}`);
    return { product: p._id, name: p.name, imageEmoji: p.imageEmoji, quantity, unitPrice: p.price };
  });

  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return Order.create({
    user: userId,
    items,
    totalAmount,
    fulfillment: payload.fulfillment,
    deliveryAddress: payload.deliveryAddress,
    contactPhone: payload.contactPhone,
    notes: payload.notes,
    statusHistory: [{ status: ORDER_STATUS.PENDING, note: 'Request received' }],
  });
}

export const listForUser = (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });

export const listAll = (status) =>
  Order.find(status ? { status } : {})
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

export async function getForUser(id, user) {
  const order = await Order.findById(id).populate('user', 'name email phone');
  if (!order) throw new ApiError(404, 'Request not found');
  const isOwner = String(order.user._id) === String(user._id);
  if (!isOwner && user.role !== 'admin') throw new ApiError(403, 'You do not have access to this request');
  return order;
}

export async function updateStatus(id, status, note) {
  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, 'Request not found');
  if (!TRANSITIONS[order.status].includes(status)) {
    throw new ApiError(400, `Cannot change a ${order.status} request to ${status}`);
  }

  if (status === ORDER_STATUS.CONFIRMED) await reserveStock(order.items);
  if (order.status === ORDER_STATUS.CONFIRMED && status === ORDER_STATUS.CANCELLED) {
    await restock(order.items);
  }

  order.status = status;
  order.statusHistory.push({ status, note });
  await order.save();
  return order;
}

export async function cancelByParent(id, user) {
  const order = await getForUser(id, user);
  if (order.status !== ORDER_STATUS.PENDING) {
    throw new ApiError(400, 'Only pending requests can be cancelled. Please call us for anything else.');
  }
  return updateStatus(id, ORDER_STATUS.CANCELLED, 'Cancelled by parent');
}
