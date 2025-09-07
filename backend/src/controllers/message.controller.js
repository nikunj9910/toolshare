import Message from '../models/Message.js';
import Booking from '../models/Booking.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { bookingId, body } = req.body;

    // Validation
    if (!bookingId || !body) {
      return res.status(400).json(new ApiResponse(400, null, 'Booking ID and message body are required'));
    }

    if (body.length > 1000) {
      return res.status(400).json(new ApiResponse(400, null, 'Message is too long (max 1000 characters)'));
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is involved in this booking
    if (booking.renterId.toString() !== req.user._id.toString() && 
        booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to send messages for this booking'));
    }

    // Determine recipient
    const toUserId = booking.renterId.toString() === req.user._id.toString() 
      ? booking.ownerId 
      : booking.renterId;

    // Create message
    const message = await Message.create({
      bookingId,
      fromUserId: req.user._id,
      toUserId,
      body
    });

    await message.populate([
      { path: 'fromUserId', select: 'name avatar' },
      { path: 'toUserId', select: 'name avatar' }
    ]);

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      io.to(bookingId.toString()).emit('newMessage', message);
    }

    res.status(201).json(new ApiResponse(201, message, 'Message sent successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a booking
// @route   GET /api/messages/booking/:bookingId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is involved in this booking
    if (booking.renterId.toString() !== req.user._id.toString() && 
        booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to view messages for this booking'));
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({ bookingId })
      .populate([
        { path: 'fromUserId', select: 'name avatar' },
        { path: 'toUserId', select: 'name avatar' }
      ])
      .sort({ createdAt: 1 }) // Oldest first for chat
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ bookingId });

    res.json(new ApiResponse(200, {
      messages,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }, 'Messages retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    // Get all bookings where user is involved
    const bookings = await Booking.find({
      $or: [
        { renterId: req.user._id },
        { ownerId: req.user._id }
      ]
    })
    .populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name avatar' },
      { path: 'ownerId', select: 'name avatar' }
    ])
    .sort({ updatedAt: -1 });

    // Get latest message for each booking
    const conversations = await Promise.all(
      bookings.map(async (booking) => {
        const latestMessage = await Message.findOne({ bookingId: booking._id })
          .populate('fromUserId', 'name avatar')
          .sort({ createdAt: -1 });

        return {
          booking,
          latestMessage,
          unreadCount: await Message.countDocuments({
            bookingId: booking._id,
            toUserId: req.user._id,
            createdAt: { $gt: req.user.lastMessageRead || new Date(0) }
          })
        };
      })
    );

    res.json(new ApiResponse(200, conversations, 'Conversations retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
