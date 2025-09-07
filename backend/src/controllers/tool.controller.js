import Tool from '../models/Tool.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get all tools with search and filters
// @route   GET /api/tools
// @access  Public
export const getTools = async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      lat, 
      lng, 
      maxDistance = 20, 
      minPrice, 
      maxPrice,
      page = 1,
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = {};

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price filters
    if (minPrice || maxPrice) {
      filter['price.daily'] = {};
      if (minPrice) filter['price.daily'].$gte = Number(minPrice);
      if (maxPrice) filter['price.daily'].$lte = Number(maxPrice);
    }

    // Location filter
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(maxDistance) * 1000 // Convert km to meters
        }
      };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const tools = await Tool.find(filter)
      .populate('ownerId', 'name avatar ratingAvg ratingCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Tool.countDocuments(filter);

    res.json(new ApiResponse(200, {
      tools,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }, 'Tools retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tool
// @route   GET /api/tools/:id
// @access  Public
export const getTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('ownerId', 'name avatar ratingAvg ratingCount address');

    if (!tool) {
      return res.status(404).json(new ApiResponse(404, null, 'Tool not found'));
    }

    res.json(new ApiResponse(200, tool, 'Tool retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tool
// @route   POST /api/tools
// @access  Private
export const createTool = async (req, res, next) => {
  try {

    const {
      title,
      description,
      category,
      priceHourly,
      priceDaily,
      deposit,
      location
    } = req.body;

    // Validation
    if (!title || !description || !priceDaily) {
      return res.status(400).json(new ApiResponse(400, null, 'Title, description and daily price are required'));
    }

    if (priceDaily <= 0) {
      return res.status(400).json(new ApiResponse(400, null, 'Daily price must be greater than 0'));
    }

    // Create tool
    const tool = await Tool.create({
      ownerId: req.user._id,
      title,
      description,
      category: category || 'Other',
      price: {
        hourly: Number(priceHourly) || 0,
        daily: Number(priceDaily)
      },
      deposit: Number(deposit) || 0,
      location: location || { type: 'Point', coordinates: [0, 0] },
      images: req.files ? req.files.map(file => file.path) : []
    });

    await tool.populate('ownerId', 'name avatar ratingAvg ratingCount');

    console.log('createTool - created tool:', tool);
    res.status(201).json(new ApiResponse(201, tool, 'Tool created successfully'));
  } catch (error) {
    console.error('createTool - error:', error);
    next(error);
  }
};

// @desc    Update tool
// @route   PUT /api/tools/:id
// @access  Private
export const updateTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json(new ApiResponse(404, null, 'Tool not found'));
    }

    // Check ownership
    if (tool.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to update this tool'));
    }

    const {
      title,
      description,
      category,
      priceHourly,
      priceDaily,
      deposit,
      location,
      isAvailable
    } = req.body;

    // Update fields
    if (title) tool.title = title;
    if (description) tool.description = description;
    if (category) tool.category = category;
    if (priceHourly !== undefined) tool.price.hourly = Number(priceHourly);
    if (priceDaily !== undefined) tool.price.daily = Number(priceDaily);
    if (deposit !== undefined) tool.deposit = Number(deposit);
    if (location) tool.location = location;
    if (isAvailable !== undefined) tool.availability.isAvailable = isAvailable;

    // Handle new images
    if (req.files && req.files.length > 0) {
      tool.images = [...tool.images, ...req.files.map(file => file.path)];
    }

    await tool.save();
    await tool.populate('ownerId', 'name avatar ratingAvg ratingCount');

    res.json(new ApiResponse(200, tool, 'Tool updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tool
// @route   DELETE /api/tools/:id
// @access  Private
export const deleteTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json(new ApiResponse(404, null, 'Tool not found'));
    }

    // Check ownership
    if (tool.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to delete this tool'));
    }

    await Tool.findByIdAndDelete(req.params.id);

    res.json(new ApiResponse(200, null, 'Tool deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tools
// @route   GET /api/tools/my
// @access  Private
export const getMyTools = async (req, res, next) => {
  try {
    const tools = await Tool.find({ ownerId: req.user._id })
      .populate('ownerId', 'name avatar ratingAvg ratingCount')
      .sort({ createdAt: -1 });

    res.json(new ApiResponse(200, tools, 'User tools retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Check tool availability
// @route   GET /api/tools/:id/availability
// @access  Public
export const checkAvailability = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json(new ApiResponse(400, null, 'Start and end dates are required'));
    }

    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json(new ApiResponse(404, null, 'Tool not found'));
    }

    // Check if tool is available
    if (!tool.availability.isAvailable) {
      return res.json(new ApiResponse(200, { available: false, reason: 'Tool is not available' }, 'Availability checked'));
    }

    // Check for conflicts with unavailable dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    const hasConflict = tool.availability.unavailableDates.some(period => {
      return (startDate <= period.to && endDate >= period.from);
    });

    res.json(new ApiResponse(200, { 
      available: !hasConflict,
      reason: hasConflict ? 'Tool is unavailable for the selected dates' : 'Tool is available'
    }, 'Availability checked'));
  } catch (error) {
    next(error);
  }
};
