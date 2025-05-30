import { Property } from '../models/Property';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';

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

export const getProperties = async (query: any) => {
  const cacheKey = `properties:${JSON.stringify(query)}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (error) {
    logger.warn(`Redis cache miss for key: ${cacheKey}, falling back to MongoDB`, error);
  }

  const properties = await Property.find(query);
  try {
    await redisClient.setex(cacheKey, 3600, JSON.stringify(properties));
    logger.info(`Cached properties for key: ${cacheKey}`);
  } catch (error) {
    logger.warn(`Failed to cache properties for key: ${cacheKey}`, error);
  }
  return properties;
};

export const updateProperty = async (id: string, data: any, userId: string) => {
  const property = await Property.findOneAndUpdate(
    { _id: id, createdBy: userId },
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
  const property = await Property.findOneAndDelete({ _id: id, createdBy: userId });
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