"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
exports.redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
exports.redisClient.on('connect', () => {
    logger_1.logger.info('Redis connected successfully');
});
exports.redisClient.on('error', (error) => {
    logger_1.logger.error('Redis connection failed:', error);
    process.exit(1); // Exit the process with failure
});
exports.redisClient.on('ready', () => {
    logger_1.logger.info('Redis is ready to use');
});
exports.redisClient.on('end', () => {
    logger_1.logger.info('Redis connection closed');
});
exports.redisClient.on('reconnecting', () => {
    logger_1.logger.info('Redis is reconnecting');
});
exports.redisClient.on('close', () => {
    logger_1.logger.info('Redis connection closed');
});
exports.redisClient.on('warning', (warning) => {
    logger_1.logger.warn('Redis warning:', warning);
});
exports.redisClient.on('message', (channel, message) => {
    logger_1.logger.info(`Received message from channel ${channel}: ${message}`);
});
exports.redisClient.on('subscribe', (channel, count) => {
    logger_1.logger.info(`Subscribed to channel ${channel}. Current subscription count: ${count}`);
});
exports.redisClient.on('unsubscribe', (channel, count) => {
    logger_1.logger.info(`Unsubscribed from channel ${channel}. Current subscription count: ${count}`);
});
exports.redisClient.on('pmessage', (pattern, channel, message) => {
    logger_1.logger.info(`Received message from pattern ${pattern} on channel ${channel}: ${message}`);
});
exports.redisClient.on('psubscribe', (pattern, count) => {
    logger_1.logger.info(`Subscribed to pattern ${pattern}. Current subscription count: ${count}`);
});
exports.redisClient.on('punsubscribe', (pattern, count) => {
    logger_1.logger.info(`Unsubscribed from pattern ${pattern}. Current subscription count: ${count}`);
});
