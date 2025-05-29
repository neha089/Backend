import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { addFavorite, getFavorites, removeFavorite } from '../services/favoriteService';
import { AuthRequest } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';

export const addFavorite = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error in addFavorite:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const favorite = await addFavorite(req.user!.id, req.body.propertyId);
    res.status(201).json(favorite);
  } catch (error) {
    logger.error('Error adding favorite:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await getFavorites(req.user!.id);
    res.json(favorites);
  } catch (error) {
    logger.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const favorite = await removeFavorite(req.user!.id, req.params.propertyId);
    res.json({ message: 'Favorite removed', favorite });
  } catch (error) {
    logger.error('Error removing favorite:', error);
    res.status(400).json({ error: error.message });
  }
};