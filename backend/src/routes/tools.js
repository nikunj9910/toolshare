import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getTools, 
  getTool, 
  createTool, 
  updateTool, 
  deleteTool, 
  getMyTools, 
  checkAvailability 
} from '../controllers/tool.controller.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'tools' } });
const upload = multer({ storage });

// Public routes
router.get('/', getTools);

// Protected routes
router.get('/my', protect, getMyTools);
router.post('/', protect, upload.array('images', 5), createTool);

// Routes with parameters (must come after specific routes)
router.get('/:id', getTool);
router.get('/:id/availability', checkAvailability);
router.put('/:id', protect, upload.array('images', 5), updateTool);
router.delete('/:id', protect, deleteTool);

export default router;