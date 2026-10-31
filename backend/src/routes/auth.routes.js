import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', validate(registerSchema), c.register);
router.post('/login', validate(loginSchema), c.login);
router.post('/logout', c.logout);
router.get('/me', protect, c.me);
export default router;
