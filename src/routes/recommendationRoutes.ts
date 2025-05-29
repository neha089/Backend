import express from 'express';
import { recommendProperty, getRecommendations, searchUsers } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('recipientEmail').isEmail().withMessage('Invalid email'),
    body('propertyId').notEmpty().withMessage('Property ID is required'),
  ],
  recommendProperty
);

router.get('/', authMiddleware, getRecommendations);

router.get('/search', authMiddleware, searchUsers);

export default router;