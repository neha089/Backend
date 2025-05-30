import { User } from '../models/User';
import { Recommendation } from '../models/Recommendation';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redisClient';

export const recommendProperty = async (senderId: string, recipientEmail: string, propertyId: string) => {
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  const recommendation = new Recommendation({
    senderId,
    recipientId: recipient._id,
    propertyId
  });
  await recommendation.save();
  await redisClient.del(`recommendations:${recipient._id}`);
  return recommendation;
};

export const getRecommendations = async (userId: string) => {
  const cacheKey = `recommendations:${userId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.info('Cache hit for recommendations:', cacheKey);
    return JSON.parse(cached);
  }
  const recommendations = await Recommendation.find({ recipientId: userId })
    .populate('senderId')
    .populate('propertyId');
  await redisClient.setex(cacheKey, 3600, JSON.stringify(recommendations)); // Changed setEx to setex
  return recommendations;
};

export const searchUsers = async (email: string) => {
  return await User.find({ email: { $regex: email, $options: 'i' } })
    .select('email name')
    .limit(10);
};