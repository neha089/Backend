import { Favorite } from "../models/Favorite";
import { logger } from "../utils/logger";
import { redisClient } from "../utils/redisClient";

export const addFavorite = async (userId: string, propertyId: string) => {
    try {
        const existingFavorite = await Favorite.findOne({ userId, propertyId });    
        if (existingFavorite) {
            logger.warn(`Favorite already exists for user ${userId} and property ${propertyId}`);
            return { message: "Favorite already exists" };
        }
        const favorite = new Favorite({ userId, propertyId });
        await favorite.save();
        logger.info(`Favorite added successfully for user ${userId} and property ${propertyId}`);
        await redisClient.del(`favorites:${userId}`); // Invalidate cache
        return favorite;
    } catch (error) {
        logger.error('Error adding favorite:', error);
        throw new Error('Failed to add favorite');
    }   
}
export const getFavorites = async (userId: string) => {
    const cacheKey = `favorites:${userId}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return JSON.parse(cachedData);
        }
        const favorites = await Favorite.find({ userId }).populate('propertyId');
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(favorites));
        logger.info(`Favorites fetched and cached for user ${userId}: ${favorites.length}`);
        return favorites;
    } catch (error) {
        logger.error('Error fetching favorites:', error);
        throw error;
    }
}
export const removeFavorite = async (userId: string, propertyId: string) => {
    try {
        const result = await Favorite.deleteOne({ userId, propertyId });
        if (result.deletedCount === 0) {
            logger.warn(`No favorite found for user ${userId} and property ${propertyId}`);
            throw new Error('Favorite not found');
        }   
        logger.info(`Favorite removed successfully for user ${userId} and property ${propertyId}`);
        await redisClient.del(`favorites:${userId}`); // Invalidate cache
        return { message: "Favorite removed successfully" };    
    } catch (error) {
        logger.error('Error removing favorite:', error);
        throw new Error('Failed to remove favorite');
    }
}
export const clearFavorites = async (userId: string) => {
    try {
        await Favorite.deleteMany({ userId });
        logger.info(`All favorites cleared for user ${userId}`);
        await redisClient.del(`favorites:${userId}`); // Invalidate cache
        return { message: "All favorites cleared successfully" };
    } catch (error) {
        logger.error('Error clearing favorites:', error);
        throw new Error('Failed to clear favorites');
    }
}
export const isFavorite = async (userId: string, propertyId: string) => {
    try {
        const favorite = await Favorite.findOne({ userId, propertyId });
        return !!favorite;
    } catch (error) {
        logger.error('Error checking if favorite:', error);
        throw new Error('Failed to check favorite status');
    }
}
export const getFavoriteCount = async (propertyId: string) => {
    try {
        const count = await Favorite.countDocuments
({ propertyId });
        return count;
    }
    catch (error) {
        logger.error('Error getting favorite count:', error);
        throw new Error('Failed to get favorite count');
    }
}
export const getUserFavoritesCount = async (userId: string) => {
    try {
        const count = await Favorite.countDocuments({ userId });
        return count;
    } catch (error) {
        logger.error('Error getting user favorites count:', error);
        throw new Error('Failed to get user favorites count');
    }
}

