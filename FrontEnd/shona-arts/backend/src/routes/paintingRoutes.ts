import { Router } from 'express';
import { createPainting, deletePainting, getPainting, getPaintings, getRecommendations, updatePainting } from '../controllers/paintingController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paintingCreateValidation, paintingQueryValidation } from '../validations/paintingValidation.js';

export const paintingRoutes = Router();

paintingRoutes.get('/', paintingQueryValidation, validate, getPaintings);
paintingRoutes.get('/recommendations/ai', getRecommendations);
paintingRoutes.get('/:id', getPainting);
paintingRoutes.post('/', protect, authorize('admin'), paintingCreateValidation, validate, createPainting);
paintingRoutes.patch('/:id', protect, authorize('admin'), updatePainting);
paintingRoutes.delete('/:id', protect, authorize('admin'), deletePainting);
