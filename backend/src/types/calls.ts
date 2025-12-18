// Types for Inbound/Outbound Call Services

// ============= Inbound Types =============

export interface InboundWebhook {
  callId: string;
  from: string;
  to: string;
  callerName?: string;
  timestamp: string;
  direction: 'inbound';
  status: 'ringing' | 'answered' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export interface CallData {
  id: string;
  businessId: string;
  callerNumber: string;
  callerName?: string;
  externalCallId?: string;
  startTime: Date;
}

export interface RoutingRules {
  id: string;
  name: string;
  conditionType: 'TIME_BASED' | 'CALLER_ID' | 'KEYWORD' | 'QUEUE_LENGTH' | 'CALLER_HISTORY';
  conditionValue: TimeCondition | CallerIdCondition | KeywordCondition | QueueCondition | CallerHistoryCondition;
  actionType: 'AI_AGENT' | 'VOICEMAIL' | 'TRANSFER' | 'PLAY_MESSAGE' | 'QUEUE' | 'CALLBACK';
  actionConfig: ActionConfig;
  priority: number;
  isActive: boolean;
}

export interface TimeCondition {
  timezone: string;
  schedule: WeeklySchedule;
  holidays?: string[]; // ISO date strings
}

export interface WeeklySchedule {
  monday?: { start: string; end: string }[];
  tuesday?: { start: string; end: string }[];
  wednesday?: { start: string; end: string }[];
  thursday?: { start: string; end: string }[];
  friday?: { start: string; end: string }[];
  saturday?: { start: string; end: string }[];
  sunday?: { start: string; end: string }[];
}

export interface CallerIdCondition {
  patterns: string[]; // Regex patterns or exact numbers
  matchType: 'whitelist' | 'blacklist';
}

export interface KeywordCondition {
  keywords: string[];
  matchAny: boolean;
}

export interface QueueCondition {
  maxQueueLength: number;
  maxWaitTime: number; // seconds
}

export interface CallerHistoryCondition {
  minCalls: number;
  timeframeHours: number;
  tags?: string[];
}

export interface ActionConfig {
  // AI Agent
  voiceModelId?: string;
  greeting?: string;
  knowledgeBase?: string;
  
  // Transfer
  transferTo?: string;
  warmTransfer?: boolean;
  
  // Voicemail
  voicemailPrompt?: string;
  maxDuration?: number;
  
  // Play Message
  messageUrl?: string;
  messageText?: string;
  
  // Queue
  maxWaitTime?: number;
  holdMusicUrl?: string;
  
