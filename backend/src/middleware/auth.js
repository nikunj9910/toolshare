import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, no token'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json(new ApiResponse(401, null, 'Not authorized, user not found'));
    }
    next();
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, null, 'Not authorized, token failed'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiResponse(401, null, 'Not authorized'));
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized to access this route'));
    }
    next();
  };
};