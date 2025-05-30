import { Router } from 'express';
import { createPropertyHandler, getPropertiesHandler, updatePropertyHandler, deletePropertyHandler } from '../controllers/propertyController';
import { authMiddleware, restrictToOwner } from '../middleware/authMiddleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/',
  authMiddleware,
  [
    check('id').notEmpty().withMessage('Property ID is required'),
    check('title').notEmpty().withMessage('Title is required'),
    check('type').notEmpty().withMessage('Type is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
  ],
  createPropertyHandler
);

router.get('/', authMiddleware, getPropertiesHandler);

router.put(
  '/:id',
  authMiddleware,
  restrictToOwner,
  [check('price').optional().isNumeric().withMessage('Price must be a number')],
  updatePropertyHandler
);

router.delete('/:id', authMiddleware, restrictToOwner, deletePropertyHandler);

export default router;