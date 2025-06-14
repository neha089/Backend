import { Property } from '../models/Property';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';
import { SearchHistory } from '../models/SearchHistory';

export const createProperty = async (data: any, userId: string) => {
  const property = new Property({ ...data, createdBy: userId });
  await property.save();
  try {
    await redisClient.del('properties:*');
    logger.info('Cleared properties cache');
  } catch (error) {
    logger.warn('Failed to clear Redis cache on create:', error);
  }
  return property;
};

export const getProperties = async (query: any, userId?: string) => {
  const cacheKey = `properties:${JSON.stringify(query)}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`CACHE_HIT: ${cacheKey}`);
      return JSON.parse(cached);
    } else {
      logger.info(`CACHE_MISS: ${cacheKey}, querying MongoDB`);
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn(`CACHE_ERROR: ${cacheKey}, falling back to MongoDB`, err);
  }

  const properties = await Property.find(query);
  if (userId) {
    await SearchHistory.create({ userId, query });
  }
  try {
    await redisClient.setex(cacheKey, 3600, JSON.stringify(properties));
    logger.info(`CACHE_SET: ${cacheKey}`);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn(`CACHE_SET_FAILED: ${cacheKey}`, err);
  }
  return properties;
};

export const updateProperty = async (id: string, data: any, userId: string) => {
  const property = await Property.findOneAndUpdate(
    { id, createdBy: userId }, // Query by custom id field
    { $set: data },
    { new: true }
  );
  if (!property) {
    throw new Error('Property not found or unauthorized');
  }
  try {
    await redisClient.del('properties:*');
    logger.info('Cleared properties cache');
  } catch (error) {
    logger.warn('Failed to clear Redis cache on update:', error);
  }
  return property;
};

export const deleteProperty = async (id: string, userId: string) => {
  const property = await Property.findOneAndDelete({ id, createdBy: userId }); // Query by custom id field
  if (!property) {
    throw new Error('Property not found or unauthorized');
  }
  try {
    await redisClient.del('properties:*');
    logger.info('Cleared properties cache');
  } catch (error) {
    logger.warn('Failed to clear Redis cache on delete:', error);
  }
  return property;
};