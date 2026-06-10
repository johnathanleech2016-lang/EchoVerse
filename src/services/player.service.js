const Player = require('../models/Player');
const worldService = require('./world.service');

// Find players near a specific position
exports.findNearbyPlayers = async (position, radius, worldId, excludePlayerId = null) => {
  const players = await Player.find({ 
    worldId,
    _id: { $ne: excludePlayerId },
    status: 'active'
  });

  const nearbyPlayers = players.filter(player => {
    const distance = worldService.calculateDistance(position, player.position);
    return distance <= radius;
  });

  return nearbyPlayers.map(p => ({
    id: p._id,
    name: p.name,
    position: p.position,
    distance: worldService.calculateDistance(position, p.position),
    level: p.level,
    avatar: p.avatar,
  }));
};

// Update player status
exports.updatePlayerStatus = async (playerId, status) => {
  const player = await Player.findByIdAndUpdate(
    playerId,
    { status, lastSeen: new Date() },
    { new: true }
  );
  return player;
};

// Get player inventory
exports.getPlayerInventory = async (playerId) => {
  const player = await Player.findById(playerId).populate('inventory');
  return player.inventory;
};

// Add item to inventory
exports.addItemToInventory = async (playerId, itemId) => {
  const player = await Player.findById(playerId);
  if (!player.inventory) player.inventory = [];
  
  player.inventory.push(itemId);
  await player.save();
  return player.inventory;
};

// Remove item from inventory
exports.removeItemFromInventory = async (playerId, itemId) => {
  const player = await Player.findById(playerId);
  player.inventory = player.inventory.filter(id => id.toString() !== itemId);
  await player.save();
  return player.inventory;
};

// Update player level/experience
exports.updatePlayerExperience = async (playerId, xpGain) => {
  const player = await Player.findById(playerId);
  player.experience += xpGain;

  // Level up every 1000 XP
  const newLevel = Math.floor(player.experience / 1000) + 1;
  if (newLevel > player.level) {
    player.level = newLevel;
    player.maxHealth += 10;
    player.health = player.maxHealth;
  }

  await player.save();
  return { level: player.level, experience: player.experience };
};

// Get player stats
exports.getPlayerStats = async (playerId) => {
  const player = await Player.findById(playerId)
    .populate('skills')
    .populate('achievements');

  return {
    level: player.level,
    experience: player.experience,
    health: player.health,
    maxHealth: player.maxHealth,
    skills: player.skills,
    achievements: player.achievements,
    playtime: player.playtime,
  };
};

module.exports = exports;
