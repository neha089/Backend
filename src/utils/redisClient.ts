import Redis from 'ioredis';
import { logger } from './logger';

export const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 10, // Increase to 10 retries
  connectTimeout: 10000, // 10s timeout for initial connection
  retryStrategy(times) {
    if (times > 10) {
      logger.error('Redis max retry attempts reached, stopping retries');
      return null; // Stop retrying after 10 attempts
    }
    const delay = Math.min(times * 200, 5000); // Exponential backoff, max 5s
    logger.warn(`Retrying Redis connection, attempt ${times}, delay ${delay}ms`);
    return delay;
  },
  reconnectOnError(err) {
    logger.error('Redis reconnect error:', err);
    return err.message.includes('ECONNRESET') || err.message.includes('ETIMEDOUT');
  },
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  redisClient.quit(() => {
    logger.info('Redis connection closed');
  });
});