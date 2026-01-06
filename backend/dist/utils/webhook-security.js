"use strict";
/**
 * ⚡ WEBHOOK SECURITY × SIGNATURE VERIFICATION × YAGNI × JØHN × ONE
 * Pattern: WEBHOOK × SECURITY × SIGNATURE × VERIFICATION × YAGNI × JØHN × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 *
 * YAGNI × JØHN VALIDATED:
 * - Minimal implementation (only essential verification)
 * - Truth-certified (real signature validation, no gaps)
 * - Essential security (no optional features)
 *
 * ∞ AbëONE ∞
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStripeWebhook = verifyStripeWebhook;
exports.verifyTwilioWebhook = verifyTwilioWebhook;
exports.verifyHMACSignature = verifyHMACSignature;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Verify Stripe webhook signature
 * YAGNI: Only essential verification (signature + timestamp)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
function verifyStripeWebhook(payload, signature, secret) {
    if (!signature || !secret) {
        return false; // Fail closed (no signature = invalid)
    }
    try {
        const elements = signature.split(',');
        const signatureHash = elements.find((e) => e.startsWith('v1='))?.split('=')[1];
        const timestamp = elements.find((e) => e.startsWith('t='))?.split('=')[1];
        if (!signatureHash || !timestamp) {
            return false;
        }
        // Verify timestamp (prevent replay attacks)
        const currentTime = Math.floor(Date.now() / 1000);
        const timestampInt = parseInt(timestamp, 10);
        if (Math.abs(currentTime - timestampInt) > 300) {
            // 5 minute tolerance
            return false;
        }
        // Verify signature
        const payloadString = typeof payload === 'string' ? payload : payload.toString();
        const signedPayload = `${timestamp}.${payloadString}`;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', secret)
            .update(signedPayload, 'utf8')
            .digest('hex');
        // Timing-safe comparison
        return crypto_1.default.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedSignature));
    }
    catch {
        return false;
    }
}
/**
 * Verify Twilio webhook signature
 * YAGNI: Only essential verification (signature + URL)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
function verifyTwilioWebhook(url, params, signature, authToken) {
    if (!signature || !authToken) {
        return false; // Fail closed
    }
    try {
        // Create signature string (sorted params + URL)
        const sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}${params[key]}`)
            .join('');
        const signatureString = url + sortedParams;
        // Compute expected signature
        const expectedSignature = crypto_1.default
            .createHmac('sha1', authToken)
            .update(signatureString, 'utf8')
            .digest('base64');
        // Timing-safe comparison
        return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    }
    catch {
        return false;
    }
}
/**
 * Verify generic HMAC signature
 * YAGNI: Only essential verification (payload + secret)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
function verifyHMACSignature(payload, signature, secret, algorithm = 'sha256') {
    if (!signature || !secret) {
        return false; // Fail closed
    }
    try {
        const payloadBuffer = typeof payload === 'string' ? Buffer.from(payload, 'utf8') : payload;
        const expectedSignature = crypto_1.default
            .createHmac(algorithm, secret)
            .update(payloadBuffer)
            .digest('hex');
        // Timing-safe comparison
        return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=webhook-security.js.map