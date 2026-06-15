import { Router } from 'express';
import {
  estimateValue,
  suggestBid,
  chat,
  getRecommendations,
  getArtworkDetails,
  batchValuate,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/estimate-value', estimateValue);
router.get('/artwork-details/:id', getArtworkDetails);

// Protected routes (require authentication)
router.use(protect);

router.post('/suggest-bid', suggestBid);
router.post('/chat', chat);
router.get('/recommendations', getRecommendations);

// Admin only routes
router.post('/batch-valuate', authorize('admin'), batchValuate);

export default router;
