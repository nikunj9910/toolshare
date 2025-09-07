import express from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, refresh, logout, getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getProfile);

export default router;