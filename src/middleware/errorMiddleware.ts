import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error in ${req.method} ${req.url}:`, err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};