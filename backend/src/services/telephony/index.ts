/**
 * Multi-Provider Telephony Service
 * Supports: Plivo, SignalWire, Telnyx, Bandwidth, Twilio, Vonage
 * Features: Automatic failover, cost optimization, load balancing
 */

import {
  TelephonyProvider,
  TelephonyConfig,
  ITelephonyProvider,
  CallRequest,
  CallResponse,
  CallStatus,
  SMSRequest,
  SMSResponse,
  PhoneNumber,
  WebhookEvent,
} from './types';

import { PlivoProvider } from './providers/plivo';
import { SignalWireProvider } from './providers/signalwire';
import { TelnyxProvider } from './providers/telnyx';
import { TwilioProvider } from './providers/twilio';

// Provider cost per minute (USD) for optimization
const PROVIDER_COSTS: Record<TelephonyProvider, number> = {
  plivo: 0.0085,
  signalwire: 0.0085,
  telnyx: 0.006,
  bandwidth: 0.0065,
  twilio: 0.013,
  vonage: 0.012,
};

export class TelephonyService {
  private providers = new Map<TelephonyProvider, ITelephonyProvider>();
  private configs: TelephonyConfig[] = [];
  private primaryProvider: TelephonyProvider | null = null;
  private failoverEnabled = true;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private providerHealth = new Map<TelephonyProvider, boolean>();

  constructor(configs: TelephonyConfig[]) {
    this.configs = configs.filter(c => c.enabled).sort((a, b) => a.priority - b.priority);
    this.initializeProviders();
    this.startHealthChecks();
  }

  private initializeProviders() {
    for (const config of this.configs) {
      try {
        const provider = this.createProvider(config);
        if (provider) {
          this.providers.set(config.provider, provider);
          this.providerHealth.set(config.provider, true);
          
          if (!this.primaryProvider) {
            this.primaryProvider = config.provider;
          }
        }
      } catch (error) {
        console.error(`Failed to initialize ${config.provider}:`, error);
      }
    }

    console.log(`Telephony Service initialized with ${this.providers.size} provider(s)`);
    console.log(`Primary provider: ${this.primaryProvider}`);
  }

  private createProvider(config: TelephonyConfig): ITelephonyProvider | null {
    const { provider, credentials, webhookBaseUrl, defaultFromNumber } = config;

    switch (provider) {
      case 'plivo':
        if (!credentials.authId || !credentials.authToken) return null;
        return new PlivoProvider({
          authId: credentials.authId,
          authToken: credentials.authToken,
          defaultFromNumber,
          webhookBaseUrl,
        });

      case 'signalwire':
        if (!credentials.projectId || !credentials.authToken || !credentials.spaceUrl) return null;
        return new SignalWireProvider({
          projectId: credentials.projectId,
          authToken: credentials.authToken,
          spaceUrl: credentials.spaceUrl,
          defaultFromNumber,
          webhookBaseUrl,
        });

      case 'telnyx':
        if (!credentials.apiKey) return null;
        return new TelnyxProvider({
          apiKey: credentials.apiKey,
          defaultFromNumber,
          webhookBaseUrl,
        });

      case 'twilio':
        if (!credentials.accountSid || !credentials.authToken) return null;
        return new TwilioProvider({
          accountSid: credentials.accountSid,
          authToken: credentials.authToken,
          defaultFromNumber,
          webhookBaseUrl,
        });

      default:
        console.warn(`Provider ${provider} not implemented yet`);
        return null;
    }
  }

  // ==================== Call Methods ====================

  async makeCall(request: CallRequest): Promise<CallResponse> {
    const providers = this.getOrderedProviders();

    for (const [name, provider] of providers) {
      if (!this.providerHealth.get(name)) {
        console.log(`Skipping unhealthy provider: ${name}`);
        continue;
      }

      try {
        console.log(`Attempting call via ${name}...`);
        const response = await provider.makeCall(request);
        
        if (response.success) {
          console.log(`Call initiated successfully via ${name}: ${response.callId}`);
          return response;
        }
      } catch (error) {
        console.error(`${name} call failed:`, error);
        this.providerHealth.set(name, false);
      }
    }

    return {
      success: false,
      callId: '',
      provider: 'plivo', // Default
      status: 'failed',
      error: 'All providers failed to initiate call',
    };
  }

