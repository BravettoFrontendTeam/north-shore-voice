/**
 * Auth Routes
 * Handles user authentication
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validateEmail, validatePassword, sanitizeString, checkRateLimit } from '../utils/security';

const router = Router();

// In-memory user store (use database in production)
const users = new Map<
  string,
  {
    id: string;
    email: string;
    password: string;
    name: string;
    company: string;
    plan: 'starter' | 'professional' | 'enterprise';
    createdAt: Date;
  }
>();

// JWT Configuration - Secret MUST be set via environment variable in production
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('❌ SECURITY ERROR: JWT_SECRET must be set and at least 32 characters long!');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
}

// Use a development-only fallback (still warn)
const SECRET = JWT_SECRET || 'dev-only-secret-do-not-use-in-production-' + Date.now();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Rate limiting - 5 registrations per IP per hour
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many registration attempts. Please try again later.',
        retryAfter: Math.ceil(rateLimit.resetIn / 1000),
      });
    }

    const { email, password, name, company } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.message });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedCompany = sanitizeString(company || '', 100);

    // Check if user exists
    const existingUser = Array.from(users.values()).find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password with strong salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: sanitizedName,
      company: sanitizedCompany,
      plan: 'starter' as const,
      createdAt: new Date(),
    };

    users.set(userId, user);

    // Generate token
    const token = jwt.sign({ userId, email }, SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Rate limiting - 10 login attempts per IP per 15 minutes
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateLimit = checkRateLimit(`login:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil(rateLimit.resetIn / 1000),
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user (case-insensitive email)
    let user = Array.from(users.values()).find((u) => u.email === email.toLowerCase());

    // Dev helper: create a default test user when logging in with test/test
    if (!user && email === 'test' && password === 'test') {
      const userId = uuidv4();
      const hashed = await bcrypt.hash('test', 12);
      user = {
        id: userId,
        email: 'test',
        password: hashed,
        name: 'Test User',
        company: 'Test Co',
        plan: 'starter',
        createdAt: new Date(),
      };
      users.set(userId, user);
    }

    if (!user) {
      // Use same error message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      // Use same error message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Persist session and respond with token
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      plan: user.plan,
    };
    (req.session as any).token = token;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      res.json({
        success: true,
        token,
        user: (req.session as any).user,
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('JSESSIONID', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req as any).cookies?.JSESSIONID as string | undefined;
    const sessionToken = (req.session as any)?.token as string | undefined;
    const token =
      authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : sessionToken || cookieToken || null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify current token
    const decoded = jwt.verify(token, SECRET) as { userId: string; email: string };

    // Generate new token
    const newToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    (req.session as any).token = newToken;
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = (req as any).cookies?.JSESSIONID as string | undefined;
    const sessionToken = (req.session as any)?.token as string | undefined;
    const token =
      authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : sessionToken || cookieToken || null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, SECRET) as { userId: string };
    const user = users.get(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      plan: user.plan,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
