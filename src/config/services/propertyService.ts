import { Property } from "../models/Property";
import { logger } from "../../utils/logger";
import { redisClient } from "../../utils/redisClient";

export const createProperty = async (propertyData: any , userId: string) => {
    try {
        const property = new Property({
            ...propertyData,
            createdBy: userId,
        });
        await property.save();
        logger.info(`Property created successfully: ${property.id}`);
        return property;
    } catch (error) {
        logger.error('Error creating property:', error);
        throw new Error('Property creation failed');
    }
}
export const getProperties = async (query: any) => {
  const cacheKey = `properties:${JSON.stringify(query)}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
    const mongoQuery: any = {};
    if (query.price) mongoQuery.price = { $gte: Number(query.price) };
    if (query.city) mongoQuery.city = new RegExp(query.city, 'i');
    if (query.state) mongoQuery.state = new RegExp(query.state, 'i');
    if (query.type) mongoQuery.type = query.type;
    if (query.bedrooms) mongoQuery.bedrooms = Number(query.bedrooms);
    if (query.bathrooms) mongoQuery.bathrooms = Number(query.bathrooms);
    if (query.areaSqFt) mongoQuery.areaSqFt = { $gte: Number(query.areaSqFt) };
    if (query.amenities) mongoQuery.amenities = { $all: query.amenities.split(',') };
    if (query.tags) mongoQuery.tags = { $all: query.tags.split(',') };
    if (query.furnished) mongoQuery.furnished = query.furnished;
    if (query.listingType) mongoQuery.listingType = query.listingType;
    if (query.isVerified) mongoQuery.isVerified = query.isVerified === 'true';
    const properties = await Property.find(mongoQuery);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(properties));
    logger.info(`Properties fetched and cached: ${properties.length}`);
    return properties;
  } catch (error) {
    logger.error('Error fetching properties:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, data: any, userId: string) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: data },
      { new: true }
    );
    if (!property) {
      logger.warn(`Property not found or unauthorized: ${id}`);
      throw new Error('Property not found or unauthorized');
    }
    logger.info(`Property updated: ${id}`);
    return property;
  } catch (error) {
    logger.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id: string, userId: string) => {
  try {
    const property = await Property.findOneAndDelete({ _id: id, createdBy: userId });
    if (!property) {
      logger.warn(`Property not found or unauthorized: ${id}`);
      throw new Error('Property not found or unauthorized');
    }
    logger.info(`Property deleted: ${id}`);
    return property;
  } catch (error) {
    logger.error('Error deleting property:', error);
    throw error;
  }
};