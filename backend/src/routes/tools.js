import express from 'express';
import Tool from '../models/Tool.js';
import { protect } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

const storage = new CloudinaryStorage({cloudinary, params:{folder:'tools'}});
const upload = multer({storage});

// CREATE
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  const {name, description, pricePerDay, category, condition} = req.body;
  const tool = await Tool.create({
    owner: req.user._id,
    name, description, pricePerDay, category, condition,
    images: req.files.map(f=>f.path)
  });
  res.status(201).json(tool);
});

// LIST (with basic filters)
router.get('/', async (req, res) => {
  const {category, lat, lng, maxDistance=20} = req.query;
  const filter = category ? {category} : {};
  if (lat && lng) {
    filter.location = {
     $near:{$geometry:{type:'Point',coordinates:[lng,lat]},$maxDistance:maxDistance*1000}
    };
  }
  const tools = await Tool.find(filter).populate('owner','name avatar isVerified').lean();
  res.json(tools);
});

// SINGLE
router.get('/:id', async (req, res) => {
  const tool = await Tool.findById(req.params.id).populate('owner','name avatar isVerified');
  if (!tool) return res.status(404).json({msg:'Tool not found'});
  res.json(tool);
});

export default router;