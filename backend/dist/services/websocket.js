"use strict";
/**
 * WebSocket Service
 * Handles real-time communication for call monitoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsService = exports.WebSocketService = void 0;
exports.setupWebSocket = setupWebSocket;
exports.broadcastToSession = broadcastToSession;
exports.broadcastToUser = broadcastToUser;
exports.broadcastAll = broadcastAll;
exports.getConnectedCount = getConnectedCount;
exports.getSessionSubscriberCount = getSessionSubscriberCount;
const ws_1 = require("ws");
const websocket_auth_1 = require("../middleware/websocket-auth");
const clients = new Map();
/**
 * Setup WebSocket server
 * YAGNI × JØHN: JWT authentication required (essential security)
 */
function setupWebSocket(wss) {
    wss.on('connection', (ws, req) => {
        // Extract and verify JWT token
        const url = req.url || '';
        const headers = req.headers;
        const token = (0, websocket_auth_1.extractTokenFromRequest)(url, headers);
        // Authenticate WebSocket connection
        const authWs = (0, websocket_auth_1.authenticateWebSocket)(ws, token);
        if (!authWs) {
            console.log('WebSocket connection rejected: Invalid or missing token');
            ws.close(1008, 'Authentication required');
            return;
        }
        console.log(`WebSocket client connected: ${authWs.userId}`);
        // Initialize client with authenticated user
        const client = {
            ws: authWs,
            userId: authWs.userId,
            sessionIds: new Set(),
        };
        clients.set(authWs, client);
        // Handle messages
        authWs.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                handleMessage(client, message);
            }
            catch (error) {
                console.error('Invalid WebSocket message:', error);
            }
        });
        // Handle close
        authWs.on('close', () => {
            console.log(`WebSocket client disconnected: ${authWs.userId}`);
            clients.delete(authWs);
        });
        // Handle errors
        authWs.on('error', (error) => {
            console.error('WebSocket error:', error);
            clients.delete(authWs);
        });
        // Send welcome message
        sendToClient(authWs, {
            type: 'connected',
            message: 'Connected to North Shore Voice real-time server',
            userId: authWs.userId,
            timestamp: new Date().toISOString(),
        });
    });
    // Heartbeat to keep connections alive
    // Avoid creating periodic timers in test environment (keeps Jest from exiting)
    if (process.env.NODE_ENV !== 'test') {
        const heartbeatInterval = setInterval(() => {
            wss.clients.forEach((ws) => {
                if (ws.readyState === ws_1.WebSocket.OPEN) {
                    ws.ping();
                }
            });
        }, 30000);
        wss.on('close', () => {
            clearInterval(heartbeatInterval);
        });
    }
    else {
        // In test env, do not start heartbeat; tests can call wss.clients.forEach manually if needed
    }
}
/**
 * Handle incoming WebSocket messages
 */
function handleMessage(client, message) {
    switch (message.type) {
        case 'authenticate':
            // Already authenticated via JWT on connection
            // Just confirm authentication
            sendToClient(client.ws, {
                type: 'authenticated',
                userId: client.userId,
            });
            break;
        case 'subscribe':
            // Subscribe to call session updates
            if (message.sessionId) {
                client.sessionIds.add(message.sessionId);
                sendToClient(client.ws, {
                    type: 'subscribed',
                    sessionId: message.sessionId,
                });
            }
            break;
        case 'unsubscribe':
            // Unsubscribe from call session
            if (message.sessionId) {
                client.sessionIds.delete(message.sessionId);
                sendToClient(client.ws, {
                    type: 'unsubscribed',
                    sessionId: message.sessionId,
                });
            }
            break;
        case 'ping':
            sendToClient(client.ws, { type: 'pong' });
            break;
        default:
            console.log('Unknown message type:', message.type);
    }
}
/**
 * Send message to specific client
 */
function sendToClient(ws, data) {
    if (ws.readyState === ws_1.WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}
/**
 * Broadcast to all clients subscribed to a session
 */
function broadcastToSession(sessionId, data) {
    const message = JSON.stringify({
        ...data,
        sessionId,
        timestamp: new Date().toISOString(),
    });
    clients.forEach((client) => {
        if (client.sessionIds.has(sessionId) && client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(message);
        }
    });
}
/**
 * Broadcast to specific user
 */
function broadcastToUser(userId, data) {
    const message = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
    });
    clients.forEach((client) => {
        if (client.userId === userId && client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(message);
        }
    });
}
/**
 * Broadcast to all connected clients
 */
function broadcastAll(data) {
    const message = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
    });
    clients.forEach((client) => {
        if (client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(message);
        }
    });
}
/**
 * Get count of connected clients
 */
function getConnectedCount() {
    return clients.size;
}
/**
 * Get count of clients subscribed to a session
 */
function getSessionSubscriberCount(sessionId) {
    let count = 0;
    clients.forEach((client) => {
        if (client.sessionIds.has(sessionId)) {
            count++;
        }
    });
    return count;
}
/**
 * WebSocketService class for service integration
 * Provides room-based event emission
 */
class WebSocketService {
    constructor() {
        this.rooms = new Map();
    }
    /**
     * Join a room (e.g., businessId)
     */
    joinRoom(ws, roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(ws);
    }
    /**
     * Leave a room
     */
    leaveRoom(ws, roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(ws);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }
    /**
     * Emit event to all clients in a room
     */
    emitToRoom(roomId, event, data) {
        const message = JSON.stringify({
            type: event,
            data,
            roomId,
            timestamp: new Date().toISOString(),
        });
        // Emit to room subscribers
        const room = this.rooms.get(roomId);
        if (room) {
            room.forEach((ws) => {
                if (ws.readyState === ws_1.WebSocket.OPEN) {
                    ws.send(message);
                }
            });
        }
        // Also emit to any user subscribed to this session (backwards compatibility)
        clients.forEach((client) => {
            if (client.sessionIds.has(roomId) && client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
    /**
     * Emit event to specific client
     */
    emitToClient(ws, event, data) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: event,
                data,
                timestamp: new Date().toISOString(),
            }));
        }
    }
    /**
     * Broadcast to all connected clients
     */
    broadcastAll(event, data) {
        const message = JSON.stringify({
            type: event,
            data,
            timestamp: new Date().toISOString(),
        });
        clients.forEach((client) => {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                client.ws.send(message);
            }
        });
    }
}
exports.WebSocketService = WebSocketService;
// Export singleton instance
exports.wsService = new WebSocketService();
//# sourceMappingURL=websocket.js.map