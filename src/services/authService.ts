import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();
  return { id: user._id, email: user.email, name: user.name };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { token, user: { id: user._id, email: user.email, name: user.name } };
};