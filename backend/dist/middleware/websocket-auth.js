"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebSocketToken = verifyWebSocketToken;
exports.extractTokenFromRequest = extractTokenFromRequest;
exports.authenticateWebSocket = authenticateWebSocket;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production-' + Date.now();
/**
 * Verify JWT token from WebSocket upgrade request or message
 * YAGNI: Only essential verification (token exists, valid, not expired)
 * JØHN: Truth-certified (real validation, no simulation)
 */
function verifyWebSocketToken(token) {
    if (!token) {
        return null;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return null; // Token expired
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
function extractTokenFromRequest(url, headers) {
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
function authenticateWebSocket(ws, token) {
    if (!token) {
        return null;
    }
    const decoded = verifyWebSocketToken(token);
    if (!decoded) {
        return null;
    }
    const authWs = ws;
    authWs.userId = decoded.userId;
    authWs.email = decoded.email;
    return authWs;
}
//# sourceMappingURL=websocket-auth.js.map