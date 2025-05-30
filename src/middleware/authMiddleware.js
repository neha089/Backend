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
exports.restrictToOwner = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        logger_1.logger.warn('No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        logger_1.logger.error('Invalid token:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};
exports.authMiddleware = authMiddleware;
const restrictToOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const propertyId = req.params.id;
    const Property = require('../models/Property');
    try {
        const property = yield Property.findById(propertyId);
        if (!property) {
            logger_1.logger.warn(`Property not found: ${propertyId}`);
            return res.status(404).json({ error: 'Property not found' });
        }
        if (property.createdBy.toString() !== req.user.id) {
            logger_1.logger.warn(`Unauthorized access to property ${propertyId} by user ${req.user.id}`);
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Error in restrictToOwner:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.restrictToOwner = restrictToOwner;
