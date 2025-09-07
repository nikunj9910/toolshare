import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Validation
    if (!bookingId || !rating) {
      return res.status(400).json(new ApiResponse(400, null, 'Booking ID and rating are required'));
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json(new ApiResponse(400, null, 'Rating must be between 1 and 5'));
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is involved in this booking
    if (booking.renterId.toString() !== req.user._id.toString() && 
        booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to review this booking'));
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json(new ApiResponse(400, null, 'Can only review completed bookings'));
    }

    // Determine who is being reviewed
    const revieweeId = booking.renterId.toString() === req.user._id.toString() 
      ? booking.ownerId 
      : booking.renterId;

    // Check if review already exists
    const existingReview = await Review.findOne({
      bookingId,
      reviewerId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json(new ApiResponse(400, null, 'Review already exists for this booking'));
    }

    // Create review
    const review = await Review.create({
      bookingId,
      reviewerId: req.user._id,
      revieweeId,
      rating,
      comment: comment || ''
    });

    await review.populate([
      { path: 'reviewerId', select: 'name avatar' },
      { path: 'revieweeId', select: 'name avatar' }
    ]);

    // Update user rating
    await updateUserRating(revieweeId);

    res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ revieweeId: userId })
      .populate([
        { path: 'reviewerId', select: 'name avatar' },
        { path: 'bookingId', select: 'toolId', populate: { path: 'toolId', select: 'title' } }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ revieweeId: userId });

    res.json(new ApiResponse(200, {
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }, 'Reviews retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a tool
// @route   GET /api/reviews/tool/:toolId
// @access  Public
export const getToolReviews = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Get all bookings for this tool
    const bookings = await Booking.find({ toolId }).select('_id');
    const bookingIds = bookings.map(booking => booking._id);

    const reviews = await Review.find({ bookingId: { $in: bookingIds } })
      .populate([
        { path: 'reviewerId', select: 'name avatar' },
        { path: 'bookingId', select: 'toolId' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ bookingId: { $in: bookingIds } });

    res.json(new ApiResponse(200, {
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }, 'Tool reviews retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Helper function to update user rating
const updateUserRating = async (userId) => {
  try {
    const reviews = await Review.find({ revieweeId: userId });
    
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(userId, {
      ratingAvg: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      ratingCount: reviews.length
    });
  } catch (error) {
    console.error('Error updating user rating:', error);
  }
};
