/**
 * Security Utilities
 * Input validation, sanitization, and security helpers
 */
/**
 * Validate phone number format (E.164)
 * @param phone Phone number to validate
 * @returns true if valid E.164 format
 */
export declare function validatePhoneNumber(phone: string): boolean;
/**
 * Sanitize phone number (remove non-digits except leading +)
 */
export declare function sanitizePhoneNumber(phone: string): string;
/**
 * Validate email format
 */
export declare function validateEmail(email: string): boolean;
/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase, lowercase, number
 */
export declare function validatePassword(password: string): {
    valid: boolean;
    message?: string;
};
/**
 * Sanitize string input - remove potentially dangerous characters
 */
export declare function sanitizeString(input: string, maxLength?: number): string;
/**
 * Validate Twilio webhook signature
 * @param signature X-Twilio-Signature header
 * @param url Full URL of the webhook
 * @param params POST parameters
 * @param authToken Twilio Auth Token
 */
export declare function validateTwilioSignature(signature: string, url: string, params: Record<string, string>, authToken: string): boolean;
/**
 * Generate secure random token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Hash sensitive data for logging (show only first/last few chars)
 */
export declare function maskSensitiveData(data: string, showChars?: number): string;
/**
 * Check rate limit for a key
 * @param key Unique identifier (e.g., IP address, user ID)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 */
export declare function checkRateLimit(key: string, maxRequests?: number, windowMs?: number): {
    allowed: boolean;
    remaining: number;
    resetIn: number;
};
/**
 * Clean up expired rate limit entries (call periodically)
 */
export declare function cleanupRateLimits(): void;
export declare function startCleanupRateLimits(): void;
export declare function stopCleanupRateLimits(): void;
//# sourceMappingURL=security.d.ts.map