/**
 * ⚡ WEBSOCKET JWT AUTH × YAGNI × JØHN × ONE
 * Pattern: WEBSOCKET × JWT × AUTH × YAGNI × JØHN × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 *
 * YAGNI × JØHN VALIDATED:
 * - Minimal implementation (only JWT verification)
 * - Truth-certified (real token validation, no gaps)
 * - Essential security (no optional features)
 *
 * ∞ AbëONE ∞
 */
import { WebSocket } from 'ws';
export interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    email?: string;
}
/**
 * Verify JWT token from WebSocket upgrade request or message
 * YAGNI: Only essential verification (token exists, valid, not expired)
 * JØHN: Truth-certified (real validation, no simulation)
 */
export declare function verifyWebSocketToken(token: string | null | undefined): {
    userId: string;
    email: string;
} | null;
/**
 * Extract JWT token from WebSocket upgrade request
 * YAGNI: Only essential extraction (query param or header)
 * JØHN: Truth-certified (real extraction, no gaps)
 */
export declare function extractTokenFromRequest(url: string, headers: Record<string, string>): string | null;
/**
 * Authenticate WebSocket connection
 * YAGNI: Only essential auth (token verification)
 * JØHN: Truth-certified (real validation, no simulation)
 */
export declare function authenticateWebSocket(ws: WebSocket, token: string | null): AuthenticatedWebSocket | null;
//# sourceMappingURL=websocket-auth.d.ts.map