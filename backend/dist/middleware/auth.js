"use strict";
/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
exports.requirePlan = requirePlan;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT Secret - MUST be set via environment variable in production
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production-' + Date.now();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// Mock users store (shared with auth routes in production, use database)
const users = new Map();
/**
 * Middleware to verify JWT token
 */
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.JSESSIONID;
        const sessionToken = req.session?.token;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : sessionToken || cookieToken || null;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        // Get user from store
        const user = users.get(decoded.userId);
        if (!user) {
            // For development, create a mock user
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                name: 'Demo User',
                company: 'Demo Company',
                plan: 'professional',
                createdAt: new Date(),
            };
        }
        else {
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                plan: user.plan,
                createdAt: user.createdAt,
            };
        }
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
/**
 * Optional auth middleware - doesn't fail if no token
 */
function optionalAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.JSESSIONID;
        const sessionToken = req.session?.token;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : sessionToken || cookieToken || null;
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET);
            const user = users.get(decoded.userId);
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    company: user.company,
                    plan: user.plan,
                    createdAt: user.createdAt,
                };
            }
        }
        next();
    }
    catch {
        // Continue without user
        next();
    }
}
/**
 * Middleware to check if user has required plan
 */
function requirePlan(...allowedPlans) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!allowedPlans.includes(user.plan)) {
            return res.status(403).json({
                error: 'Plan upgrade required',
                requiredPlans: allowedPlans,
                currentPlan: user.plan,
            });
        }
        next();
    };
}
/**
 * Generate a JWT token for a user
 */
function generateToken(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
/**
 * Verify a JWT token
 */
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map