  // Callback
  callbackDelay?: number;
}

export interface CallResponse {
  success: boolean;
  callId: string;
  action: string;
  message?: string;
}

export interface QueueStatus {
  queueId: string;
  totalWaiting: number;
  avgWaitTime: number;
  longestWait: number;
  activeCalls: number;
  calls: QueuedCall[];
}

export interface QueuedCall {
  id: string;
  callerNumber: string;
  callerName?: string;
  position: number;
  waitTime: number;
  priority: number;
}

// ============= Outbound Types =============

export interface ContactInfo {
  phoneNumber: string;
  name?: string;
  email?: string;
  customFields?: Record<string, string>;
}

export interface Contact extends ContactInfo {
  id: string;
  status?: 'pending' | 'called' | 'completed' | 'failed';
  lastAttempt?: Date;
  attempts?: number;
  result?: string;
  notes?: string;
}

export interface CampaignConfig {
  id?: string;
  name: string;
  description?: string;
  scriptTemplate: string;
  voiceId?: string;
  scheduleConfig?: CallSchedule;
  rateLimiting?: RateLimitConfig;
  compliance?: ComplianceConfig;
}

export interface CallSchedule {
  timezone: string;
  allowedHours: WeeklySchedule;
  startDate?: string;
  endDate?: string;
  blackoutDates?: string[];
}

export interface RateLimitConfig {
  callsPerMinute: number;
  maxConcurrentCalls: number;
  pauseBetweenCalls: number; // seconds
}

export interface ComplianceConfig {
  honorDoNotCall: boolean;
  respectTimeZones: boolean;
  maxAttemptsPerNumber: number;
  minDaysBetweenAttempts: number;
}

export interface CallSession {
  id: string;
  status: 'dialing' | 'ringing' | 'in_progress' | 'completed' | 'failed';
  recipientNumber: string;
  startTime: Date;
  externalCallId?: string;
  duration?: number;
  result?: string;
  transcript?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  totalContacts: number;
  completedCalls: number;
  answeredCalls: number;
  voicemailCalls: number;
  failedCalls: number;
  progress: number;
  startedAt?: Date;
  estimatedCompletion?: Date;
}

export interface CallbackRequest {
  id: string;
  phoneNumber: string;
  name?: string;
  reason?: string;
  preferredTime?: Date;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  requestedAt: Date;
}

// ============= Configuration Types =============

export interface InboundConfig {
  businessHours: {
    timezone: string;
    schedule: WeeklySchedule;
    holidays?: string[];
  };
  routing: {
    defaultAction: 'ai_agent' | 'voicemail' | 'transfer';
    overflowHandling: 'queue' | 'voicemail' | 'busy_signal';
    maxQueueTime: number;
    maxQueueLength: number;
  };
  voiceSettings: {
    voiceModelId?: string;
    greeting: string;
    holdMusic?: string;
    voicemailPrompt: string;
    maxVoicemailDuration: number;
  };
  notifications: {
    missedCallAlert: boolean;
    voicemailAlert: boolean;
    queueThresholdAlert?: number;
    alertEmail?: string;
    alertPhone?: string;
  };
}

export interface OutboundConfig {
  rateLimiting: {
    callsPerMinute: number;
    maxConcurrentCalls: number;
    pauseBetweenCalls: number;
  };
  compliance: {
    honorDoNotCall: boolean;
    respectTimeZones: boolean;
    maxAttemptsPerNumber: number;
    minDaysBetweenAttempts: number;
    recordingDisclosure: boolean;
  };
  scripting: {
    defaultVoiceId?: string;
    defaultScript?: string;
    personalizedFields: string[];
    fallbackResponses: string[];
  };
  retryPolicy: {
    retryOnBusy: boolean;
    retryOnNoAnswer: boolean;
    retryDelay: number; // minutes
  };
}

// ============= WebSocket Event Types =============

export enum CallEvents {
  CALL_INCOMING = 'call:incoming',
  CALL_STARTED = 'call:started',
  CALL_ANSWERED = 'call:answered',
  CALL_ENDED = 'call:ended',
  CALL_FAILED = 'call:failed',
  CALL_TRANSFERRED = 'call:transferred',
  TRANSCRIPT_UPDATE = 'transcript:update',
  QUEUE_UPDATE = 'queue:update',
  CAMPAIGN_UPDATE = 'campaign:update',
  CAMPAIGN_COMPLETED = 'campaign:completed',
}

export interface CallEventPayload {
  event: CallEvents;
  callId: string;
  businessId: string;
  timestamp: string;
  data: Record<string, any>;
}

// ============= Analytics Types =============

export interface CallAnalytics {
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  
  // Volume metrics
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  
  // Outcome metrics
  answeredCalls: number;
  missedCalls: number;
  voicemailCalls: number;
  failedCalls: number;
  
  // Duration metrics
  totalDuration: number;
  avgDuration: number;
  
  // Queue metrics
  avgQueueTime: number;
  maxQueueTime: number;
  abandonmentRate: number;
  
  // Campaign metrics
  campaignCalls?: number;
  conversionRate?: number;
  
  // Breakdown
  byHour?: Record<number, number>;
  byDay?: Record<string, number>;
  byOutcome?: Record<string, number>;
}

