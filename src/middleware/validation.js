const { AppError } = require('../utils/errors');

// Validate movement request
exports.validateMovement = (req, res, next) => {
  const { position } = req.body;

  if (!position) {
    return next(new AppError('Position is required', 400));
  }

  if (!position.x || !position.y || !position.z) {
    return next(new AppError('Position must include x, y, z coordinates', 400));
  }

  if (typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') {
    return next(new AppError('Coordinates must be numbers', 400));
  }

  next();
};

// Validate message request
exports.validateMessage = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError('Message content is required', 400));
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return next(new AppError('Message must be non-empty text', 400));
  }

  if (content.length > 1000) {
    return next(new AppError('Message exceeds 1000 character limit', 400));
  }

  next();
};

// Validate interaction request
exports.validateInteraction = (req, res, next) => {
  const { action } = req.body;

  if (!action) {
    return next(new AppError('Action is required', 400));
  }

  const validActions = ['pickup', 'use', 'examine', 'talk', 'attack'];
  if (!validActions.includes(action)) {
    return next(new AppError(`Action must be one of: ${validActions.join(', ')}`, 400));
  }

  next();
};

module.exports = exports;
