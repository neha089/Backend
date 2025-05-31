import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/authMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Listing System API',
      version: '1.0.0',
      description: 'API for managing properties, favorites, and recommendations',
    },
    servers: [
      {
        url: process.env.RENDER_URL || 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};



app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use('/auth', authRoutes);
app.use('/properties', authMiddleware, propertyRoutes);
app.use('/favorites', authMiddleware, favoriteRoutes);
app.use('/recommendations', authMiddleware, recommendationRoutes);

app.use(errorMiddleware);
app.use('/', (req, res) => {
  res.send('Welcome to the Property Listing System API.. refere readme of github repository for more details about the API');
});
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });