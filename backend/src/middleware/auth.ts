/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

// JWT Secret - MUST be set via environment variable in production
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production-' + Date.now();
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

// Mock users store (shared with auth routes in production, use database)
const users = new Map<string, {
  id: string;
  email: string;
  password: string;
  name: string;
  company: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
}>();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    company: string;
    plan: string;
    createdAt: Date;
  };
}

/**
 * Middleware to verify JWT token
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req as any).cookies?.JSESSIONID as string | undefined;
    const sessionToken = (req.session as any)?.token as string | undefined;
    const token =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : sessionToken || cookieToken || null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET) as { userId: string; email: string };

    // Get user from store
    const user = users.get(decoded.userId);

    if (!user) {
      // For development, create a mock user
      (req as AuthenticatedRequest).user = {
        id: decoded.userId,
        email: decoded.email,
        name: 'Demo User',
        company: 'Demo Company',
        plan: 'professional',
        createdAt: new Date(),
      };
    } else {
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        plan: user.plan,
        createdAt: user.createdAt,
      };
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req as any).cookies?.JSESSIONID as string | undefined;
    const sessionToken = (req.session as any)?.token as string | undefined;
    const token =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : sessionToken || cookieToken || null;

    if (token) {
      const decoded = jwt.verify(token, SECRET) as { userId: string; email: string };
      const user = users.get(decoded.userId);

      if (user) {
        (req as AuthenticatedRequest).user = {
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
  } catch {
    // Continue without user
    next();
  }
}

/**
 * Middleware to check if user has required plan
 */
export function requirePlan(...allowedPlans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

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
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}
