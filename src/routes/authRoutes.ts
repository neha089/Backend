import { Router } from 'express';
import { check } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('name').notEmpty().withMessage('Name is required'),
  ],
  register
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

export default router;