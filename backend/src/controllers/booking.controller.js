import Booking from '../models/Booking.js';
import Tool from '../models/Tool.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { toolId, start, end } = req.body;

    // Validation
    if (!toolId || !start || !end) {
      return res.status(400).json(new ApiResponse(400, null, 'Tool ID, start date and end date are required'));
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return res.status(400).json(new ApiResponse(400, null, 'End date must be after start date'));
    }

    if (startDate < new Date()) {
      return res.status(400).json(new ApiResponse(400, null, 'Start date cannot be in the past'));
    }

    // Get tool
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json(new ApiResponse(404, null, 'Tool not found'));
    }

    // Check if user is trying to book their own tool
    if (tool.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json(new ApiResponse(400, null, 'Cannot book your own tool'));
    }

    // Check tool availability
    if (!tool.availability.isAvailable) {
      return res.status(400).json(new ApiResponse(400, null, 'Tool is not available'));
    }

    // Check for date conflicts
    const hasConflict = tool.availability.unavailableDates.some(period => {
      return (startDate <= period.to && endDate >= period.from);
    });

    if (hasConflict) {
      return res.status(400).json(new ApiResponse(400, null, 'Tool is unavailable for the selected dates'));
    }

    // Calculate pricing
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = tool.price.daily * days;

    // Create booking
    const booking = await Booking.create({
      toolId,
      renterId: req.user._id,
      ownerId: tool.ownerId,
      start: startDate,
      end: endDate,
      pricing: {
        hourly: tool.price.hourly,
        daily: tool.price.daily,
        total: totalPrice
      },
      deposit: tool.deposit
    });

    await booking.populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name email avatar' },
      { path: 'ownerId', select: 'name email avatar' }
    ]);

    res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const asRenter = await Booking.find({ renterId: req.user._id })
      .populate([
        { path: 'toolId', select: 'title images price' },
        { path: 'ownerId', select: 'name avatar' }
      ])
      .sort({ createdAt: -1 });

    const asOwner = await Booking.find({ ownerId: req.user._id })
      .populate([
        { path: 'toolId', select: 'title images price' },
        { path: 'renterId', select: 'name avatar' }
      ])
      .sort({ createdAt: -1 });

    res.json(new ApiResponse(200, {
      asRenter,
      asOwner
    }, 'Bookings retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate([
        { path: 'toolId' },
        { path: 'renterId', select: 'name email avatar' },
        { path: 'ownerId', select: 'name email avatar' }
      ]);

    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is involved in this booking
    if (booking.renterId._id.toString() !== req.user._id.toString() && 
        booking.ownerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to view this booking'));
    }

    res.json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Approve booking
// @route   PUT /api/bookings/:id/approve
// @access  Private
export const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is the owner
    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to approve this booking'));
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json(new ApiResponse(400, null, 'Booking is not in pending status'));
    }

    booking.status = 'approved';
    await booking.save();

    await booking.populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name email avatar' },
      { path: 'ownerId', select: 'name email avatar' }
    ]);

    res.json(new ApiResponse(200, booking, 'Booking approved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Decline booking
// @route   PUT /api/bookings/:id/decline
// @access  Private
export const declineBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is the owner
    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to decline this booking'));
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json(new ApiResponse(400, null, 'Booking is not in pending status'));
    }

    booking.status = 'declined';
    await booking.save();

    await booking.populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name email avatar' },
      { path: 'ownerId', select: 'name email avatar' }
    ]);

    res.json(new ApiResponse(200, booking, 'Booking declined successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is involved in this booking
    if (booking.renterId.toString() !== req.user._id.toString() && 
        booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to cancel this booking'));
    }

    // Check if booking can be cancelled
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json(new ApiResponse(400, null, 'Booking cannot be cancelled'));
    }

    booking.status = 'cancelled';
    await booking.save();

    await booking.populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name email avatar' },
      { path: 'ownerId', select: 'name email avatar' }
    ]);

    res.json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark booking as returned
// @route   PUT /api/bookings/:id/return
// @access  Private
export const markReturned = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json(new ApiResponse(404, null, 'Booking not found'));
    }

    // Check if user is the owner
    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to mark this booking as returned'));
    }

    // Check if booking is active
    if (booking.status !== 'active') {
      return res.status(400).json(new ApiResponse(400, null, 'Booking is not active'));
    }

    booking.status = 'completed';
    await booking.save();

    await booking.populate([
      { path: 'toolId', select: 'title images' },
      { path: 'renterId', select: 'name email avatar' },
      { path: 'ownerId', select: 'name email avatar' }
    ]);

    res.json(new ApiResponse(200, booking, 'Booking marked as returned successfully'));
  } catch (error) {
    next(error);
  }
};
