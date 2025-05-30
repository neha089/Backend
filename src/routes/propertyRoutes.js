"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('id').notEmpty().withMessage('Property ID is required'),
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('type').notEmpty().withMessage('Type is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
], propertyController_1.createProperty);
router.get('/', authMiddleware_1.authMiddleware, propertyController_1.getProperties);
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.restrictToOwner, [
    (0, express_validator_1.body)('title').optional().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('price').optional().isNumeric().withMessage('Price must be a number'),
], propertyController_1.updateProperty);
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.restrictToOwner, propertyController_1.deleteProperty);
exports.default = router;
