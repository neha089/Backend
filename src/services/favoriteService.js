"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavoritesCount = exports.getFavoriteCount = exports.isFavorite = exports.clearFavorites = exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const Favorite_1 = require("../models/Favorite");
const logger_1 = require("../utils/logger");
const redisClient_1 = require("../utils/redisClient");
const addFavorite = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingFavorite = yield Favorite_1.Favorite.findOne({ userId, propertyId });
        if (existingFavorite) {
            logger_1.logger.warn(`Favorite already exists for user ${userId} and property ${propertyId}`);
            return { message: "Favorite already exists" };
        }
        const favorite = new Favorite_1.Favorite({ userId, propertyId });
        yield favorite.save();
        logger_1.logger.info(`Favorite added successfully for user ${userId} and property ${propertyId}`);
        yield redisClient_1.redisClient.del(`favorites:${userId}`); // Invalidate cache
        return favorite;
    }
    catch (error) {
        logger_1.logger.error('Error adding favorite:', error);
        throw new Error('Failed to add favorite');
    }
});
exports.addFavorite = addFavorite;
const getFavorites = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `favorites:${userId}`;
    try {
        const cachedData = yield redisClient_1.redisClient.get(cacheKey);
        if (cachedData) {
            logger_1.logger.info(`Cache hit for key: ${cacheKey}`);
            return JSON.parse(cachedData);
        }
        const favorites = yield Favorite_1.Favorite.find({ userId }).populate('propertyId');
        yield redisClient_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(favorites));
        logger_1.logger.info(`Favorites fetched and cached for user ${userId}: ${favorites.length}`);
        return favorites;
    }
    catch (error) {
        logger_1.logger.error('Error fetching favorites:', error);
        throw error;
    }
});
exports.getFavorites = getFavorites;
const removeFavorite = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Favorite_1.Favorite.deleteOne({ userId, propertyId });
        if (result.deletedCount === 0) {
            logger_1.logger.warn(`No favorite found for user ${userId} and property ${propertyId}`);
            throw new Error('Favorite not found');
        }
        logger_1.logger.info(`Favorite removed successfully for user ${userId} and property ${propertyId}`);
        yield redisClient_1.redisClient.del(`favorites:${userId}`); // Invalidate cache
        return { message: "Favorite removed successfully" };
    }
    catch (error) {
        logger_1.logger.error('Error removing favorite:', error);
        throw new Error('Failed to remove favorite');
    }
});
exports.removeFavorite = removeFavorite;
const clearFavorites = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Favorite_1.Favorite.deleteMany({ userId });
        logger_1.logger.info(`All favorites cleared for user ${userId}`);
        yield redisClient_1.redisClient.del(`favorites:${userId}`); // Invalidate cache
        return { message: "All favorites cleared successfully" };
    }
    catch (error) {
        logger_1.logger.error('Error clearing favorites:', error);
        throw new Error('Failed to clear favorites');
    }
});
exports.clearFavorites = clearFavorites;
const isFavorite = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favorite = yield Favorite_1.Favorite.findOne({ userId, propertyId });
        return !!favorite;
    }
    catch (error) {
        logger_1.logger.error('Error checking if favorite:', error);
        throw new Error('Failed to check favorite status');
    }
});
exports.isFavorite = isFavorite;
const getFavoriteCount = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Favorite_1.Favorite.countDocuments({ propertyId });
        return count;
    }
    catch (error) {
        logger_1.logger.error('Error getting favorite count:', error);
        throw new Error('Failed to get favorite count');
    }
});
exports.getFavoriteCount = getFavoriteCount;
const getUserFavoritesCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Favorite_1.Favorite.countDocuments({ userId });
        return count;
    }
    catch (error) {
        logger_1.logger.error('Error getting user favorites count:', error);
        throw new Error('Failed to get user favorites count');
    }
});
exports.getUserFavoritesCount = getUserFavoritesCount;
