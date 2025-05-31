import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { createProperty, getProperties, updateProperty, deleteProperty } from '../services/propertyService';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export const createPropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await createProperty(req.body, req.user!.id);
    res.status(201).json({ property });
  } catch (error) {
    const err = error as Error;
    logger.error('Create property error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getPropertiesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const properties = await getProperties(req.query, req.user ? req.user.id : undefined);
    res.status(200).json({ properties });
  } catch (error) {
    const err = error as Error;
    logger.error('Get properties error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const updatePropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await updateProperty(req.params.id, req.body, req.user!.id);
    res.status(200).json({ property });
  } catch (error) {
    const err = error as Error;
    logger.error('Update property error:', err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: 'Invalid property ID format' });
    } else if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deletePropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await deleteProperty(req.params.id, req.user!.id);
    res.status(200).json({ message: 'Property deleted', property });
  } catch (error) {
    const err = error as Error;
    logger.error('Delete property error:', err);
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: 'Invalid property ID format' });
    } else if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};