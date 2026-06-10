/**
 * Utility helper functions
 */

/**
 * Generate a unique ID
 */
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate distance between two 3D points
 */
const calculateDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  const dz = point1.z - point2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Check if a point is within a radius of another point
 */
const isWithinRadius = (center, point, radius) => {
  return calculateDistance(center, point) <= radius;
};

/**
 * Validate position coordinates
 */
const isValidPosition = (position, worldDimensions) => {
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') {
    return false;
  }

  if (worldDimensions) {
    const { width, height, depth } = worldDimensions;
    return (
      position.x >= 0 && position.x <= width &&
      position.y >= 0 && position.y <= height &&
      position.z >= 0 && position.z <= depth
    );
  }

  return true;
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
};

/**
 * Format timestamp
 */
const formatTimestamp = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Sleep/delay helper (for testing/debugging)
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Chunk an array into smaller arrays
 */
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

module.exports = {
  generateId,
  calculateDistance,
  isWithinRadius,
  isValidPosition,
  sanitizeString,
  formatTimestamp,
  sleep,
  chunkArray,
};
