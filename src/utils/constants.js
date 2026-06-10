/**
 * Application-wide constants
 */

// Player statuses
const PLAYER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  AWAY: 'away',
  OFFLINE: 'offline',
};

// Message types
const MESSAGE_TYPE = {
  GLOBAL: 'global',
  LOCAL: 'local',
  PRIVATE: 'private',
  SYSTEM: 'system',
};

// Entity actions
const ENTITY_ACTIONS = {
  PICKUP: 'pickup',
  USE: 'use',
  EXAMINE: 'examine',
  TALK: 'talk',
  ATTACK: 'attack',
};

// User roles
const USER_ROLE = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

// API response messages
const API_MESSAGES = {
  SUCCESS: 'Success',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMITED: 'Too many requests',
  SERVER_ERROR: 'Internal server error',
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_LIMIT: 50,
  DEFAULT_SKIP: 0,
  MAX_LIMIT: 100,
};

// World defaults
const WORLD_DEFAULTS = {
  WIDTH: 1000,
  HEIGHT: 500,
  DEPTH: 1000,
  DEFAULT_WEATHER: 'sunny',
  DEFAULT_TIME_OF_DAY: 12,
};

// Detection radius for nearby players (in world units)
const DETECTION_RADIUS = {
  DEFAULT: 100,
  MIN: 10,
  MAX: 500,
};

module.exports = {
  PLAYER_STATUS,
  MESSAGE_TYPE,
  ENTITY_ACTIONS,
  USER_ROLE,
  API_MESSAGES,
  HTTP_STATUS,
  PAGINATION,
  WORLD_DEFAULTS,
  DETECTION_RADIUS,
};
