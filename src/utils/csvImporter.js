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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCSV = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const property_model_1 = require("../models/property.model");
const logger_1 = require("../utils/logger");
const importCSV = (filePath, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            const sanitizedData = Object.assign(Object.assign({}, data), { price: data.price ? Number(data.price) : null, areaSqFt: data.areaSqFt ? Number(data.areaSqFt) : null, bedrooms: data.bedrooms ? Number(data.bedrooms) : null, bathrooms: data.bathrooms ? Number(data.bathrooms) : null, amenities: data.amenities ? data.amenities.split('|').map((item) => item.trim()) : [], tags: data.tags ? data.tags.split('|').map((item) => item.trim()) : [], availableFrom: data.availableFrom ? new Date(data.availableFrom) : null, isVerified: data.isVerified === 'TRUE', rating: data.rating ? Number(data.rating) : null, createdBy: userId });
            results.push(sanitizedData);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield property_model_1.Property.insertMany(results, { ordered: false });
                logger_1.logger.info(`Imported ${results.length} properties`);
                resolve(`Imported ${results.length} properties successfully`);
            }
            catch (error) {
                logger_1.logger.error('Error importing CSV:', error);
                reject(error);
            }
        }))
            .on('error', (error) => {
            logger_1.logger.error('Error reading CSV file:', error);
            reject(error);
        });
    });
});
exports.importCSV = importCSV;
