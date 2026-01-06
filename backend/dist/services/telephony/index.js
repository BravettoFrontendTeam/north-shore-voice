"use strict";
/**
 * Multi-Provider Telephony Service
 * Supports: Plivo, SignalWire, Telnyx, Bandwidth, Twilio, Vonage
 * Features: Automatic failover, cost optimization, load balancing
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioProvider = exports.TelnyxProvider = exports.SignalWireProvider = exports.PlivoProvider = exports.TelephonyService = void 0;
exports.createTelephonyService = createTelephonyService;
const plivo_1 = require("./providers/plivo");
const signalwire_1 = require("./providers/signalwire");
const telnyx_1 = require("./providers/telnyx");
const twilio_1 = require("./providers/twilio");
// Provider cost per minute (USD) for optimization
const PROVIDER_COSTS = {
    plivo: 0.0085,
    signalwire: 0.0085,
    telnyx: 0.006,
    bandwidth: 0.0065,
    twilio: 0.013,
    vonage: 0.012,
};
class TelephonyService {
    constructor(configs) {
        this.providers = new Map();
        this.configs = [];
        this.primaryProvider = null;
        this.failoverEnabled = true;
        this.healthCheckInterval = null;
        this.providerHealth = new Map();
        this.configs = configs.filter(c => c.enabled).sort((a, b) => a.priority - b.priority);
        this.initializeProviders();
        // Avoid starting background health checks during tests to prevent open handles
        if (process.env.NODE_ENV !== 'test') {
            this.startHealthChecks();
        }
    }
    initializeProviders() {
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
            }
            catch (error) {
                console.error(`Failed to initialize ${config.provider}:`, error);
            }
        }
        console.log(`Telephony Service initialized with ${this.providers.size} provider(s)`);
        console.log(`Primary provider: ${this.primaryProvider}`);
    }
    createProvider(config) {
        const { provider, credentials, webhookBaseUrl, defaultFromNumber } = config;
        switch (provider) {
            case 'plivo':
                if (!credentials.authId || !credentials.authToken)
                    return null;
                return new plivo_1.PlivoProvider({
                    authId: credentials.authId,
                    authToken: credentials.authToken,
                    defaultFromNumber,
                    webhookBaseUrl,
                });
            case 'signalwire':
                if (!credentials.projectId || !credentials.authToken || !credentials.spaceUrl)
                    return null;
                return new signalwire_1.SignalWireProvider({
                    projectId: credentials.projectId,
                    authToken: credentials.authToken,
                    spaceUrl: credentials.spaceUrl,
                    defaultFromNumber,
                    webhookBaseUrl,
                });
            case 'telnyx':
                if (!credentials.apiKey)
                    return null;
                return new telnyx_1.TelnyxProvider({
                    apiKey: credentials.apiKey,
                    defaultFromNumber,
                    webhookBaseUrl,
                });
            case 'twilio':
                if (!credentials.accountSid || !credentials.authToken)
                    return null;
                return new twilio_1.TwilioProvider({
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
    async makeCall(request) {
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
            }
            catch (error) {
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
    async makeCallWithProvider(provider, request) {
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
    async getCallStatus(callId, provider) {
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
            }
            catch {
                continue;
            }
        }
        return null;
    }
    async endCall(callId, provider) {
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
                if (result)
                    return true;
            }
            catch {
                continue;
            }
        }
        return false;
    }
    async transferCall(callId, transferTo, provider) {
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
                if (result)
                    return true;
            }
            catch {
                continue;
            }
        }
        return false;
    }
    // ==================== SMS Methods ====================
    async sendSMS(request) {
        const providers = this.getOrderedProviders();
        for (const [name, provider] of providers) {
            if (!this.providerHealth.get(name))
                continue;
            try {
                const response = await provider.sendSMS(request);
                if (response.success) {
                    return response;
                }
            }
            catch (error) {
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
    async listNumbers(provider) {
        const numbers = [];
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
            }
            catch {
                continue;
            }
        }
        return numbers;
    }
    async purchaseNumber(number, provider) {
        const p = this.providers.get(provider || this.primaryProvider);
        if (p) {
            return p.purchaseNumber(number);
        }
        return null;
    }
    async releaseNumber(number, provider) {
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
                if (result)
                    return true;
            }
            catch {
                continue;
            }
        }
        return false;
    }
    // ==================== Webhook Methods ====================
    parseWebhook(provider, payload) {
        const p = this.providers.get(provider);
        if (p) {
            return p.parseWebhook(payload);
        }
        return null;
    }
    // ==================== Provider Management ====================
    getProviders() {
        return Array.from(this.providers.keys());
    }
    getProviderHealth() {
        return new Map(this.providerHealth);
    }
    async checkProviderHealth(provider) {
        const p = this.providers.get(provider);
        if (p) {
            const healthy = await p.isHealthy();
            this.providerHealth.set(provider, healthy);
            return healthy;
        }
        return false;
    }
    setPrimaryProvider(provider) {
        if (this.providers.has(provider)) {
            this.primaryProvider = provider;
        }
    }
    setFailoverEnabled(enabled) {
        this.failoverEnabled = enabled;
    }
    // ==================== Cost Optimization ====================
    getCheapestProvider() {
        let cheapest = null;
        let lowestCost = Infinity;
        for (const [provider, _] of this.providers) {
            if (this.providerHealth.get(provider) && PROVIDER_COSTS[provider] < lowestCost) {
                lowestCost = PROVIDER_COSTS[provider];
                cheapest = provider;
            }
        }
        return cheapest;
    }
    getProviderCost(provider) {
        return PROVIDER_COSTS[provider] || 0;
    }
    async estimateCallCost(durationMinutes) {
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
    getOrderedProviders() {
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
    startHealthChecks() {
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
exports.TelephonyService = TelephonyService;
// Export types
__exportStar(require("./types"), exports);
var plivo_2 = require("./providers/plivo");
Object.defineProperty(exports, "PlivoProvider", { enumerable: true, get: function () { return plivo_2.PlivoProvider; } });
var signalwire_2 = require("./providers/signalwire");
Object.defineProperty(exports, "SignalWireProvider", { enumerable: true, get: function () { return signalwire_2.SignalWireProvider; } });
var telnyx_2 = require("./providers/telnyx");
Object.defineProperty(exports, "TelnyxProvider", { enumerable: true, get: function () { return telnyx_2.TelnyxProvider; } });
var twilio_2 = require("./providers/twilio");
Object.defineProperty(exports, "TwilioProvider", { enumerable: true, get: function () { return twilio_2.TwilioProvider; } });
// Factory function for easy setup
function createTelephonyService(options) {
    const configs = [];
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
//# sourceMappingURL=index.js.map