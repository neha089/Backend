import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/authMiddleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [body('propertyId').notEmpty().withMessage('Property ID is required')],
  addFavorite
);

router.get('/', authMiddleware, getFavorites);

router.delete('/:propertyId', authMiddleware, removeFavorite);

export default router;