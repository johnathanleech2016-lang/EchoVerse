# EchoVerse REST API Documentation

## Overview
EchoVerse uses a REST API architecture for all client-server communication. The client implements polling to simulate real-time updates.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All API endpoints (except `/auth/login` and `/auth/register`) require:
```
Authorization: Bearer {token}
```

Obtain a token by logging in via `/auth/login`.

---

## Endpoints

### World State

#### GET /world
Get the complete world state including all players, entities, and world information.

**Response:**
```json
{
  "success": true,
  "data": {
    "world": {
      "id": "world123",
      "name": "Main Realm",
      "description": "The main world",
      "dimensions": { "width": 1000, "height": 500, "depth": 1000 },
      "weather": "sunny",
      "timeOfDay": 14,
      "updatedAt": "2026-06-10T10:30:00Z"
    },
    "players": [
      {
        "id": "player1",
        "name": "Hero",
        "position": { "x": 100, "y": 50, "z": 200 },
        "status": "active",
        "avatar": "hero-avatar.png"
      }
    ],
    "entities": [...],
    "playerCount": 1
  }
}
```

#### GET /world/:worldId
Get world details by ID.

#### GET /world/:worldId/players
Get all active players in the world.

**Query Parameters:**
- `limit` (default: 50) - Maximum results
- `skip` (default: 0) - Pagination offset

#### GET /world/:worldId/entities
Get all entities (objects, NPCs, items) in the world.

---

### Player Movement

#### POST /world/:worldId/players/:playerId/move
Update player position.

**Request Body:**
```json
{
  "position": {
    "x": 150,
    "y": 50,
    "z": 250
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "playerId": "player1",
    "position": { "x": 150, "y": 50, "z": 250 },
    "timestamp": "2026-06-10T10:30:15Z"
  }
}
```

#### GET /world/:worldId/players/:playerId
Get player details including inventory and skills.

#### GET /world/:worldId/players/:playerId/nearby
Get players near a specific player.

**Query Parameters:**
- `radius` (default: 100) - Detection radius in units

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "player2",
      "name": "Mage",
      "position": { "x": 120, "y": 50, "z": 210 },
      "distance": 45.2,
      "level": 5,
      "avatar": "mage-avatar.png"
    }
  ],
  "count": 1
}
```

---

### Chat

#### POST /world/:worldId/chat
Send a chat message.

**Request Body:**
```json
{
  "content": "Hello world!",
  "type": "global"
}
```

**Types:**
- `global` - Message visible to all players
- `local` - Message visible to nearby players
- `private` - Direct message to a player

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "msg123",
    "worldId": "world123",
    "playerId": "player1",
    "playerName": "Hero",
    "content": "Hello world!",
    "type": "global",
    "timestamp": "2026-06-10T10:30:30Z"
  }
}
```

#### GET /world/:worldId/chat
Get chat history.

**Query Parameters:**
- `limit` (default: 50) - Number of messages
- `skip` (default: 0) - Pagination offset
- `type` (default: global) - Message type filter

---

### Entity Interactions

#### POST /world/:worldId/entities/:entityId/interact
Perform an action on a world entity.

**Request Body:**
```json
{
  "action": "pickup"
}
```

**Valid Actions:**
- `pickup` - Pick up an item
- `use` - Use an object
- `examine` - Examine for details
- `talk` - Initiate dialogue
- `attack` - Attack an enemy

**Response:**
```json
{
  "success": true,
  "data": {
    "action": "pickup",
    "success": true,
    "message": "Item picked up",
    "xp": 10,
    "playerId": "player1",
    "timestamp": "2026-06-10T10:30:45Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `400` - Bad request (invalid data)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not allowed)
- `404` - Not found
- `500` - Server error

---

## Real-Time Updates

Since this is a REST API, the client implements polling to get updates:

```javascript
const poller = new WorldPoller(worldId, playerId, 1000); // Poll every 1 second

poller.on('worldStateChanged', (data) => {
  console.log('World updated:', data);
});

poller.on('playersUpdated', (players) => {
  console.log('Nearby players:', players);
});

poller.on('chatMessageReceived', (messages) => {
  console.log('New messages:', messages);
});

poller.start();
```

---

## Rate Limiting

API requests are rate-limited:
- **Authenticated endpoints**: 100 requests per minute per user
- **Public endpoints**: 30 requests per minute per IP

Exceeding limits returns `429 Too Many Requests`.

---

## Example Usage

### Moving a Player
```javascript
try {
  const result = await api.movePlayer(
    'world123',
    'player1',
    { x: 200, y: 50, z: 300 }
  );
  console.log('Player moved to:', result.data.position);
} catch (error) {
  console.error('Movement failed:', error.message);
}
```

### Getting Nearby Players
```javascript
const nearby = await api.getNearbyPlayers('world123', 'player1', 150);
console.log(`Found ${nearby.data.length} nearby players`);
```

### Sending a Chat Message
```javascript
const message = await api.sendChatMessage(
  'world123',
  'Hello everyone!',
  'global'
);
console.log('Message sent:', message.data._id);
```
