import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('No token provided');
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    logger.error('Invalid token:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const restrictToOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const propertyId = req.params.id;
  const Property = require('../models/Property');
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      logger.warn(`Property not found: ${propertyId}`);
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    if (property.createdBy.toString() !== req.user!.id) {
      logger.warn(`Unauthorized access to property ${propertyId} by user ${req.user!.id}`);
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    next();
  } catch (error) {
    logger.error('Error in restrictToOwner:', error);
    res.status(500).json({ error: 'Server error' });
  }
};