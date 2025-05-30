import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../services/favoriteService';
import { logger } from '../utils/logger';

export const addFavoriteHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const favorite = await addFavorite(req.user!.id, req.body.propertyId);
    res.status(201).json({ favorite });
  } catch (error) {
    const err = error as Error;
    logger.error('Add favorite error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getFavoritesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const favorites = await getFavorites(req.user!.id);
    res.json({ favorites });
  } catch (error) {
    const err = error as Error;
    logger.error('Get favorites error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const removeFavoriteHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const favorite = await removeFavorite(req.user!.id, req.params.propertyId);
    res.json({ message: 'Favorite removed', favorite });
  } catch (error) {
    const err = error as Error;
    logger.error('Remove favorite error:', err);
    res.status(400).json({ error: err.message });
  }
};