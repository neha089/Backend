import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { getRecommendations, shareProperty, getSharedProperties, searchUsers } from '../services/recommendationService';
import { logger } from '../utils/logger';

export const getRecommendationsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recommendations = await getRecommendations(req.user!.id);
    logger.info(`Fetched recommendations for user ${req.user!.id}`);
    res.status(200).json({ recommendations });
  } catch (error) {
    const err = error as Error;
    logger.error('Get recommendations error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const sharePropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recommendation = await shareProperty(
      req.user!.id,
      req.body.recipientEmail,
      req.body.propertyId
    );
    logger.info(`User ${req.user!.id} shared property ${req.body.propertyId} with ${req.body.recipientEmail}`);
    res.status(201).json({ recommendation });
  } catch (error) {
    const err = error as Error;
    logger.error('Share property error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getSharedPropertiesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recommendations = await getSharedProperties(req.user!.id);
    logger.info(`Fetched shared properties for user ${req.user!.id}`);
    res.status(200).json({ recommendations });
  } catch (error) {
    const err = error as Error;
    logger.error('Get shared properties error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const searchUsersHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await searchUsers(req.query.email as string);
    logger.info(`Searched users with email query: ${req.query.email}`);
    res.status(200).json({ users });
  } catch (error) {
    const err = error as Error;
    logger.error('Search users error:', err);
    res.status(400).json({ error: err.message });
  }
};