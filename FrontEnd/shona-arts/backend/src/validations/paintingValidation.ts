import { body, query } from 'express-validator';

export const paintingCreateValidation = [
  body('title').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isNumeric(),
  body('image').isURL(),
  body('stock').optional().isInt({ min: 0 }),
];

export const paintingQueryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
];
