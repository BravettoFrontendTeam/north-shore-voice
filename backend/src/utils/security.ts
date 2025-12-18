/**
 * Security Utilities
 * Input validation, sanitization, and security helpers
 */

import crypto from 'crypto';

/**
 * Validate phone number format (E.164)
 * @param phone Phone number to validate
 * @returns true if valid E.164 format
 */
export function validatePhoneNumber(phone: string): boolean {
  // E.164 format: + followed by 1-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Sanitize phone number (remove non-digits except leading +)
 */
export function sanitizePhoneNumber(phone: string): string {
  // Keep only digits and leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Ensure it starts with +
  return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase, lowercase, number
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  return { valid: true };
}

/**
 * Sanitize string input - remove potentially dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
}

/**
 * Validate Twilio webhook signature
 * @param signature X-Twilio-Signature header
 * @param url Full URL of the webhook
 * @param params POST parameters
 * @param authToken Twilio Auth Token
 */
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>,
  authToken: string
): boolean {
  // Sort params and concatenate key-value pairs
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => key + params[key])
    .join('');

  const data = url + sortedParams;
  
  // Create HMAC-SHA1 signature
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(data)
    .digest('base64');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data for logging (show only first/last few chars)
 */
export function maskSensitiveData(data: string, showChars: number = 4): string {
  if (data.length <= showChars * 2) {
    return '***';
  }
  return data.substring(0, showChars) + '...' + data.substring(data.length - showChars);
}

/**
 * Rate limiter store (in-memory, use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for a key
 * @param key Unique identifier (e.g., IP address, user ID)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: record.resetTime - now 
    };
  }

  record.count++;
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetIn: record.resetTime - now 
  };
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

