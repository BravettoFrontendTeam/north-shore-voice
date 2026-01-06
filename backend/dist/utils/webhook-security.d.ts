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
/**
 * Verify Stripe webhook signature
 * YAGNI: Only essential verification (signature + timestamp)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export declare function verifyStripeWebhook(payload: string | Buffer, signature: string | undefined, secret: string | undefined): boolean;
/**
 * Verify Twilio webhook signature
 * YAGNI: Only essential verification (signature + URL)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export declare function verifyTwilioWebhook(url: string, params: Record<string, string>, signature: string | undefined, authToken: string | undefined): boolean;
/**
 * Verify generic HMAC signature
 * YAGNI: Only essential verification (payload + secret)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export declare function verifyHMACSignature(payload: string | Buffer, signature: string | undefined, secret: string | undefined, algorithm?: 'sha256' | 'sha1'): boolean;
//# sourceMappingURL=webhook-security.d.ts.map