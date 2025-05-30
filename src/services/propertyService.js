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
exports.deleteProperty = exports.updateProperty = exports.getProperties = exports.createProperty = void 0;
const Property_1 = require("../models/Property");
const logger_1 = require("../../utils/logger");
const redisClient_1 = require("../../utils/redisClient");
const createProperty = (propertyData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = new Property_1.Property(Object.assign(Object.assign({}, propertyData), { createdBy: userId }));
        yield property.save();
        logger_1.logger.info(`Property created successfully: ${property.id}`);
        return property;
    }
    catch (error) {
        logger_1.logger.error('Error creating property:', error);
        throw new Error('Property creation failed');
    }
});
exports.createProperty = createProperty;
const getProperties = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `properties:${JSON.stringify(query)}`;
    try {
        const cachedData = yield redisClient_1.redisClient.get(cacheKey);
        if (cachedData) {
            logger_1.logger.info(`Cache hit for key: ${cacheKey}`);
            return JSON.parse(cachedData);
        }
        const mongoQuery = {};
        if (query.price)
            mongoQuery.price = { $gte: Number(query.price) };
        if (query.city)
            mongoQuery.city = new RegExp(query.city, 'i');
        if (query.state)
            mongoQuery.state = new RegExp(query.state, 'i');
        if (query.type)
            mongoQuery.type = query.type;
        if (query.bedrooms)
            mongoQuery.bedrooms = Number(query.bedrooms);
        if (query.bathrooms)
            mongoQuery.bathrooms = Number(query.bathrooms);
        if (query.areaSqFt)
            mongoQuery.areaSqFt = { $gte: Number(query.areaSqFt) };
        if (query.amenities)
            mongoQuery.amenities = { $all: query.amenities.split(',') };
        if (query.tags)
            mongoQuery.tags = { $all: query.tags.split(',') };
        if (query.furnished)
            mongoQuery.furnished = query.furnished;
        if (query.listingType)
            mongoQuery.listingType = query.listingType;
        if (query.isVerified)
            mongoQuery.isVerified = query.isVerified === 'true';
        const properties = yield Property_1.Property.find(mongoQuery);
        yield redisClient_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(properties));
        logger_1.logger.info(`Properties fetched and cached: ${properties.length}`);
        return properties;
    }
    catch (error) {
        logger_1.logger.error('Error fetching properties:', error);
        throw error;
    }
});
exports.getProperties = getProperties;
const updateProperty = (id, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield Property_1.Property.findOneAndUpdate({ _id: id, createdBy: userId }, { $set: data }, { new: true });
        if (!property) {
            logger_1.logger.warn(`Property not found or unauthorized: ${id}`);
            throw new Error('Property not found or unauthorized');
        }
        logger_1.logger.info(`Property updated: ${id}`);
        return property;
    }
    catch (error) {
        logger_1.logger.error('Error updating property:', error);
        throw error;
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield Property_1.Property.findOneAndDelete({ _id: id, createdBy: userId });
        if (!property) {
            logger_1.logger.warn(`Property not found or unauthorized: ${id}`);
            throw new Error('Property not found or unauthorized');
        }
        logger_1.logger.info(`Property deleted: ${id}`);
        return property;
    }
    catch (error) {
        logger_1.logger.error('Error deleting property:', error);
        throw error;
    }
});
exports.deleteProperty = deleteProperty;
