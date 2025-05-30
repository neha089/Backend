"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authMiddleware, [(0, express_validator_1.body)('propertyId').notEmpty().withMessage('Property ID is required')], favoriteController_1.addFavorite);
router.get('/', authMiddleware_1.authMiddleware, favoriteController_1.getFavorites);
router.delete('/:propertyId', authMiddleware_1.authMiddleware, favoriteController_1.removeFavorite);
exports.default = router;
