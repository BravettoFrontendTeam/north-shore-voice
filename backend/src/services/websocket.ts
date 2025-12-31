/**
 * WebSocket Service
 * Handles real-time communication for call monitoring
 */

import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { authenticateWebSocket, extractTokenFromRequest } from '../middleware/websocket-auth';

interface Client {
  ws: WebSocket;
  userId?: string;
  sessionIds: Set<string>;
}

const clients = new Map<WebSocket, Client>();

/**
 * Setup WebSocket server
 * YAGNI × JØHN: JWT authentication required (essential security)
 */
export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // Extract and verify JWT token
    const url = req.url || '';
    const headers = req.headers as Record<string, string>;
    const token = extractTokenFromRequest(url, headers);
    
    // Authenticate WebSocket connection
    const authWs = authenticateWebSocket(ws, token);
    if (!authWs) {
      console.log('WebSocket connection rejected: Invalid or missing token');
      ws.close(1008, 'Authentication required');
      return;
    }

    console.log(`WebSocket client connected: ${authWs.userId}`);

    // Initialize client with authenticated user
    const client: Client = {
      ws: authWs,
      userId: authWs.userId,
      sessionIds: new Set(),
    };
    clients.set(authWs, client);

    // Handle messages
    authWs.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(client, message);
      } catch (error) {
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
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
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
function handleMessage(client: Client, message: any) {
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
function sendToClient(ws: WebSocket, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

/**
 * Broadcast to all clients subscribed to a session
 */
export function broadcastToSession(sessionId: string, data: any) {
  const message = JSON.stringify({
    ...data,
    sessionId,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.sessionIds.has(sessionId) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

/**
 * Broadcast to specific user
 */
export function broadcastToUser(userId: string, data: any) {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

/**
 * Broadcast to all connected clients
 */
export function broadcastAll(data: any) {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

/**
 * Get count of connected clients
 */
export function getConnectedCount(): number {
  return clients.size;
}

/**
 * Get count of clients subscribed to a session
 */
export function getSessionSubscriberCount(sessionId: string): number {
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
export class WebSocketService {
  private rooms = new Map<string, Set<WebSocket>>();

  /**
   * Join a room (e.g., businessId)
   */
  joinRoom(ws: WebSocket, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(ws);
  }

  /**
   * Leave a room
   */
  leaveRoom(ws: WebSocket, roomId: string): void {
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
  emitToRoom(roomId: string, event: string, data: any): void {
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
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }

    // Also emit to any user subscribed to this session (backwards compatibility)
    clients.forEach((client) => {
      if (client.sessionIds.has(roomId) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  /**
   * Emit event to specific client
   */
  emitToClient(ws: WebSocket, event: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
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
  broadcastAll(event: string, data: any): void {
    const message = JSON.stringify({
      type: event,
      data,
      timestamp: new Date().toISOString(),
    });

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }
}

// Export singleton instance
export const wsService = new WebSocketService();

