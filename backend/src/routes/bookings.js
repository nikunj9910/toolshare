import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createBooking, 
  getMyBookings, 
  getBooking, 
  approveBooking, 
  declineBooking, 
  cancelBooking, 
  markReturned 
} from '../controllers/booking.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/approve', approveBooking);
router.put('/:id/decline', declineBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/return', markReturned);

export default router;