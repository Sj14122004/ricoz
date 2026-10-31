import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => ok(res, await productService.list(req.query)));
export const listAll = asyncHandler(async (req, res) =>
  ok(res, await productService.list({ ...req.query, includeInactive: true }))
);
export const getOne = asyncHandler(async (req, res) => ok(res, await productService.getById(req.params.id)));
export const create = asyncHandler(async (req, res) => ok(res, await productService.create(req.body), 201));
export const update = asyncHandler(async (req, res) => ok(res, await productService.update(req.params.id, req.body)));
export const remove = asyncHandler(async (req, res) => ok(res, await productService.remove(req.params.id)));
