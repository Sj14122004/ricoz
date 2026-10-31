import { env } from '../config/env.js';
import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: env.isProd ? 'none' : 'lax',
  secure: env.isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.cookie('token', token, cookieOptions);
  ok(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie('token', token, cookieOptions);
  ok(res, user);
});

export const logout = (_req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  ok(res, null);
};

export const me = (req, res) => ok(res, authService.publicUser(req.user));
