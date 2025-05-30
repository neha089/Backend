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
exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const express_validator_1 = require("express-validator");
const favoriteService_1 = require("../services/favoriteService");
const logger_1 = require("../utils/logger");
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Validation error in addFavorite:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const favorite = yield (0, exports.addFavorite)(req.user.id, req.body.propertyId);
        res.status(201).json(favorite);
    }
    catch (error) {
        logger_1.logger.error('Error adding favorite:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.addFavorite = addFavorite;
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favorites = yield (0, exports.getFavorites)(req.user.id);
        res.json(favorites);
    }
    catch (error) {
        logger_1.logger.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getFavorites = getFavorites;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favorite = yield (0, exports.removeFavorite)(req.user.id, req.params.propertyId);
        res.json({ message: 'Favorite removed', favorite });
    }
    catch (error) {
        logger_1.logger.error('Error removing favorite:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.removeFavorite = removeFavorite;
