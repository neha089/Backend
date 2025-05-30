import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env
import express from 'express';
import connectDB from './config/database'; // Changed to default import
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/authMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

app.use('/auth', authRoutes);
app.use('/properties', authMiddleware, propertyRoutes);
app.use('/favorites', authMiddleware, favoriteRoutes);
app.use('/recommendations', authMiddleware, recommendationRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});