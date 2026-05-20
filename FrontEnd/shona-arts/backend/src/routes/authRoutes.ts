import { Router } from 'express';
import { body } from 'express-validator';
import { googleLogin, login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

export const authRoutes = Router();

authRoutes.post('/register', body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 }), validate, register);
authRoutes.post('/login', body('email').isEmail(), body('password').notEmpty(), validate, login);
authRoutes.post('/google', body('credential').notEmpty(), validate, googleLogin);
authRoutes.get('/me', protect, me);
