/**
 * WebSocket Service
 * Handles real-time communication for call monitoring
 */
import { WebSocket, WebSocketServer } from 'ws';
/**
 * Setup WebSocket server
 */
export declare function setupWebSocket(wss: WebSocketServer): void;
/**
 * Broadcast to all clients subscribed to a session
 */
export declare function broadcastToSession(sessionId: string, data: any): void;
/**
 * Broadcast to specific user
 */
export declare function broadcastToUser(userId: string, data: any): void;
/**
 * Broadcast to all connected clients
 */
export declare function broadcastAll(data: any): void;
/**
 * Get count of connected clients
 */
export declare function getConnectedCount(): number;
/**
 * Get count of clients subscribed to a session
 */
export declare function getSessionSubscriberCount(sessionId: string): number;
/**
 * WebSocketService class for service integration
 * Provides room-based event emission
 */
export declare class WebSocketService {
    private rooms;
    /**
     * Join a room (e.g., businessId)
     */
    joinRoom(ws: WebSocket, roomId: string): void;
    /**
     * Leave a room
     */
    leaveRoom(ws: WebSocket, roomId: string): void;
    /**
     * Emit event to all clients in a room
     */
    emitToRoom(roomId: string, event: string, data: any): void;
    /**
     * Emit event to specific client
     */
    emitToClient(ws: WebSocket, event: string, data: any): void;
    /**
     * Broadcast to all connected clients
     */
    broadcastAll(event: string, data: any): void;
}
export declare const wsService: WebSocketService;
//# sourceMappingURL=websocket.d.ts.map