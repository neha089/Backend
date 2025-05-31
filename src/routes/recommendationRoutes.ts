import { Router } from 'express';
import { getRecommendationsHandler, sharePropertyHandler, getSharedPropertiesHandler, searchUsersHandler } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.get('/', authMiddleware, getRecommendationsHandler);

router.post(
  '/share',
  authMiddleware,
  [
    check('recipientEmail').isEmail().withMessage('Valid recipient email is required'),
    check('propertyId').notEmpty().withMessage('Property ID is required'),
  ],
  sharePropertyHandler
);

router.get('/shared', authMiddleware, getSharedPropertiesHandler);

router.get(
  '/search',
  authMiddleware,
  [check('email').notEmpty().withMessage('Email query is required')],
  searchUsersHandler
);

export default router;