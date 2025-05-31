import Redis from 'ioredis';
import { logger } from './logger';

logger.info(`REDIS_URL: ${process.env.REDIS_URL}`);

export const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 10,
  connectTimeout: 10000,
  enableTLSForSentinelMode: false,
  tls: process.env.REDIS_URL?.includes('upstash.io') ? {
    rejectUnauthorized: false, // Upstash may not need strict certificate validation
  } : undefined,
  retryStrategy(times) {
    if (times > 10) {
      logger.error('Redis max retry attempts reached, stopping retries');
      return null;
    }
    const delay = Math.min(times * 200, 5000);
    logger.warn(`Retrying Redis connection, attempt ${times}, delay ${delay}ms`);
    return delay;
  },
  reconnectOnError(err) {
    logger.error('Redis reconnect error:', err);
    return err.message.includes('ECONNRESET') || err.message.includes('ETIMEDOUT');
  },
});

redisClient.on('connect', () => {
  logger.info(`Redis connected successfully with `);
  
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

process.on('SIGTERM', () => {
  redisClient.quit(() => {
    logger.info('Redis connection closed');
  });
});