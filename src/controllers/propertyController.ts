import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { createProperty, getProperties, updateProperty, deleteProperty } from '../services/propertyService';
import { logger } from '../utils/logger';

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
    const properties = await getProperties(req.query);
    res.json({ properties });
  } catch (error) {
    const err = error as Error;
    logger.error('Get properties error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const updatePropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await updateProperty(req.params.id, req.body, req.user!.id);
    res.json({ property });
  } catch (error) {
    const err = error as Error;
    logger.error('Update property error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deletePropertyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await deleteProperty(req.params.id, req.user!.id);
    res.json({ message: 'Property deleted', property });
  } catch (error) {
    const err = error as Error;
    logger.error('Delete property error:', err);
    res.status(400).json({ error: err.message });
  }
};