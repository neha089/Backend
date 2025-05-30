import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import { Property } from '../models/Property';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();

interface PropertyData {
  id: string;
  title: string;
  type: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
  tags: string;
  listingType: string;
}

const BATCH_SIZE = 100;

async function importCSV(filePath: string, userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    logger.error('Invalid user ID provided');
    throw new Error('Invalid user ID');
  }

  if (!fs.existsSync(filePath)) {
    logger.error(`CSV file not found: ${filePath}`);
    throw new Error('CSV file not found');
  }

  let batch: any[] = [];
  let totalImported = 0;
  let totalSkipped = 0;

  const session = await mongoose.startSession();

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
      try {
        // Validate required fields
        if (!row.id || !row.title || !row.type || !row.city || !row.state || !row.listingType) {
          logger.warn(`Skipping row due to missing required fields: ${JSON.stringify(row)}`);
          totalSkipped++;
          continue;
        }

        // Validate numeric fields
        const price = Number(row.price);
        const bedrooms = Number(row.bedrooms);
        const bathrooms = Number(row.bathrooms);

        if (isNaN(price) || isNaN(bedrooms) || isNaN(bathrooms)) {
          logger.warn(`Skipping row due to invalid numeric fields: ${JSON.stringify(row)}`);
          totalSkipped++;
          continue;
        }

        batch.push({
          id: row.id,
          title: row.title,
          type: row.type,
          price,
          city: row.city,
          state: row.state,
          bedrooms,
          bathrooms,
          amenities: row.amenities ? row.amenities.split(',').map((item: string) => item.trim()) : [],
          tags: row.tags ? row.tags.split(',').map((item: string) => item.trim()) : [],
          listingType: row.listingType,
          createdBy: new mongoose.Types.ObjectId(userId),
        });

        if (batch.length >= BATCH_SIZE) {
          await session.withTransaction(async () => {
            await Property.insertMany(batch, { session });
            totalImported += batch.length;
            logger.info(`Imported ${batch.length} properties, total: ${totalImported}`);
            batch = [];
          });
        }
      } catch (error) {
        logger.error(`Error processing row: ${JSON.stringify(row)}`, error);
        totalSkipped++;
      }
    }

    // Process remaining records
    if (batch.length > 0) {
      await session.withTransaction(async () => {
        await Property.insertMany(batch, { session });
        totalImported += batch.length;
        logger.info(`Imported remaining ${batch.length} properties, total: ${totalImported}`);
      });
    }

    logger.info(`CSV import completed. Total imported: ${totalImported}, Total skipped: ${totalSkipped}`);
  } catch (error) {
    logger.error('Import process failed:', error);
    throw error;
  } finally {
    session.endSession();
    process.exit(0);
  }
}

if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Usage: node dist/utils/csvImporter.js <csv_file_path> <user_id>');
    process.exit(1);
  }

  const [, , filePath, userId] = process.argv;

  import('../config/database').then(({ default: connectDB }) => {
    connectDB().then(() => importCSV(filePath, userId));
  });
}