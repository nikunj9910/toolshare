import express from 'express';
import Booking from '../models/Booking.js';
import Tool from '../models/Tool.js';
import stripe from '../config/stripe.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// REQUEST TO RENT
router.post('/', protect, async (req, res) => {
  const {toolId, from, to} = req.body;
  const tool = await Tool.findById(toolId);
  if (!tool) return res.status(404).json({msg:'Tool not found'});
  const days = Math.ceil((new Date(to) - new Date(from))/(1000*60*60*24));
  const totalPrice = tool.pricePerDay * days;

  const booking = await Booking.create({
    tool:toolId, borrower:req.user._id, from, to, totalPrice
  });
  res.status(201).json(booking);
});

// ACCEPT + CREATE PAYMENT INTENT (owner clicks accept)
router.put('/:id/accept', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('tool owner');
  if (booking.tool.owner.toString() !== req.user._id) return res.status(401).json({msg:'Not your tool'});
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.totalPrice * 100,
    currency: 'usd',
    metadata: {bookingId: booking._id.toString()}
  });
  booking.paymentIntentId = paymentIntent.client_secret;
  booking.status = 'accepted';
  await booking.save();
  res.json({clientSecret: paymentIntent.client_secret});
});

// CONFIRM PAYMENT (front-end calls after stripe elements)
router.post('/:id/confirm', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const intent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
  if (intent.status === 'succeeded') {
    booking.status = 'paid';
    await booking.save();
    return res.json({msg:'Payment complete'});
  }
  res.status(400).json({msg:'Payment failed'});
});

// LIST MY BOOKINGS
router.get('/my', protect, async (req, res) => {
  const asBorrower = await Booking.find({borrower:req.user._id}).populate('tool');
  const asOwner = await Booking.find({}).populate({path:'tool', match:{owner:req.user._id}});
  res.json({asBorrower, asOwner: asOwner.filter(b=>b.tool)});
});

export default router;