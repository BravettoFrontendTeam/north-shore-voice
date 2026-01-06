"use strict";
/**
 * Security Utilities
 * Input validation, sanitization, and security helpers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = validatePhoneNumber;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.sanitizeString = sanitizeString;
exports.validateTwilioSignature = validateTwilioSignature;
exports.generateSecureToken = generateSecureToken;
exports.maskSensitiveData = maskSensitiveData;
exports.checkRateLimit = checkRateLimit;
exports.cleanupRateLimits = cleanupRateLimits;
exports.startCleanupRateLimits = startCleanupRateLimits;
exports.stopCleanupRateLimits = stopCleanupRateLimits;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Validate phone number format (E.164)
 * @param phone Phone number to validate
 * @returns true if valid E.164 format
 */
function validatePhoneNumber(phone) {
    // E.164 format: + followed by 1-15 digits
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
}
/**
 * Sanitize phone number (remove non-digits except leading +)
 */
function sanitizePhoneNumber(phone) {
    // Keep only digits and leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Ensure it starts with +
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
}
/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}
/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase, lowercase, number
 */
function validatePassword(password) {
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
function sanitizeString(input, maxLength = 1000) {
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
function validateTwilioSignature(signature, url, params, authToken) {
    // Sort params and concatenate key-value pairs
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => key + params[key])
        .join('');
    const data = url + sortedParams;
    // Create HMAC-SHA1 signature
    const expectedSignature = crypto_1.default
        .createHmac('sha1', authToken)
        .update(data)
        .digest('base64');
    // Timing-safe comparison
    return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
/**
 * Generate secure random token
 */
function generateSecureToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString('hex');
}
/**
 * Hash sensitive data for logging (show only first/last few chars)
 */
function maskSensitiveData(data, showChars = 4) {
    if (data.length <= showChars * 2) {
        return '***';
    }
    return data.substring(0, showChars) + '...' + data.substring(data.length - showChars);
}
/**
 * Rate limiter store (in-memory, use Redis in production)
 */
const rateLimitStore = new Map();
/**
 * Check rate limit for a key
 * @param key Unique identifier (e.g., IP address, user ID)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 */
function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
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
function cleanupRateLimits() {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}
let cleanupInterval = null;
function startCleanupRateLimits() {
    // Don't start background intervals in the test environment to avoid open handles
    if (process.env.NODE_ENV !== 'test') {
        cleanupInterval = setInterval(cleanupRateLimits, 5 * 60 * 1000);
    }
}
// Start automatically unless we're running tests
if (process.env.NODE_ENV !== 'test') {
    startCleanupRateLimits();
}
function stopCleanupRateLimits() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}
//# sourceMappingURL=security.js.map