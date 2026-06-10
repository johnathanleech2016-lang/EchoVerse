const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger utility with structured logging
const logger = {
  info: (message, data = {}) => {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...data,
    });
    console.log(logEntry);
    appendToFile('info.log', logEntry);
  },

  warn: (message, data = {}) => {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...data,
    });
    console.warn(logEntry);
    appendToFile('warn.log', logEntry);
  },

  error: (message, data = {}) => {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      ...data,
    });
    console.error(logEntry);
    appendToFile('error.log', logEntry);
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        message,
        ...data,
      });
      console.log(logEntry);
    }
  },
};

// Helper function to append logs to file
const appendToFile = (filename, content) => {
  if (process.env.LOG_TO_FILE === 'true') {
    const logPath = path.join(logsDir, filename);
    fs.appendFile(logPath, content + '\n', (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  }
};

// Logging middleware for Express
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      ip,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent,
    });
  });

  next();
};

module.exports = {
  logger,
  loggerMiddleware,
};
