"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('recipientEmail').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('propertyId').notEmpty().withMessage('Property ID is required'),
], recommendationController_1.recommendProperty);
router.get('/', authMiddleware_1.authMiddleware, recommendationController_1.getRecommendations);
router.get('/search', authMiddleware_1.authMiddleware, recommendationController_1.searchUsers);
exports.default = router;
