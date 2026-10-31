import { Router } from 'express';
import * as c from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, statusSchema } from '../validators/order.validator.js';

const router = Router();
router.use(protect);
router.post('/', restrictTo('parent'), validate(createOrderSchema), c.create);
router.get('/mine', c.mine);
router.get('/', restrictTo('admin'), c.all);
router.get('/:id', c.getOne);
router.patch('/:id/cancel', c.cancel);
router.patch('/:id/status', restrictTo('admin'), validate(statusSchema), c.updateStatus);
export default router;
