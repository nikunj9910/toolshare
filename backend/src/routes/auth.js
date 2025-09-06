import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  const exists = await User.findOne({email});
  if (exists) return res.status(400).json({msg:'User exists'});
  const user = await User.create({name, email, password});
  res.status(201).json({_id:user._id, name, email, token:genToken(user._id)});
});

// LOGIN
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (user && (await user.matchPassword(password))) {
    res.json({_id:user._id, name:user.name, email, token:genToken(user._id)});
  } else {
    res.status(401).json({msg:'Invalid creds'});
  }
});

// GET ME
router.get('/me', protect, async (req, res) => res.json(req.user));

const genToken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'30d'});
export default router;