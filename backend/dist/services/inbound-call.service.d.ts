import { InboundWebhook, CallData, RoutingRules, CallResponse, QueueStatus, QueuedCall } from '../types/calls';
import { WebSocketService } from './websocket';
import { AbevoiceIntegration } from './abevoice-integration';
export declare class InboundCallService {
    private wsService;
    private abevoice;
    constructor(wsService: WebSocketService, abevoice: AbevoiceIntegration);
    /**
     * Handle incoming call webhook from telephony provider
     */
    handleIncomingCall(webhookData: InboundWebhook, businessId: string): Promise<CallResponse>;
    /**
     * Route call based on business rules
     */
    routeCall(callData: CallData, businessRules: RoutingRules[]): Promise<void>;
    /**
     * Process call queue for a business
     */
    processCallQueue(businessId: string): Promise<QueueStatus>;
    /**
     * Add call to queue
     */
    addToQueue(callData: CallData, priority?: number): Promise<QueuedCall>;
    /**
     * Remove call from queue (served or abandoned)
     */
    removeFromQueue(businessId: string, callId: string, reason: 'served' | 'abandoned'): Promise<void>;
    /**
     * Transfer active call
     */
    transferCall(callId: string, transferTo: string, warmTransfer?: boolean): Promise<CallResponse>;
    /**
     * End active call
     */
    endCall(callId: string): Promise<void>;
    /**
     * Get call by ID
     */
    getCall(callId: string): CallData | undefined;
    /**
     * Get all active calls for a business
     */
    getActiveCalls(businessId: string): CallData[];
    private validateWebhook;
    private generateCallId;
    private getBusinessConfig;
    private getRoutingRules;
    private determineAction;
    private evaluateCondition;
    private evaluateTimeCondition;
    private evaluateCallerIdCondition;
    private evaluateQueueCondition;
    private isWithinBusinessHours;
    private executeAction;
    private routeToAiAgent;
    private routeToVoicemail;
    private executeRoutingAction;
    private handleDefaultRouting;
    private logCallAttempt;
}
//# sourceMappingURL=inbound-call.service.d.ts.map