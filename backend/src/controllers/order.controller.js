import * as orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';

export const create = asyncHandler(async (req, res) =>
  ok(res, await orderService.create(req.user._id, req.body), 201)
);
export const mine = asyncHandler(async (req, res) => ok(res, await orderService.listForUser(req.user._id)));
export const all = asyncHandler(async (req, res) => ok(res, await orderService.listAll(req.query.status)));
export const getOne = asyncHandler(async (req, res) =>
  ok(res, await orderService.getForUser(req.params.id, req.user))
);
export const updateStatus = asyncHandler(async (req, res) =>
  ok(res, await orderService.updateStatus(req.params.id, req.body.status, req.body.note))
);
export const cancel = asyncHandler(async (req, res) =>
  ok(res, await orderService.cancelByParent(req.params.id, req.user))
);
