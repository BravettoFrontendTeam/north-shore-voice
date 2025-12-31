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
const clients = new Map();
/**
 * Setup WebSocket server
 */
function setupWebSocket(wss) {
    wss.on('connection', (ws, req) => {
        console.log('WebSocket client connected');
        // Initialize client
        const client = {
            ws,
            sessionIds: new Set(),
        };
        clients.set(ws, client);
        // Handle messages
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                handleMessage(client, message);
            }
            catch (error) {
                console.error('Invalid WebSocket message:', error);
            }
        });
        // Handle close
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            clients.delete(ws);
        });
        // Handle errors
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            clients.delete(ws);
        });
        // Send welcome message
        sendToClient(ws, {
            type: 'connected',
            message: 'Connected to North Shore Voice real-time server',
            timestamp: new Date().toISOString(),
        });
    });
    // Heartbeat to keep connections alive
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
/**
 * Handle incoming WebSocket messages
 */
function handleMessage(client, message) {
    switch (message.type) {
        case 'authenticate':
            // Authenticate user
            client.userId = message.userId;
            sendToClient(client.ws, {
                type: 'authenticated',
                userId: message.userId,
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