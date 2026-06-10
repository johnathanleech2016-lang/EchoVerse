const path = require('path');
const fs = require('fs');

/**
 * Validate that all required environment variables are set
 */
const validateEnvironment = () => {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'CORS_ORIGIN',
    'JWT_SECRET',
    'DATABASE_URL',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('📋 Check your .env file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

/**
 * Verify that critical directories exist
 */
const verifyDirectories = () => {
  const dirs = [
    path.join(__dirname, '../../public'),
    path.join(__dirname, '../../logs'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️  Directory not found, creating: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Check for public/index.html
  const indexPath = path.join(__dirname, '../../public/index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn(`⚠️  public/index.html not found at ${indexPath}`);
  }
};

/**
 * Get environment configuration
 */
const getConfig = () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    jwtExpiry: process.env.JWT_EXPIRY || '7d',
    logToFile: process.env.LOG_TO_FILE === 'true',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
};

module.exports = {
  validateEnvironment,
  verifyDirectories,
  getConfig,
};
