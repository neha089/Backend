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
exports.searchUsers = exports.getRecommendations = exports.recommendProperty = void 0;
const Recommendation_1 = require("../models/Recommendation");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const Property_1 = require("../models/Property");
const redisClient_1 = require("../utils/redisClient");
const recommendProperty = (senderId, propertyId, recipientEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the recipient exists
        const recipient = yield User_1.User.findOne({ email: recipientEmail });
        if (!recipient) {
            logger_1.logger.warn(`Recipient with email ${recipientEmail} not found`);
            throw new Error('Recipient not found');
        }
        // Check if the property exists
        const property = yield Property_1.Property.findById(propertyId);
        if (!property) {
            logger_1.logger.warn(`Property with ID ${propertyId} not found`);
            throw new Error('Property not found');
        }
        // Create a new recommendation
        const recommendation = new Recommendation_1.Recommendation({
            senderId,
            propertyId: property.id,
            recipientId: recipient.id,
        });
        yield recommendation.save();
        yield redisClient_1.redisClient.del(`recommendations:${recipient._id}`);
        logger_1.logger.info(`Recommendation sent: from ${senderId} to ${recipient._id} for property ${propertyId}`);
        return recommendation;
    }
    catch (error) {
        logger_1.logger.error('Error recommending property:', error);
        throw error;
    }
});
exports.recommendProperty = recommendProperty;
const getRecommendations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `recommendations:${userId}`;
    try {
        const cachedData = yield redisClient_1.redisClient.get(cacheKey);
        if (cachedData) {
            logger_1.logger.info(`Cache hit for key: ${cacheKey}`);
            return JSON.parse(cachedData);
        }
        const recommendations = yield Recommendation_1.Recommendation.find({ recipientId: userId }).populate('senderId', 'name email')
            .populate('propertyId');
        ;
        yield redisClient_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(recommendations));
        logger_1.logger.info(`Recommendations fetched and cached for user ${userId}: ${recommendations.length}`);
        return recommendations;
    }
    catch (error) {
        logger_1.logger.error('Error fetching recommendations:', error);
        throw error;
    }
});
exports.getRecommendations = getRecommendations;
const searchUsers = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `user-search:${email}`;
    try {
        const cachedData = yield redisClient_1.redisClient.get(cacheKey);
        if (cachedData) {
            logger_1.logger.info(`Cache hit for user search: ${email}`);
            return JSON.parse(cachedData);
        }
        const users = yield User_1.User.find({ email: new RegExp(email, 'i') }, 'name email');
        yield redisClient_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(users));
        logger_1.logger.info(`Users searched and cached: ${users.length} for email ${email}`);
        return users;
    }
    catch (error) {
        logger_1.logger.error('Error searching users:', error);
        throw error;
    }
});
exports.searchUsers = searchUsers;
