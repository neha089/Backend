import { Favorite } from '../models/Favorite';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';

export const addFavorite = async (userId: string, propertyId: string) => {
  const existing = await Favorite.findOne({ userId, propertyId });
  if (existing) {
    throw new Error('Property already favorited');
  }
  const favorite = new Favorite({ userId, propertyId });
  await favorite.save();
  await redisClient.del(`favorites:${userId}`);
  return favorite;
};

export const getFavorites = async (userId: string) => {
  const cacheKey = `favorites:${userId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info('Cache hit for favorites:', cacheKey);
    return JSON.parse(cached);
  }
  const favorites = await Favorite.find({ userId }).populate('propertyId');
  await redisClient.setex(cacheKey, 3600, JSON.stringify(favorites)); // Changed setEx to setex
  return favorites;
};

export const removeFavorite = async (userId: string, propertyId: string) => {
  const favorite = await Favorite.findOneAndDelete({ userId, propertyId });
  if (!favorite) {
    throw new Error('Favorite not found');
  }
  await redisClient.del(`favorites:${userId}`);
  return favorite;
};