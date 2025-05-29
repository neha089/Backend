import express from 'express';
import { createProperty, getProperties, updateProperty, deleteProperty } from '../controllers/propertyController';
import { authMiddleware, restrictToOwner } from '../middleware/authMiddleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('id').notEmpty().withMessage('Property ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  createProperty
);

router.get('/', authMiddleware, getProperties);

router.put(
  '/:id',
  authMiddleware,
  restrictToOwner,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
  ],
  updateProperty
);

router.delete('/:id', authMiddleware, restrictToOwner, deleteProperty);

export default router;