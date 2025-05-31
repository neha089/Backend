import { User } from '../models/User';
import { Recommendation } from '../models/Recommendation';
import { Property } from '../models/Property';
import { Favorite } from '../models/Favorite';
import { SearchHistory } from '../models/SearchHistory';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';

export const getRecommendations = async (userId: string) => {
  const cacheKey = `recommendations:${userId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`CACHE_HIT: ${cacheKey}`);
      return JSON.parse(cached);
    }
    logger.info(`CACHE_MISS: ${cacheKey}, generating recommendations`);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn(`CACHE_ERROR: ${cacheKey}, proceeding without cache`, err);
  }

  try {
    const favorites = await Favorite.find({ userId }).select('propertyId');
    const favoriteIds = favorites.map(f => f.propertyId);

    const favoriteProperties = await Property.find({ _id: { $in: favoriteIds } });

    const cities = [...new Set(favoriteProperties.map(p => p.city))];
    const priceRange = favoriteProperties.length > 0 ? {
      min: Math.min(...favoriteProperties.map(p => p.price)) * 0.8,
      max: Math.max(...favoriteProperties.map(p => p.price)) * 1.2,
    } : { min: 0, max: Infinity };

    const searchHistory = await SearchHistory.find({ userId }).sort({ timestamp: -1 }).limit(10);
    const searchCities = [...new Set(searchHistory.map(h => h.query.city).filter(c => c))];

    const query: any = {
      _id: { $nin: favoriteIds },
      $or: [
        { city: { $in: [...cities, ...searchCities] } },
        { price: { $gte: priceRange.min, $lte: priceRange.max } },
      ],
    };

    const recommendations = await Property.find(query).limit(10);
    try {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(recommendations));
      logger.info(`CACHE_SET: ${cacheKey}`);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      logger.warn(`CACHE_SET_FAILED: ${cacheKey}`, err);
    }
    return recommendations;
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.error(`Recommendation generation error for user ${userId}`, err);
    throw err;
  }
};

export const shareProperty = async (senderId: string, recipientEmail: string, propertyId: string) => {
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  const recommendation = new Recommendation({
    senderId,
    recipientId: recipient._id,
    propertyId,
  });
  await recommendation.save();
  await redisClient.del(`recommendations:${recipient._id}`);
  return recommendation;
};

export const getSharedProperties = async (userId: string) => {
  const cacheKey = `shared:${userId}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`CACHE_HIT: ${cacheKey}`);
      return JSON.parse(cached);
    }
    logger.info(`CACHE_MISS: ${cacheKey}, querying shared properties`);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn(`CACHE_ERROR: ${cacheKey}, proceeding without cache`, err);
  }

  const recommendations = await Recommendation.find({ recipientId: userId })
    .populate('senderId', 'email name')
    .populate('propertyId');
  try {
    await redisClient.setex(cacheKey, 3600, JSON.stringify(recommendations));
    logger.info(`CACHE_SET: ${cacheKey}`);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn(`CACHE_SET_FAILED: ${cacheKey}`, err);
  }
  return recommendations;
};

export const searchUsers = async (email: string) => {
  return await User.find({ email: { $regex: email, $options: 'i' } })
    .select('email name')
    .limit(10);
};
