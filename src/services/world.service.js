const Player = require('../models/Player');
const World = require('../models/World');

// Check if position is within world bounds
exports.isPositionValid = (position, dimensions) => {
  return (
    position.x >= 0 && position.x <= dimensions.width &&
    position.y >= 0 && position.y <= dimensions.height &&
    position.z >= 0 && position.z <= dimensions.depth
  );
};

// Calculate distance between two positions
exports.calculateDistance = (pos1, pos2) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Update world weather
exports.updateWeather = async (worldId, weatherData) => {
  const world = await World.findByIdAndUpdate(
    worldId,
    { weather: weatherData, updatedAt: new Date() },
    { new: true }
  );
  return world;
};

// Update time of day
exports.updateTimeOfDay = async (worldId, timeOfDay) => {
  const world = await World.findByIdAndUpdate(
    worldId,
    { timeOfDay, updatedAt: new Date() },
    { new: true }
  );
  return world;
};

// Spawn entity in world
exports.spawnEntity = async (worldId, entityData) => {
  const world = await World.findById(worldId);
  if (!world) throw new Error('World not found');

  const newEntity = {
    ...entityData,
    worldId,
    createdAt: new Date(),
  };

  world.entities.push(newEntity);
  await world.save();
  return newEntity;
};

// Remove entity from world
exports.removeEntity = async (worldId, entityId) => {
  const world = await World.findById(worldId);
  if (!world) throw new Error('World not found');

  world.entities = world.entities.filter(e => e._id.toString() !== entityId);
  await world.save();
};

// Handle entity interaction
exports.interactWithEntity = async (entityId, playerId, action) => {
  const player = await Player.findById(playerId);
  if (!player) throw new Error('Player not found');

  // Define interaction results based on action type
  const interactions = {
    pickup: { success: true, message: 'Item picked up', xp: 10 },
    use: { success: true, message: 'Item used', xp: 5 },
    examine: { success: true, message: 'Item examined', xp: 0 },
    talk: { success: true, message: 'Dialog started', xp: 15 },
    attack: { success: Math.random() > 0.3, message: 'Attack resolved', xp: 25 },
  };

  const result = interactions[action] || { success: false, message: 'Unknown action' };

  // Award XP if successful
  if (result.success && result.xp > 0) {
    player.experience += result.xp;
    await player.save();
  }

  return {
    action,
    ...result,
    playerId,
    timestamp: new Date(),
  };
};

module.exports = exports;
