import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection with URI:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;