  async makeCallWithProvider(
    provider: TelephonyProvider,
    request: CallRequest
  ): Promise<CallResponse> {
    const p = this.providers.get(provider);
    if (!p) {
      return {
        success: false,
        callId: '',
        provider,
        status: 'failed',
        error: `Provider ${provider} not configured`,
      };
    }

    return p.makeCall(request);
  }

  async getCallStatus(callId: string, provider?: TelephonyProvider): Promise<CallStatus | null> {
    if (provider) {
      const p = this.providers.get(provider);
      if (p) {
        return p.getCallStatus(callId);
      }
    }

    // Try all providers if provider not specified
    for (const [_, p] of this.providers) {
      try {
        return await p.getCallStatus(callId);
      } catch {
        continue;
      }
    }

    return null;
  }

  async endCall(callId: string, provider?: TelephonyProvider): Promise<boolean> {
    if (provider) {
      const p = this.providers.get(provider);
      if (p) {
        return p.endCall(callId);
      }
    }

    // Try all providers
    for (const [_, p] of this.providers) {
      try {
        const result = await p.endCall(callId);
        if (result) return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  async transferCall(
    callId: string,
    transferTo: string,
    provider?: TelephonyProvider
  ): Promise<boolean> {
    if (provider) {
      const p = this.providers.get(provider);
      if (p) {
        return p.transferCall(callId, transferTo);
      }
    }

    // Try all providers
    for (const [_, p] of this.providers) {
      try {
        const result = await p.transferCall(callId, transferTo);
        if (result) return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  // ==================== SMS Methods ====================

  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    const providers = this.getOrderedProviders();

    for (const [name, provider] of providers) {
      if (!this.providerHealth.get(name)) continue;

      try {
        const response = await provider.sendSMS(request);
        if (response.success) {
          return response;
        }
      } catch (error) {
        console.error(`${name} SMS failed:`, error);
      }
    }

    return {
      success: false,
      messageId: '',
      provider: 'plivo',
      status: 'failed',
      error: 'All providers failed to send SMS',
    };
  }

  // ==================== Phone Number Methods ====================

  async listNumbers(provider?: TelephonyProvider): Promise<PhoneNumber[]> {
    const numbers: PhoneNumber[] = [];

    if (provider) {
      const p = this.providers.get(provider);
      if (p) {
        return p.listNumbers();
      }
    }

    // Aggregate from all providers
    for (const [_, p] of this.providers) {
      try {
        const providerNumbers = await p.listNumbers();
        numbers.push(...providerNumbers);
      } catch {
        continue;
      }
    }

    return numbers;
  }

  async purchaseNumber(number: string, provider?: TelephonyProvider): Promise<PhoneNumber | null> {
    const p = this.providers.get(provider || this.primaryProvider!);
    if (p) {
      return p.purchaseNumber(number);
    }
    return null;
  }

  async releaseNumber(number: string, provider?: TelephonyProvider): Promise<boolean> {
    if (provider) {
      const p = this.providers.get(provider);
      if (p) {
        return p.releaseNumber(number);
      }
    }

    // Try all providers
    for (const [_, p] of this.providers) {
      try {
        const result = await p.releaseNumber(number);
        if (result) return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  // ==================== Webhook Methods ====================

  parseWebhook(provider: TelephonyProvider, payload: Record<string, any>): WebhookEvent | null {
    const p = this.providers.get(provider);
    if (p) {
      return p.parseWebhook(payload);
    }
    return null;
  }

  // ==================== Provider Management ====================

  getProviders(): TelephonyProvider[] {
    return Array.from(this.providers.keys());
  }

  getProviderHealth(): Map<TelephonyProvider, boolean> {
    return new Map(this.providerHealth);
  }

  async checkProviderHealth(provider: TelephonyProvider): Promise<boolean> {
    const p = this.providers.get(provider);
    if (p) {
      const healthy = await p.isHealthy();
      this.providerHealth.set(provider, healthy);
      return healthy;
    }
    return false;
  }

  setPrimaryProvider(provider: TelephonyProvider) {
    if (this.providers.has(provider)) {
      this.primaryProvider = provider;
    }
  }

  setFailoverEnabled(enabled: boolean) {
    this.failoverEnabled = enabled;
  }

  // ==================== Cost Optimization ====================

  getCheapestProvider(): TelephonyProvider | null {
    let cheapest: TelephonyProvider | null = null;
    let lowestCost = Infinity;

    for (const [provider, _] of this.providers) {
      if (this.providerHealth.get(provider) && PROVIDER_COSTS[provider] < lowestCost) {
        lowestCost = PROVIDER_COSTS[provider];
        cheapest = provider;
      }
    }

    return cheapest;
  }

  getProviderCost(provider: TelephonyProvider): number {
    return PROVIDER_COSTS[provider] || 0;
  }

  async estimateCallCost(durationMinutes: number): Promise<{ provider: TelephonyProvider; cost: number }[]> {
    const estimates = [];

    for (const [provider, _] of this.providers) {
      if (this.providerHealth.get(provider)) {
        estimates.push({
          provider,
          cost: PROVIDER_COSTS[provider] * durationMinutes,
        });
      }
    }

    return estimates.sort((a, b) => a.cost - b.cost);
  }

  // ==================== Private Methods ====================

  private getOrderedProviders(): [TelephonyProvider, ITelephonyProvider][] {
    if (!this.failoverEnabled && this.primaryProvider) {
      const p = this.providers.get(this.primaryProvider);
      if (p) {
        return [[this.primaryProvider, p]];
      }
    }

    return Array.from(this.providers.entries()).sort((a, b) => {
      const configA = this.configs.find(c => c.provider === a[0]);
      const configB = this.configs.find(c => c.provider === b[0]);
      return (configA?.priority || 99) - (configB?.priority || 99);
    });
  }

  private startHealthChecks() {
    // Check health every 60 seconds
    this.healthCheckInterval = setInterval(async () => {
      for (const [provider, _] of this.providers) {
        await this.checkProviderHealth(provider);
      }
    }, 60000);
  }

  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// Export types
export * from './types';
export { PlivoProvider } from './providers/plivo';
export { SignalWireProvider } from './providers/signalwire';
export { TelnyxProvider } from './providers/telnyx';
export { TwilioProvider } from './providers/twilio';

// Factory function for easy setup
export function createTelephonyService(options: {
  webhookBaseUrl: string;
  defaultFromNumber: string;
  plivo?: { authId: string; authToken: string };
  signalwire?: { projectId: string; authToken: string; spaceUrl: string };
  telnyx?: { apiKey: string };
  twilio?: { accountSid: string; authToken: string };
}): TelephonyService {
  const configs: TelephonyConfig[] = [];

  if (options.telnyx) {
    configs.push({
      provider: 'telnyx',
      credentials: { apiKey: options.telnyx.apiKey },
      webhookBaseUrl: options.webhookBaseUrl,
      defaultFromNumber: options.defaultFromNumber,
      enabled: true,
      priority: 1, // Cheapest
    });
  }

  if (options.plivo) {
    configs.push({
      provider: 'plivo',
      credentials: {
        authId: options.plivo.authId,
        authToken: options.plivo.authToken,
      },
      webhookBaseUrl: options.webhookBaseUrl,
      defaultFromNumber: options.defaultFromNumber,
      enabled: true,
      priority: 2,
    });
  }

  if (options.signalwire) {
    configs.push({
      provider: 'signalwire',
      credentials: {
        projectId: options.signalwire.projectId,
        authToken: options.signalwire.authToken,
        spaceUrl: options.signalwire.spaceUrl,
      },
      webhookBaseUrl: options.webhookBaseUrl,
      defaultFromNumber: options.defaultFromNumber,
      enabled: true,
      priority: 3,
    });
  }

  if (options.twilio) {
    configs.push({
      provider: 'twilio',
      credentials: {
        accountSid: options.twilio.accountSid,
        authToken: options.twilio.authToken,
      },
      webhookBaseUrl: options.webhookBaseUrl,
      defaultFromNumber: options.defaultFromNumber,
      enabled: true,
      priority: 4, // Premium option
    });
  }

  return new TelephonyService(configs);
}

