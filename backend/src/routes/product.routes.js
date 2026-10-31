import { Router } from 'express';
import * as c from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { productSchema, productUpdateSchema } from '../validators/product.validator.js';

const router = Router();
router.get('/', c.list);
router.get('/admin/all', protect, restrictTo('admin'), c.listAll);
router.get('/:id', c.getOne);
router.post('/', protect, restrictTo('admin'), validate(productSchema), c.create);
router.put('/:id', protect, restrictTo('admin'), validate(productUpdateSchema), c.update);
router.delete('/:id', protect, restrictTo('admin'), c.remove);
export default router;
