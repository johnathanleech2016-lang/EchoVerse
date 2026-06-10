const World = require('../models/World');
const Player = require('../models/Player');
const Message = require('../models/Message');
const worldService = require('../services/world.service');
const playerService = require('../services/player.service');
const { AppError, asyncHandler } = require('../utils/errors');

// Get complete world state
exports.getWorldState = asyncHandler(async (req, res) => {
  const world = await World.findOne({ active: true })
    .populate('players')
    .populate('entities');

  if (!world) {
    throw new AppError('World not found', 404);
  }

  res.json({
    success: true,
    data: {
      world: {
        id: world._id,
        name: world.name,
        description: world.description,
        dimensions: world.dimensions,
        weather: world.weather,
        timeOfDay: world.timeOfDay,
        updatedAt: world.updatedAt,
      },
      players: world.players.map(p => ({
        id: p._id,
        name: p.name,
        position: p.position,
        status: p.status,
        avatar: p.avatar,
      })),
      entities: world.entities,
      playerCount: world.players.length,
    },
  });
});

// Get world by ID
exports.getWorldById = asyncHandler(async (req, res) => {
  const world = await World.findById(req.params.worldId)
    .populate('players')
    .populate('entities');

  if (!world) {
    throw new AppError('World not found', 404);
  }

  res.json({
    success: true,
    data: world,
  });
});

// Get all players in world
exports.getPlayersInWorld = asyncHandler(async (req, res) => {
  const world = await World.findById(req.params.worldId)
    .populate('players');

  if (!world) {
    throw new AppError('World not found', 404);
  }

  const players = world.players.map(p => ({
    id: p._id,
    name: p.name,
    position: p.position,
    status: p.status,
    level: p.level,
    avatar: p.avatar,
    lastSeen: p.lastSeen,
  }));

  res.json({
    success: true,
    data: players,
    count: players.length,
  });
});

// Get entities in world
exports.getEntitiesInWorld = asyncHandler(async (req, res) => {
  const world = await World.findById(req.params.worldId)
    .populate('entities');

  if (!world) {
    throw new AppError('World not found', 404);
  }

  res.json({
    success: true,
    data: world.entities,
    count: world.entities.length,
  });
});

// Update player position (movement)
exports.updatePlayerPosition = asyncHandler(async (req, res) => {
  const { worldId, playerId } = req.params;
  const { position } = req.body;

  // Verify player belongs to requesting user
  const player = await Player.findById(playerId);
  if (!player || player.userId.toString() !== req.user._id.toString()) {
    throw new AppError('Unauthorized', 403);
  }

  // Validate position is within world bounds
  const world = await World.findById(worldId);
  if (!world) {
    throw new AppError('World not found', 404);
  }

  const isValid = worldService.isPositionValid(position, world.dimensions);
  if (!isValid) {
    throw new AppError('Position outside world bounds', 400);
  }

  // Update position with timestamp
  player.position = position;
  player.lastMoved = new Date();
  player.updatedAt = new Date();
  await player.save();

  res.json({
    success: true,
    data: {
      playerId: player._id,
      position: player.position,
      timestamp: player.updatedAt,
    },
  });
});

// Get player details
exports.getPlayer = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.playerId)
    .populate('inventory')
    .populate('skills');

  if (!player) {
    throw new AppError('Player not found', 404);
  }

  res.json({
    success: true,
    data: player,
  });
});

// Send chat message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { worldId } = req.params;
  const { content, type = 'global' } = req.body;

  const player = await Player.findOne({ userId: req.user._id, worldId });
  if (!player) {
    throw new AppError('Player not found in this world', 404);
  }

  const message = await Message.create({
    worldId,
    playerId: player._id,
    playerName: player.name,
    content,
    type,
    timestamp: new Date(),
  });

  res.status(201).json({
    success: true,
    data: message,
  });
});

// Get chat history
exports.getChatHistory = asyncHandler(async (req, res) => {
  const { worldId } = req.params;
  const { limit = 50, skip = 0, type = 'global' } = req.query;

  const messages = await Message.find({ worldId, type })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  res.json({
    success: true,
    data: messages.reverse(),
    count: messages.length,
  });
});

// Get nearby players
exports.getNearbyPlayers = asyncHandler(async (req, res) => {
  const { worldId, playerId } = req.params;
  const { radius = 100 } = req.query;

  const player = await Player.findById(playerId);
  if (!player) {
    throw new AppError('Player not found', 404);
  }

  const nearby = await playerService.findNearbyPlayers(
    player.position,
    parseInt(radius),
    worldId,
    playerId
  );

  res.json({
    success: true,
    data: nearby,
    count: nearby.length,
  });
});

// Interact with entity
exports.interactWithEntity = asyncHandler(async (req, res) => {
  const { worldId, entityId } = req.params;
  const { action } = req.body;

  const player = await Player.findOne({ userId: req.user._id, worldId });
  if (!player) {
    throw new AppError('Player not found in this world', 404);
  }

  const result = await worldService.interactWithEntity(
    entityId,
    player._id,
    action
  );

  res.json({
    success: true,
    data: result,
  });
});

module.exports = exports;
