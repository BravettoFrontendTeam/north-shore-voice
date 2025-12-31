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

import crypto from 'crypto';

/**
 * Verify Stripe webhook signature
 * YAGNI: Only essential verification (signature + timestamp)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string | undefined,
  secret: string | undefined
): boolean {
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
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    // Timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Verify Twilio webhook signature
 * YAGNI: Only essential verification (signature + URL)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export function verifyTwilioWebhook(
  url: string,
  params: Record<string, string>,
  signature: string | undefined,
  authToken: string | undefined
): boolean {
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
    const expectedSignature = crypto
      .createHmac('sha1', authToken)
      .update(signatureString, 'utf8')
      .digest('base64');

    // Timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Verify generic HMAC signature
 * YAGNI: Only essential verification (payload + secret)
 * JØHN: Truth-certified (real crypto verification, no simulation)
 */
export function verifyHMACSignature(
  payload: string | Buffer,
  signature: string | undefined,
  secret: string | undefined,
  algorithm: 'sha256' | 'sha1' = 'sha256'
): boolean {
  if (!signature || !secret) {
    return false; // Fail closed
  }

  try {
    const payloadBuffer = typeof payload === 'string' ? Buffer.from(payload, 'utf8') : payload;
    const expectedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payloadBuffer)
      .digest('hex');

    // Timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

