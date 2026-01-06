import { ContactInfo, Contact, CampaignConfig, CallSchedule, CallSession, Campaign, CallbackRequest } from '../types/calls';
import { WebSocketService } from './websocket';
import { AbevoiceIntegration } from './abevoice-integration';
export declare class OutboundCallService {
    private wsService;
    private abevoice;
    private campaignTimers;
    constructor(wsService: WebSocketService, abevoice: AbevoiceIntegration);
    /**
     * Initiate a single outbound call
     */
    initiateCall(businessId: string, recipient: ContactInfo, script?: string, voiceId?: string, campaignId?: string): Promise<CallSession>;
    /**
     * Create and schedule a bulk call campaign
     */
    scheduleBulkCalls(businessId: string, contacts: Contact[], config: CampaignConfig, schedule?: CallSchedule): Promise<Campaign>;
    /**
     * Start a campaign
     */
    startCampaign(campaignId: string, businessId: string): Promise<void>;
    /**
     * Pause a running campaign
     */
    pauseCampaign(campaignId: string, businessId: string): Promise<void>;
    /**
     * Resume a paused campaign
     */
    resumeCampaign(campaignId: string, businessId: string): Promise<void>;
    /**
     * Cancel a campaign
     */
    cancelCampaign(campaignId: string, businessId: string): Promise<void>;
    /**
     * Handle callback requests
     */
    handleCallbacks(businessId: string, callbackList: CallbackRequest[]): Promise<void>;
    /**
     * Schedule a single callback
     */
    scheduleCallback(businessId: string, phoneNumber: string, name?: string, reason?: string, preferredTime?: Date): Promise<CallbackRequest>;
    /**
     * Get campaign by ID
     */
    getCampaign(campaignId: string): Campaign | undefined;
    /**
     * Get all campaigns for a business
     */
    getCampaigns(businessId: string): Campaign[];
    /**
     * Get campaign results/analytics
     */
    getCampaignResults(campaignId: string): any;
    /**
     * Get active call session
     */
    getSession(sessionId: string): CallSession | undefined;
    /**
     * Update call session status
     */
    updateSessionStatus(sessionId: string, status: CallSession['status'], result?: string, duration?: number): void;
    private processCampaignCalls;
    private processCallback;
    private waitForCallCompletion;
    private getOutboundConfig;
    private checkRateLimit;
    private incrementRateLimit;
    private checkDoNotCallList;
    private isAllowedCallTime;
    private personalizeScript;
    private isWithinSchedule;
    private getNextAllowedTime;
    private calculateEstimatedCompletion;
    private generateSessionId;
    private generateCampaignId;
    private generateContactId;
    private generateCallbackId;
}
//# sourceMappingURL=outbound-call.service.d.ts.map