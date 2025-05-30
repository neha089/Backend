import { Router } from 'express';
import { addFavoriteHandler, getFavoritesHandler, removeFavoriteHandler } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/',
  authMiddleware,
  [check('propertyId').notEmpty().withMessage('Property ID is required')],
  addFavoriteHandler
);

router.get('/', authMiddleware, getFavoritesHandler);

router.delete('/:propertyId', authMiddleware, removeFavoriteHandler);

export default router;