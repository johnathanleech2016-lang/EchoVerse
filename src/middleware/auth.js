const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header (Bearer token)
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer token"

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new AppError('Token expired', 401));
        }
        return next(new AppError('Invalid token', 401));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

/**
 * Middleware to verify admin role
 * Must be used after authenticateToken
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin role required', 403));
  }

  next();
};

/**
 * Middleware to check if user owns the resource
 * Usage: checkOwnership('playerId')
 */
const checkOwnership = (resourceField) => {
  return (req, res, next) => {
    const resourceId = req.params[resourceField];
    const userId = req.user.id;

    if (resourceId !== userId) {
      return next(new AppError('Access denied. You do not own this resource', 403));
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  checkOwnership,
};
