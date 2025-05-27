import { Recommendation } from "../models/Recommendation";
import { User } from "../models/User";
import { logger } from "../utils/logger";
import { Property } from "../models/Property";
import { redisClient } from "../utils/redisClient";

export const recommendProperty = async (senderId: string, propertyId:string , recipientEmail:string) => {
    try {
        // Check if the recipient exists
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            logger.warn(`Recipient with email ${recipientEmail} not found`);
            throw new Error('Recipient not found');
        }

        // Check if the property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            logger.warn(`Property with ID ${propertyId} not found`);
            throw new Error('Property not found');
        }

        // Create a new recommendation
        const recommendation = new Recommendation({
            senderId,
            propertyId: property.id,
            recipientId: recipient.id,
        });

        await recommendation.save();
        
        await redisClient.del(`recommendations:${recipient._id}`);
    logger.info(`Recommendation sent: from ${senderId} to ${recipient._id} for property ${propertyId}`);
    return recommendation;
  } catch (error) {
    logger.error('Error recommending property:', error);
    throw error;
  }
};

export const getRecommendations = async (userId: string) => {
    const cacheKey = `recommendations:${userId}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return JSON.parse(cachedData);
        }
        const recommendations = await Recommendation.find({ recipientId: userId }).populate('senderId', 'name email')
        .populate('propertyId');;
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations));
        logger.info(`Recommendations fetched and cached for user ${userId}: ${recommendations.length}`);
        return recommendations;
    } catch (error) {
        logger.error('Error fetching recommendations:', error);
        throw error;
    }
};
export const searchUsers = async (email: string) => {
  const cacheKey = `user-search:${email}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for user search: ${email}`);
      return JSON.parse(cachedData);
    }
    const users = await User.find({ email: new RegExp(email, 'i') }, 'name email');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));
    logger.info(`Users searched and cached: ${users.length} for email ${email}`);
    return users;
  } catch (error) {
    logger.error('Error searching users:', error);
    throw error;
  }
};