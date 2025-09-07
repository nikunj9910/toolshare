import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendMessage, getMessages, getConversations } from '../controllers/message.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/booking/:bookingId', getMessages);

export default router;