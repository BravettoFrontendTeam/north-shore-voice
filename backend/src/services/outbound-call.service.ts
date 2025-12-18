import {
  ContactInfo,
  Contact,
  CampaignConfig,
  CallSchedule,
  CallSession,
  Campaign,
  CallbackRequest,
  OutboundConfig,
  CallEvents,
  RateLimitConfig,
  ComplianceConfig,
} from '../types/calls';
import { WebSocketService } from './websocket';
import { AbevoiceIntegration } from './abevoice-integration';

// In-memory stores (replace with Redis/DB in production)
const activeSessions = new Map<string, CallSession>();
const campaigns = new Map<string, Campaign & { contacts: Contact[]; config: CampaignConfig }>();
const callbackQueue: CallbackRequest[] = [];
const rateLimiters = new Map<string, { count: number; resetTime: number }>();

export class OutboundCallService {
  private wsService: WebSocketService;
  private abevoice: AbevoiceIntegration;
  private campaignTimers = new Map<string, NodeJS.Timeout>();

  constructor(wsService: WebSocketService, abevoice: AbevoiceIntegration) {
    this.wsService = wsService;
    this.abevoice = abevoice;
  }

  /**
   * Initiate a single outbound call
   */
  async initiateCall(
    businessId: string,
    recipient: ContactInfo,
    script?: string,
    voiceId?: string,
    campaignId?: string
  ): Promise<CallSession> {
    // Check rate limiting
    if (!this.checkRateLimit(businessId)) {
      throw new Error('Rate limit exceeded. Please wait before making more calls.');
    }

    // Check compliance
    const config = await this.getOutboundConfig(businessId);
    if (config.compliance.honorDoNotCall) {
      const isBlocked = await this.checkDoNotCallList(recipient.phoneNumber);
      if (isBlocked) {
        throw new Error('Number is on Do Not Call list');
      }
    }

    // Check time zone compliance
    if (config.compliance.respectTimeZones) {
      if (!this.isAllowedCallTime(recipient.phoneNumber)) {
        throw new Error('Outside allowed calling hours for recipient time zone');
      }
    }

    // Create call session
    const sessionId = this.generateSessionId();
    const session: CallSession = {
      id: sessionId,
      status: 'dialing',
      recipientNumber: recipient.phoneNumber,
      startTime: new Date(),
    };

    activeSessions.set(sessionId, session);

    try {
      // Prepare script with personalization
      const personalizedScript = this.personalizeScript(
        script || config.scripting.defaultScript || '',
        recipient
      );

      // Initiate call via AbëVoice
      const result = await this.abevoice.initiateOutboundCall(
        recipient.phoneNumber,
        {
          voiceModelId: voiceId || config.scripting.defaultVoiceId || 'default',
          content: personalizedScript,
          maxDuration: 300,
        }
      );

      // Update session
      session.status = 'ringing';
      session.externalCallId = result?.callId;

      // Emit event
      this.wsService.emitToRoom(businessId, CallEvents.CALL_STARTED, {
        sessionId,
        recipientNumber: recipient.phoneNumber,
        recipientName: recipient.name,
        campaignId,
        timestamp: new Date().toISOString(),
      });

      // Update rate limiter
      this.incrementRateLimit(businessId);

      return session;
    } catch (error) {
      session.status = 'failed';
      session.result = 'Failed to connect';
      
      this.wsService.emitToRoom(businessId, CallEvents.CALL_FAILED, {
        sessionId,
        recipientNumber: recipient.phoneNumber,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  /**
   * Create and schedule a bulk call campaign
   */
  async scheduleBulkCalls(
    businessId: string,
    contacts: Contact[],
    config: CampaignConfig,
    schedule?: CallSchedule
  ): Promise<Campaign> {
    const campaignId = this.generateCampaignId();

    const campaign: Campaign & { contacts: Contact[]; config: CampaignConfig } = {
      id: campaignId,
      name: config.name,
      status: schedule ? 'scheduled' : 'draft',
      totalContacts: contacts.length,
      completedCalls: 0,
      answeredCalls: 0,
      voicemailCalls: 0,
      failedCalls: 0,
      progress: 0,
      contacts: contacts.map(c => ({
        ...c,
        id: c.id || this.generateContactId(),
        status: 'pending',
        attempts: 0,
      })),
      config: {
        ...config,
        scheduleConfig: schedule,
      },
    };

    campaigns.set(campaignId, campaign);

    // If schedule provided, schedule the campaign
    if (schedule?.startDate) {
      const startTime = new Date(schedule.startDate).getTime();
      const delay = Math.max(0, startTime - Date.now());
      
      if (delay > 0) {
        setTimeout(() => this.startCampaign(campaignId, businessId), delay);
      } else {
        // Start immediately if start date is in the past
        await this.startCampaign(campaignId, businessId);
      }
    }

    // Emit campaign created event
    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      status: campaign.status,
      totalContacts: campaign.totalContacts,
      timestamp: new Date().toISOString(),
    });

    return campaign;
  }

  /**
   * Start a campaign
   */
  async startCampaign(campaignId: string, businessId: string): Promise<void> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status === 'running') {
      throw new Error('Campaign is already running');
    }

    campaign.status = 'running';
    campaign.startedAt = new Date();

    // Emit update
    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      status: 'running',
      timestamp: new Date().toISOString(),
    });

    // Start processing campaign
    await this.processCampaignCalls(campaignId, businessId);
  }

  /**
   * Pause a running campaign
   */
  async pauseCampaign(campaignId: string, businessId: string): Promise<void> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'paused';

    // Clear any pending timers
    const timer = this.campaignTimers.get(campaignId);
    if (timer) {
      clearTimeout(timer);
      this.campaignTimers.delete(campaignId);
    }

    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      status: 'paused',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Resume a paused campaign
   */
  async resumeCampaign(campaignId: string, businessId: string): Promise<void> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'paused') {
      throw new Error('Campaign is not paused');
    }

    campaign.status = 'running';

    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      status: 'running',
      timestamp: new Date().toISOString(),
    });

    await this.processCampaignCalls(campaignId, businessId);
  }

  /**
   * Cancel a campaign
   */
  async cancelCampaign(campaignId: string, businessId: string): Promise<void> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'cancelled';

    // Clear any pending timers
    const timer = this.campaignTimers.get(campaignId);
    if (timer) {
      clearTimeout(timer);
      this.campaignTimers.delete(campaignId);
    }

    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      status: 'cancelled',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle callback requests
   */
  async handleCallbacks(
    businessId: string,
    callbackList: CallbackRequest[]
  ): Promise<void> {
    for (const callback of callbackList) {
      // Check if preferred time has passed
      if (callback.preferredTime && new Date(callback.preferredTime) > new Date()) {
        // Schedule for later
        const delay = new Date(callback.preferredTime).getTime() - Date.now();
        setTimeout(() => this.processCallback(businessId, callback), delay);
      } else {
        // Process immediately
        await this.processCallback(businessId, callback);
      }
    }
  }

  /**
   * Schedule a single callback
   */
  async scheduleCallback(
    businessId: string,
    phoneNumber: string,
    name?: string,
    reason?: string,
    preferredTime?: Date
  ): Promise<CallbackRequest> {
    const callback: CallbackRequest = {
      id: this.generateCallbackId(),
      phoneNumber,
      name,
      reason,
      preferredTime,
      status: 'pending',
      requestedAt: new Date(),
    };

    callbackQueue.push(callback);

    // Schedule if time is provided
    if (preferredTime) {
      const delay = Math.max(0, preferredTime.getTime() - Date.now());
      setTimeout(() => this.processCallback(businessId, callback), delay);
    }

    return callback;
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): Campaign | undefined {
    const campaign = campaigns.get(campaignId);
    if (campaign) {
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalContacts: campaign.totalContacts,
        completedCalls: campaign.completedCalls,
        answeredCalls: campaign.answeredCalls,
        voicemailCalls: campaign.voicemailCalls,
        failedCalls: campaign.failedCalls,
        progress: campaign.progress,
        startedAt: campaign.startedAt,
      };
    }
    return undefined;
  }

  /**
   * Get all campaigns for a business
   */
  getCampaigns(businessId: string): Campaign[] {
    // In production, filter by businessId from database
    return Array.from(campaigns.values()).map(c => ({
      id: c.id,
      name: c.name,
      status: c.status,
      totalContacts: c.totalContacts,
      completedCalls: c.completedCalls,
      answeredCalls: c.answeredCalls,
      voicemailCalls: c.voicemailCalls,
      failedCalls: c.failedCalls,
      progress: c.progress,
      startedAt: c.startedAt,
    }));
  }

  /**
   * Get campaign results/analytics
   */
  getCampaignResults(campaignId: string): any {
    const campaign = campaigns.get(campaignId);
    if (!campaign) return null;

    const contactsByStatus = {
      pending: campaign.contacts.filter(c => c.status === 'pending').length,
      called: campaign.contacts.filter(c => c.status === 'called').length,
      completed: campaign.contacts.filter(c => c.status === 'completed').length,
      failed: campaign.contacts.filter(c => c.status === 'failed').length,
    };

    return {
      campaignId: campaign.id,
      name: campaign.name,
      status: campaign.status,
      totalContacts: campaign.totalContacts,
      completedCalls: campaign.completedCalls,
      answeredCalls: campaign.answeredCalls,
      voicemailCalls: campaign.voicemailCalls,
      failedCalls: campaign.failedCalls,
      progress: campaign.progress,
      answerRate: campaign.completedCalls > 0 
        ? Math.round((campaign.answeredCalls / campaign.completedCalls) * 100) 
        : 0,
      contactsByStatus,
      startedAt: campaign.startedAt,
      estimatedCompletion: this.calculateEstimatedCompletion(campaign),
    };
  }

  /**
   * Get active call session
   */
  getSession(sessionId: string): CallSession | undefined {
    return activeSessions.get(sessionId);
  }

  /**
   * Update call session status
   */
  updateSessionStatus(
    sessionId: string,
    status: CallSession['status'],
    result?: string,
    duration?: number
  ): void {
    const session = activeSessions.get(sessionId);
    if (session) {
      session.status = status;
      if (result) session.result = result;
      if (duration) session.duration = duration;

      if (status === 'completed' || status === 'failed') {
        // Remove from active sessions after a delay
        setTimeout(() => activeSessions.delete(sessionId), 60000);
      }
    }
  }

  // ============= Private Methods =============

  private async processCampaignCalls(campaignId: string, businessId: string): Promise<void> {
    const campaign = campaigns.get(campaignId);
    if (!campaign || campaign.status !== 'running') {
      return;
    }

    const config = await this.getOutboundConfig(businessId);
    const rateLimiting = campaign.config.rateLimiting || config.rateLimiting;

    // Get next pending contact
    const pendingContacts = campaign.contacts.filter(
      c => c.status === 'pending' && (c.attempts || 0) < (config.compliance.maxAttemptsPerNumber || 3)
    );

    if (pendingContacts.length === 0) {
      // Campaign completed
      campaign.status = 'completed';
      campaign.progress = 100;

      this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_COMPLETED, {
        campaignId,
        totalCalls: campaign.completedCalls,
        answeredCalls: campaign.answeredCalls,
        timestamp: new Date().toISOString(),
      });

      return;
    }

    // Check schedule constraints
    if (campaign.config.scheduleConfig) {
      if (!this.isWithinSchedule(campaign.config.scheduleConfig)) {
        // Schedule retry for next allowed time
        const nextAllowed = this.getNextAllowedTime(campaign.config.scheduleConfig);
        const delay = nextAllowed.getTime() - Date.now();
        
        const timer = setTimeout(
          () => this.processCampaignCalls(campaignId, businessId),
          delay
        );
        this.campaignTimers.set(campaignId, timer);
        return;
      }
    }

    // Get next contact
    const contact = pendingContacts[0];
    contact.status = 'called';
    contact.attempts = (contact.attempts || 0) + 1;
    contact.lastAttempt = new Date();

    try {
      // Make the call
      const session = await this.initiateCall(
        businessId,
        contact,
        campaign.config.scriptTemplate,
        campaign.config.voiceId,
        campaignId
      );

      // Wait for call to complete (simplified - in production use webhooks)
      await this.waitForCallCompletion(session.id, 30000);

      // Update campaign stats based on result
      const completedSession = activeSessions.get(session.id);
      campaign.completedCalls++;

      if (completedSession?.result === 'answered') {
        campaign.answeredCalls++;
        contact.status = 'completed';
        contact.result = 'answered';
      } else if (completedSession?.result === 'voicemail') {
        campaign.voicemailCalls++;
        contact.status = 'completed';
        contact.result = 'voicemail';
      } else {
        campaign.failedCalls++;
        contact.status = 'failed';
        contact.result = completedSession?.result || 'failed';
      }
    } catch (error) {
      campaign.failedCalls++;
      contact.status = 'failed';
      contact.result = (error as Error).message;
    }

    // Update progress
    campaign.progress = Math.round(
      (campaign.completedCalls / campaign.totalContacts) * 100
    );

    // Emit progress update
    this.wsService.emitToRoom(businessId, CallEvents.CAMPAIGN_UPDATE, {
      campaignId,
      completedCalls: campaign.completedCalls,
      answeredCalls: campaign.answeredCalls,
      progress: campaign.progress,
      timestamp: new Date().toISOString(),
    });

    // Schedule next call with rate limiting delay
    const delay = Math.ceil((60 / rateLimiting.callsPerMinute) * 1000);
    const timer = setTimeout(
      () => this.processCampaignCalls(campaignId, businessId),
      delay
    );
    this.campaignTimers.set(campaignId, timer);
  }

  private async processCallback(businessId: string, callback: CallbackRequest): Promise<void> {
    callback.status = 'in_progress';

    try {
      const config = await this.getOutboundConfig(businessId);
      
      await this.initiateCall(
        businessId,
        { phoneNumber: callback.phoneNumber, name: callback.name },
        config.scripting.defaultScript,
        config.scripting.defaultVoiceId
      );

      callback.status = 'completed';
      callback.processedAt = new Date();
    } catch (error) {
      callback.status = 'failed';
    }
  }

  private async waitForCallCompletion(sessionId: string, timeout: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        const session = activeSessions.get(sessionId);
        if (
          !session ||
          session.status === 'completed' ||
          session.status === 'failed' ||
          Date.now() - startTime > timeout
        ) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
    });
  }

  private async getOutboundConfig(businessId: string): Promise<OutboundConfig> {
    // In production, fetch from database
    return {
      rateLimiting: {
        callsPerMinute: 5,
        maxConcurrentCalls: 3,
        pauseBetweenCalls: 5,
      },
      compliance: {
        honorDoNotCall: true,
        respectTimeZones: true,
        maxAttemptsPerNumber: 3,
        minDaysBetweenAttempts: 1,
        recordingDisclosure: true,
      },
      scripting: {
        defaultVoiceId: 'abe',
        personalizedFields: ['name', 'company'],
        fallbackResponses: [
          "I'm sorry, I didn't catch that. Could you please repeat?",
          "Let me connect you with someone who can help.",
        ],
      },
      retryPolicy: {
        retryOnBusy: true,
        retryOnNoAnswer: true,
        retryDelay: 60,
      },
    };
  }

  private checkRateLimit(businessId: string): boolean {
    const limiter = rateLimiters.get(businessId);
    const now = Date.now();

    if (!limiter || limiter.resetTime < now) {
      return true;
    }

    // Default: 10 calls per minute
    return limiter.count < 10;
  }

  private incrementRateLimit(businessId: string): void {
    const now = Date.now();
    const limiter = rateLimiters.get(businessId);

    if (!limiter || limiter.resetTime < now) {
      rateLimiters.set(businessId, {
        count: 1,
        resetTime: now + 60000, // Reset after 1 minute
      });
    } else {
      limiter.count++;
    }
  }

  private async checkDoNotCallList(phoneNumber: string): Promise<boolean> {
    // In production, check against actual DNC list
    return false;
  }

  private isAllowedCallTime(phoneNumber: string): boolean {
    // In production, check recipient's timezone
    // Default: allow calls 9 AM - 9 PM local time
    const hour = new Date().getHours();
    return hour >= 9 && hour < 21;
  }

  private personalizeScript(script: string, contact: ContactInfo): string {
    let personalized = script;
    
    if (contact.name) {
      personalized = personalized.replace(/\{name\}/g, contact.name);
    }
    
    if (contact.customFields) {
      for (const [key, value] of Object.entries(contact.customFields)) {
        personalized = personalized.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      }
    }
    
    return personalized;
  }

  private isWithinSchedule(schedule: CallSchedule): boolean {
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    
    const daySchedule = (schedule.allowedHours as any)[day];
    if (!daySchedule || daySchedule.length === 0) return false;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return daySchedule.some((slot: { start: string; end: string }) => 
      currentTime >= slot.start && currentTime <= slot.end
    );
  }

  private getNextAllowedTime(schedule: CallSchedule): Date {
    // Simplified - return next hour
    const next = new Date();
    next.setHours(next.getHours() + 1);
    next.setMinutes(0);
    next.setSeconds(0);
    return next;
  }

  private calculateEstimatedCompletion(campaign: any): Date | undefined {
    if (campaign.completedCalls === 0) return undefined;

    const elapsed = Date.now() - (campaign.startedAt?.getTime() || Date.now());
    const avgTimePerCall = elapsed / campaign.completedCalls;
    const remainingCalls = campaign.totalContacts - campaign.completedCalls;
    const estimatedRemaining = avgTimePerCall * remainingCalls;

    return new Date(Date.now() + estimatedRemaining);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCampaignId(): string {
    return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateContactId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCallbackId(): string {
    return `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

