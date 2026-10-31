import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

export const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role });

export async function register({ name, email, password, phone }) {
  if (await User.findOne({ email })) throw new ApiError(409, 'An account with this email already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash });
  return { user: publicUser(user), token: signToken(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  return { user: publicUser(user), token: signToken(user) };
}
