import csv from 'csv-parser';
import fs from 'fs';
import {Property} from '../models/property.model';
import { logger } from '../utils/logger';

export const importCSV = async (filePath: string,userId: string) => {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const sanitizedData = {
                    ...data,
                    price: data.price ? Number(data.price) : null,
                    areaSqFt: data.areaSqFt ? Number(data.areaSqFt) : null,
                    bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
                    bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
                    amenities: data.amenities ? data.amenities.split('|').map((item: string) => item.trim()) : [],
                    tags:data.tags ? data.tags.split('|').map((item: string) => item.trim()) : [],
                    availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
                    isVerified: data.isVerified === 'TRUE',
                    rating: data.rating ? Number(data.rating) : null,
                    createdBy: userId,
                };
                results.push(sanitizedData);
            })
            .on('end', async () => {
                try {
                    await Property.insertMany(results,{ordered: false});
                    logger.info(`Imported ${results.length} properties`);
                    resolve(`Imported ${results.length} properties successfully`);
                } catch (error) {
                    logger.error('Error importing CSV:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                logger.error('Error reading CSV file:', error);
                reject(error);
            });
    }
    );
}