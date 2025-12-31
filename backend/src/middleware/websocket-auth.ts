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
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production-' + Date.now();

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  email?: string;
}

/**
 * Verify JWT token from WebSocket upgrade request or message
 * YAGNI: Only essential verification (token exists, valid, not expired)
 * JØHN: Truth-certified (real validation, no simulation)
 */
export function verifyWebSocketToken(
  token: string | null | undefined
): { userId: string; email: string } | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null; // Token expired
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return null; // Invalid token
    }
    return null; // Other errors
  }
}

/**
 * Extract JWT token from WebSocket upgrade request
 * YAGNI: Only essential extraction (query param or header)
 * JØHN: Truth-certified (real extraction, no gaps)
 */
export function extractTokenFromRequest(url: string, headers: Record<string, string>): string | null {
  // Try query parameter first (common for WebSocket)
  const urlObj = new URL(url, 'http://localhost');
  const tokenParam = urlObj.searchParams.get('token');
  if (tokenParam) {
    return tokenParam;
  }

  // Try Authorization header
  const authHeader = headers.authorization || headers.Authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * Authenticate WebSocket connection
 * YAGNI: Only essential auth (token verification)
 * JØHN: Truth-certified (real validation, no simulation)
 */
export function authenticateWebSocket(
  ws: WebSocket,
  token: string | null
): AuthenticatedWebSocket | null {
  if (!token) {
    return null;
  }

  const decoded = verifyWebSocketToken(token);
  if (!decoded) {
    return null;
  }

  const authWs = ws as AuthenticatedWebSocket;
  authWs.userId = decoded.userId;
  authWs.email = decoded.email;
  return authWs;
}

