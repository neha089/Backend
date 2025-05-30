import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    const err = error as Error;
    logger.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (error) {
    const err = error as Error;
    logger.error('Login error:', err);
    res.status(401).json({ error: err.message });
  }
};