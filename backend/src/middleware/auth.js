import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, 'Please log in to continue');
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Session expired, please log in again');
  }
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'Account no longer exists');
  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, _res, next) =>
  roles.includes(req.user.role) ? next() : next(new ApiError(403, 'You do not have access to this'));
