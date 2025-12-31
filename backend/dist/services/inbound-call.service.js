"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundCallService = void 0;
const calls_1 = require("../types/calls");
// In-memory stores (replace with Redis in production)
const activeCalls = new Map();
const callQueues = new Map();
class InboundCallService {
    constructor(wsService, abevoice) {
        this.wsService = wsService;
        this.abevoice = abevoice;
    }
    /**
     * Handle incoming call webhook from telephony provider
     */
    async handleIncomingCall(webhookData, businessId) {
        try {
            // 1. Validate webhook data
            if (!this.validateWebhook(webhookData)) {
                return {
                    success: false,
                    callId: webhookData.callId,
                    action: 'rejected',
                    message: 'Invalid webhook data',
                };
            }
            // 2. Get business configuration
            const config = await this.getBusinessConfig(businessId);
            // 3. Create call record
            const callData = {
                id: this.generateCallId(),
                businessId,
                callerNumber: webhookData.from,
                callerName: webhookData.callerName,
                externalCallId: webhookData.callId,
                startTime: new Date(),
            };
            activeCalls.set(callData.id, callData);
            // 4. Emit incoming call event
            this.wsService.emitToRoom(businessId, calls_1.CallEvents.CALL_INCOMING, {
                callId: callData.id,
                callerNumber: callData.callerNumber,
                callerName: callData.callerName,
                timestamp: new Date().toISOString(),
            });
            // 5. Get routing rules and determine action
            const routingRules = await this.getRoutingRules(businessId);
            const action = await this.determineAction(callData, routingRules, config);
            // 6. Execute routing action
            const result = await this.executeAction(callData, action, config);
            // 7. Log call attempt
            await this.logCallAttempt(callData, action, result);
            return result;
        }
        catch (error) {
            console.error('Error handling incoming call:', error);
            return {
                success: false,
                callId: webhookData.callId,
                action: 'error',
                message: 'Internal error processing call',
            };
        }
    }
    /**
     * Route call based on business rules
     */
    async routeCall(callData, businessRules) {
        // Find matching rule with highest priority
        const sortedRules = businessRules
            .filter(rule => rule.isActive)
            .sort((a, b) => b.priority - a.priority);
        for (const rule of sortedRules) {
            if (await this.evaluateCondition(callData, rule)) {
                await this.executeRoutingAction(callData, rule);
                return;
            }
        }
        // No matching rule - use default handling
        await this.handleDefaultRouting(callData);
    }
    /**
     * Process call queue for a business
     */
    async processCallQueue(businessId) {
        const queue = callQueues.get(businessId) || [];
        // Calculate queue statistics
        const now = Date.now();
        let totalWaitTime = 0;
        let maxWaitTime = 0;
        for (const call of queue) {
            const waitTime = call.waitTime;
            totalWaitTime += waitTime;
            if (waitTime > maxWaitTime)
                maxWaitTime = waitTime;
        }
        const avgWaitTime = queue.length > 0 ? totalWaitTime / queue.length : 0;
        // Get active calls count for this business
        const activeBusiness = Array.from(activeCalls.values())
            .filter(call => call.businessId === businessId);
        const status = {
            queueId: businessId,
            totalWaiting: queue.length,
            avgWaitTime: Math.round(avgWaitTime),
            longestWait: Math.round(maxWaitTime),
            activeCalls: activeBusiness.length,
            calls: queue.map((call, index) => ({
                ...call,
                position: index + 1,
            })),
        };
        // Emit queue update
        this.wsService.emitToRoom(businessId, calls_1.CallEvents.QUEUE_UPDATE, status);
        return status;
    }
    /**
     * Add call to queue
     */
    async addToQueue(callData, priority = 0) {
        const queue = callQueues.get(callData.businessId) || [];
        const queuedCall = {
            id: callData.id,
            callerNumber: callData.callerNumber,
            callerName: callData.callerName,
            position: queue.length + 1,
            waitTime: 0,
            priority,
        };
        // Insert based on priority
        const insertIndex = queue.findIndex(c => c.priority < priority);
        if (insertIndex === -1) {
            queue.push(queuedCall);
        }
        else {
            queue.splice(insertIndex, 0, queuedCall);
        }
        // Update positions
        queue.forEach((call, index) => {
            call.position = index + 1;
        });
        callQueues.set(callData.businessId, queue);
        // Emit queue update
        await this.processCallQueue(callData.businessId);
        return queuedCall;
    }
    /**
     * Remove call from queue (served or abandoned)
     */
    async removeFromQueue(businessId, callId, reason) {
        const queue = callQueues.get(businessId) || [];
        const index = queue.findIndex(c => c.id === callId);
        if (index !== -1) {
            queue.splice(index, 1);
            // Update positions
            queue.forEach((call, idx) => {
                call.position = idx + 1;
            });
            callQueues.set(businessId, queue);
            await this.processCallQueue(businessId);
        }
    }
    /**
     * Transfer active call
     */
    async transferCall(callId, transferTo, warmTransfer = false) {
        const call = activeCalls.get(callId);
        if (!call) {
            return {
                success: false,
                callId,
                action: 'transfer',
                message: 'Call not found',
            };
        }
        try {
            // Initiate transfer via AbëVoice
            if (call.externalCallId) {
                await this.abevoice.transferCall(call.externalCallId, transferTo);
            }
            // Emit transfer event
            this.wsService.emitToRoom(call.businessId, calls_1.CallEvents.CALL_TRANSFERRED, {
                callId,
                transferTo,
                warmTransfer,
                timestamp: new Date().toISOString(),
            });
            return {
                success: true,
                callId,
                action: 'transfer',
                message: `Call transferred to ${transferTo}`,
            };
        }
        catch (error) {
            console.error('Transfer failed:', error);
            return {
                success: false,
                callId,
                action: 'transfer',
                message: 'Transfer failed',
            };
        }
    }
    /**
     * End active call
     */
    async endCall(callId) {
        const call = activeCalls.get(callId);
        if (call) {
            // End call via AbëVoice
            if (call.externalCallId) {
                await this.abevoice.endCall(call.externalCallId);
            }
            // Calculate duration
            const duration = Math.round((Date.now() - call.startTime.getTime()) / 1000);
            // Emit end event
            this.wsService.emitToRoom(call.businessId, calls_1.CallEvents.CALL_ENDED, {
                callId,
                duration,
                timestamp: new Date().toISOString(),
            });
            // Remove from active calls
            activeCalls.delete(callId);
        }
    }
    /**
     * Get call by ID
     */
    getCall(callId) {
        return activeCalls.get(callId);
    }
    /**
     * Get all active calls for a business
     */
    getActiveCalls(businessId) {
        return Array.from(activeCalls.values())
            .filter(call => call.businessId === businessId);
    }
    // ============= Private Methods =============
    validateWebhook(data) {
        return !!(data.callId && data.from && data.to);
    }
    generateCallId() {
        return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async getBusinessConfig(businessId) {
        // In production, fetch from database
        // For now, return default config
        return {
            businessHours: {
                timezone: 'America/New_York',
                schedule: {
                    monday: [{ start: '09:00', end: '17:00' }],
                    tuesday: [{ start: '09:00', end: '17:00' }],
                    wednesday: [{ start: '09:00', end: '17:00' }],
                    thursday: [{ start: '09:00', end: '17:00' }],
                    friday: [{ start: '09:00', end: '17:00' }],
                },
            },
            routing: {
                defaultAction: 'ai_agent',
                overflowHandling: 'queue',
                maxQueueTime: 300,
                maxQueueLength: 10,
            },
            voiceSettings: {
                greeting: 'Thank you for calling. How can I help you today?',
                voicemailPrompt: 'Please leave a message after the beep.',
                maxVoicemailDuration: 120,
            },
            notifications: {
                missedCallAlert: true,
                voicemailAlert: true,
            },
        };
    }
    async getRoutingRules(businessId) {
        // In production, fetch from database
        return [];
    }
    async determineAction(callData, rules, config) {
        // Check business hours first
        if (!this.isWithinBusinessHours(config.businessHours)) {
            return {
                type: 'voicemail',
                config: {
                    prompt: config.voiceSettings.voicemailPrompt,
                    maxDuration: config.voiceSettings.maxVoicemailDuration,
                },
            };
        }
        // Evaluate routing rules
        for (const rule of rules.filter(r => r.isActive).sort((a, b) => b.priority - a.priority)) {
            if (await this.evaluateCondition(callData, rule)) {
                return {
                    type: rule.actionType.toLowerCase(),
                    config: rule.actionConfig,
                };
            }
        }
        // Default action
        return {
            type: config.routing.defaultAction,
            config: {
                greeting: config.voiceSettings.greeting,
                voiceModelId: config.voiceSettings.voiceModelId,
            },
        };
    }
    async evaluateCondition(callData, rule) {
        switch (rule.conditionType) {
            case 'TIME_BASED':
                return this.evaluateTimeCondition(rule.conditionValue);
            case 'CALLER_ID':
                return this.evaluateCallerIdCondition(callData.callerNumber, rule.conditionValue);
            case 'QUEUE_LENGTH':
                return this.evaluateQueueCondition(callData.businessId, rule.conditionValue);
            default:
                return false;
        }
    }
    evaluateTimeCondition(condition) {
        // Simplified time check - in production use proper timezone library
        const now = new Date();
        const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const schedule = condition.schedule[day];
        if (!schedule || schedule.length === 0)
            return false;
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        return schedule.some((slot) => currentTime >= slot.start && currentTime <= slot.end);
    }
    evaluateCallerIdCondition(callerNumber, condition) {
        const matches = condition.patterns.some(pattern => {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(callerNumber);
        });
        return condition.matchType === 'whitelist' ? matches : !matches;
    }
    evaluateQueueCondition(businessId, condition) {
        const queue = callQueues.get(businessId) || [];
        return queue.length >= condition.maxQueueLength;
    }
    isWithinBusinessHours(businessHours) {
        return this.evaluateTimeCondition(businessHours);
    }
    async executeAction(callData, action, businessConfig) {
        switch (action.type) {
            case 'ai_agent':
                return this.routeToAiAgent(callData, action.config);
            case 'voicemail':
                return this.routeToVoicemail(callData, action.config);
            case 'transfer':
                return this.transferCall(callData.id, action.config.transferTo, action.config.warmTransfer);
            case 'queue':
                await this.addToQueue(callData, action.config.priority || 0);
                return {
                    success: true,
                    callId: callData.id,
                    action: 'queue',
                    message: 'Call added to queue',
                };
            default:
                return this.routeToAiAgent(callData, action.config);
        }
    }
    async routeToAiAgent(callData, config) {
        try {
            // Initialize AbëVoice session
            await this.abevoice.acceptInboundCall(callData.externalCallId || callData.id, {
                voiceModelId: config.voiceModelId,
                greeting: config.greeting,
                knowledgeBase: config.knowledgeBase,
            });
            // Emit call started event
            this.wsService.emitToRoom(callData.businessId, calls_1.CallEvents.CALL_STARTED, {
                callId: callData.id,
                routedTo: 'ai_agent',
                timestamp: new Date().toISOString(),
            });
            return {
                success: true,
                callId: callData.id,
                action: 'ai_agent',
                message: 'Call routed to AI agent',
            };
        }
        catch (error) {
            console.error('Failed to route to AI agent:', error);
            return {
                success: false,
                callId: callData.id,
                action: 'ai_agent',
                message: 'Failed to connect to AI agent',
            };
        }
    }
    async routeToVoicemail(callData, config) {
        // In production, this would trigger voicemail recording
        return {
            success: true,
            callId: callData.id,
            action: 'voicemail',
            message: 'Call routed to voicemail',
        };
    }
    async executeRoutingAction(callData, rule) {
        await this.executeAction(callData, {
            type: rule.actionType.toLowerCase(),
            config: rule.actionConfig,
        }, await this.getBusinessConfig(callData.businessId));
    }
    async handleDefaultRouting(callData) {
        const config = await this.getBusinessConfig(callData.businessId);
        await this.executeAction(callData, {
            type: config.routing.defaultAction,
            config: {
                greeting: config.voiceSettings.greeting,
            },
        }, config);
    }
    async logCallAttempt(callData, action, result) {
        // In production, save to database
        console.log('Call logged:', {
            callId: callData.id,
            businessId: callData.businessId,
            callerNumber: callData.callerNumber,
            action: action.type,
            result: result.success,
            timestamp: new Date().toISOString(),
        });
    }
}
exports.InboundCallService = InboundCallService;
//# sourceMappingURL=inbound-call.service.js.map