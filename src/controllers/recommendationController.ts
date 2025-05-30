import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { recommendProperty, getRecommendations, searchUsers } from '../services/recommendationService';
import { logger } from '../utils/logger';

export const recommendPropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recommendation = await recommendProperty(
      req.user!.id,
      req.body.recipientEmail,
      req.body.propertyId
    );
    res.status(201).json({ recommendation });
  } catch (error) {
    const err = error as Error;
    logger.error('Recommend property error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getRecommendationsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recommendations = await getRecommendations(req.user!.id);
    res.json({ recommendations });
  } catch (error) {
    const err = error as Error;
    logger.error('Get recommendations error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const searchUsersHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await searchUsers(req.query.email as string);
    res.json({ users });
  } catch (error) {
    const err = error as Error;
    logger.error('Search users error:', err);
    res.status(400).json({ error: err.message });
  }
};