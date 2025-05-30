import { Router } from 'express';
import { recommendPropertyHandler, getRecommendationsHandler, searchUsersHandler } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/',
  authMiddleware,
  [
    check('recipientEmail').isEmail().withMessage('Valid recipient email is required'),
    check('propertyId').notEmpty().withMessage('Property ID is required'),
  ],
  recommendPropertyHandler
);

router.get('/', authMiddleware, getRecommendationsHandler);

router.get('/search', authMiddleware, searchUsersHandler);

export default router;