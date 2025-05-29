import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/authService';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error in register:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    logger.error('Error in register:', error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error in login:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    logger.error('Error in login:', error);
    res.status(401).json({ error: error.message });
  }
};