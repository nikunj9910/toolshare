import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, 'Name, email and password are required'));
    }

    if (password.length < 6) {
      return res.status(400).json(new ApiResponse(400, null, 'Password must be at least 6 characters'));
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(new ApiResponse(400, null, 'User already exists'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      address: address || ''
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json(new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      avatar: user.avatar,
      token,
      refreshToken
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, null, 'Email and password are required'));
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, 'Invalid credentials'));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json(new ApiResponse(401, null, 'Invalid credentials'));
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json(new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      avatar: user.avatar,
      token,
      refreshToken
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(new ApiResponse(401, null, 'Refresh token is required'));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, 'Invalid refresh token'));
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json(new ApiResponse(200, {
      token: newToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success
    res.json(new ApiResponse(200, null, 'Logout successful'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(new ApiResponse(200, user, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile photo
// @route   PUT /api/auth/profile-photo
// @access  Private
export const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, null, 'No image file provided'));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }

    // Update user avatar
    user.avatar = req.file.path;
    await user.save();

    res.json(new ApiResponse(200, { avatar: user.avatar }, 'Profile photo updated successfully'));
  } catch (error) {
    next(error);
  }
};
