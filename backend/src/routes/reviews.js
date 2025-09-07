import express from 'express';
import { protect } from '../middleware/auth.js';
import { createReview, getUserReviews, getToolReviews } from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/user/:userId', getUserReviews);
router.get('/tool/:toolId', getToolReviews);

// Protected routes
router.post('/', protect, createReview);

export default router;
