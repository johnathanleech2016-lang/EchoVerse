const { AppError } = require('../utils/errors');

/**
 * Middleware to validate request body against schema
 * Usage: validate(schema)
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(`Validation error: ${messages.join(', ')}`, 400));
    }

    req.body = value;
    next();
  };
};

/**
 * Middleware to validate request parameters
 * Usage: validateParams(schema)
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(`Parameter validation error: ${messages.join(', ')}`, 400));
    }

    req.params = value;
    next();
  };
};

/**
 * Middleware to validate query parameters
 * Usage: validateQuery(schema)
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(`Query validation error: ${messages.join(', ')}`, 400));
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validate,
  validateParams,
  validateQuery,
};
