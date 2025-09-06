import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// SEND
router.post('/', protect, async (req, res) => {
  const msg = await Message.create({
    booking: req.body.bookingId,
    sender: req.user._id,
    text: req.body.text
  });
  req.io.to(req.body.bookingId).emit('newMessage', msg);  // sockets wired in server.js
  res.status(201).json(msg);
});

// LIST BY BOOKING
router.get('/:bookingId', protect, async (req, res) => {
  const msgs = await Message.find({booking:req.params.bookingId}).populate('sender','name avatar');
  res.json(msgs);
});
export default router;