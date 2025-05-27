import Redis from 'ioredis';
import { logger } from './logger';
export const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redisClient.on('connect', () => {
    logger.info('Redis connected successfully');
});
redisClient.on('error', (error) => {
    logger.error('Redis connection failed:', error);
    process.exit(1); // Exit the process with failure
});
redisClient.on('ready', () => {
    logger.info('Redis is ready to use');
}
);
redisClient.on('end', () => {
    logger.info('Redis connection closed');
});
redisClient.on('reconnecting', () => {
    logger.info('Redis is reconnecting');
});
redisClient.on('close', () => {
    logger.info('Redis connection closed');
});
redisClient.on('warning', (warning) => {
    logger.warn('Redis warning:', warning);
});
redisClient.on('message', (channel, message) => {
    logger.info(`Received message from channel ${channel}: ${message}`);
});
redisClient.on('subscribe', (channel, count) => {
    logger.info(`Subscribed to channel ${channel}. Current subscription count: ${count}`);
});
redisClient.on('unsubscribe', (channel, count) => {
    logger.info(`Unsubscribed from channel ${channel}. Current subscription count: ${count}`);
});
redisClient.on('pmessage', (pattern, channel, message) => {
    logger.info(`Received message from pattern ${pattern} on channel ${channel}: ${message}`);
});
redisClient.on('psubscribe', (pattern, count) => {
    logger.info(`Subscribed to pattern ${pattern}. Current subscription count: ${count}`);
});
redisClient.on('punsubscribe', (pattern, count) => {
    logger.info(`Unsubscribed from pattern ${pattern}. Current subscription count: ${count}`);
});
