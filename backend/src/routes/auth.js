import express from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, refresh, logout, getProfile, updateProfilePhoto } from '../controllers/auth.controller.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure multer for profile photo upload
const storage = new CloudinaryStorage({ 
  cloudinary, 
  params: { folder: 'profiles' } 
});
const upload = multer({ storage });

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getProfile);
router.put('/profile-photo', protect, upload.single('avatar'), updateProfilePhoto);

export default router;