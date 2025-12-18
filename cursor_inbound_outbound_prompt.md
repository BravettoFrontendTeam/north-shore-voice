# Add Inbound & Outbound Call Services - Cursor Prompt

Add comprehensive inbound and outbound call handling services to the North Shore Voice platform with AbëVoice API integration.

## Implementation Requirements

### 1. Service Architecture
```typescript
// Create these core service classes:
class InboundCallService {
  handleIncomingCall(webhookData: InboundWebhook): Promise<CallResponse>
  routeCall(callData: CallData, businessRules: RoutingRules): Promise<void>
  processCallQueue(queueId: string): Promise<QueueStatus>
}

class OutboundCallService {
  initiateCall(recipient: ContactInfo, campaign?: CampaignConfig): Promise<CallSession>
  scheduleBulkCalls(contacts: Contact[], schedule: CallSchedule): Promise<Campaign>
  handleCallbacks(callbackList: CallbackRequest[]): Promise<void>
}
```

### 2. Database Schema Extensions
```sql
-- Add these tables to existing schema:
CREATE TABLE inbound_calls (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  business_id UUID REFERENCES businesses(id),
  call_duration INTEGER,
  transcript TEXT,
  call_status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outbound_calls (
  id UUID PRIMARY KEY,
  recipient_number VARCHAR(20) NOT NULL,
  business_id UUID REFERENCES businesses(id),
  campaign_id UUID,
  call_result VARCHAR(50),
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE call_routing_rules (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  condition_type VARCHAR(50), -- time_based, keyword_based, caller_id
  condition_value JSONB,
  action_type VARCHAR(50), -- route_to_agent, play_message, take_voicemail
  action_config JSONB
);

CREATE TABLE outbound_campaigns (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  name VARCHAR(200),
  script_template TEXT,
  contact_list JSONB,
  schedule_config JSONB,
  status VARCHAR(20)
);
```

### 3. API Endpoints
```typescript
// Add these REST endpoints:

// Inbound Services
POST /api/webhooks/inbound-call     // Handle incoming call webhooks
GET  /api/inbound/calls             // List inbound call history
POST /api/inbound/routing-rules     // Configure call routing
GET  /api/inbound/queue-status      // Check current call queue
POST /api/inbound/transfer          // Transfer active call

// Outbound Services  
POST /api/outbound/call             // Initiate single outbound call
POST /api/outbound/campaign         // Create bulk call campaign
GET  /api/outbound/campaigns        // List campaigns
POST /api/outbound/schedule         // Schedule callback
GET  /api/outbound/results          // Campaign results & analytics
```

### 4. AbëVoice API Integration
```typescript
// Extend existing AbëVoice service:
class AbëVoiceIntegration {
  // Inbound call methods
  async acceptInboundCall(callId: string, businessContext: BusinessContext) {
    return await this.client.post('/calls/accept', {
      callId,
      voiceModel: businessContext.voiceModelId,
      greeting: businessContext.greeting,
      knowledgeBase: businessContext.knowledgeBase
    });
  }

  // Outbound call methods
  async initiateOutboundCall(recipientNumber: string, script: CallScript) {
    return await this.client.post('/calls/outbound', {
      to: recipientNumber,
      voiceModel: script.voiceModelId,
      script: script.content,
      maxDuration: script.maxDuration || 300
    });
  }

  // Real-time call control
  async transferCall(callId: string, transferTo: string) {
    return await this.client.post(`/calls/${callId}/transfer`, { transferTo });
  }

  async endCall(callId: string) {
    return await this.client.post(`/calls/${callId}/end`);
  }
}
```

### 5. Frontend Components
```tsx
// Create these React components:

// Inbound Call Dashboard
<InboundCallDashboard>
  <LiveCallQueue />
  <CallRoutingConfig />
  <InboundAnalytics />
  <CallHistory />
</InboundCallDashboard>

// Outbound Call Manager
<OutboundCallManager>
  <CampaignBuilder />
  <ContactUploader />
  <CallScheduler />
  <OutboundAnalytics />
</OutboundCallManager>

// Real-time Call Interface
<ActiveCallInterface>
  <CallControls />      // Mute, Transfer, End Call
  <LiveTranscript />    // Real-time speech-to-text
  <CallNotes />         // Agent notes during call
  <CustomerContext />   // Caller information & history
</ActiveCallInterface>
```

### 6. Business Logic Implementation

#### Inbound Call Flow:
```typescript
async function handleInboundCall(webhookData: InboundWebhook) {
  // 1. Validate webhook signature
  // 2. Look up business configuration
  // 3. Apply routing rules (time-based, caller-ID, keywords)
  // 4. Initialize AbëVoice session with business context
  // 5. Start real-time transcription
  // 6. Log call attempt and route appropriately
  // 7. Handle overflow (queue, voicemail, transfer)
}
```

#### Outbound Call Flow:
```typescript
async function processOutboundCampaign(campaignId: string) {
  // 1. Load campaign configuration and contact list
  // 2. Check business hours and rate limiting
  // 3. Initialize calls with proper spacing/throttling
  // 4. Track call results (answered, voicemail, busy, failed)
  // 5. Handle callbacks and follow-ups
  // 6. Update campaign analytics
  // 7. Generate completion reports
}
```

### 7. Configuration Options
```typescript
interface InboundConfig {
  businessHours: {
    timezone: string;
    schedule: WeeklySchedule;
  };
  routing: {
    defaultAction: 'ai_agent' | 'voicemail' | 'transfer';
    overflowHandling: 'queue' | 'voicemail' | 'busy_signal';
    maxQueueTime: number;
  };
  voiceSettings: {
    greeting: string;
    holdMusic: string;
    voicemailPrompt: string;
  };
}

interface OutboundConfig {
  rateLimiting: {
    callsPerMinute: number;
    maxConcurrentCalls: number;
  };
  compliance: {
    honorDoNotCall: boolean;
    respectTimeZones: boolean;
    maxAttemptsPerNumber: number;
  };
  scripting: {
    defaultScript: string;
    personalizedFields: string[];
    fallbackResponses: string[];
  };
}
```

### 8. Real-time Features
```typescript
// WebSocket events for real-time updates:
enum CallEvents {
  CALL_INCOMING = 'call:incoming',
  CALL_STARTED = 'call:started',
  CALL_ENDED = 'call:ended',
  TRANSCRIPT_UPDATE = 'transcript:update',
  QUEUE_UPDATE = 'queue:update',
  CAMPAIGN_UPDATE = 'campaign:update'
}

// Implement WebSocket handlers for live dashboard updates
```

### 9. Analytics & Reporting
```typescript
// Add comprehensive analytics:
- Call volume trends (hourly, daily, weekly)
- Average call duration and outcomes
- Queue wait times and abandonment rates
- Campaign performance metrics
- Voice AI effectiveness scores
- Cost per call and ROI calculations
```

### 10. Error Handling & Failover
```typescript
// Implement robust error handling:
- AbëVoice API timeout handling
- Call quality monitoring and automatic failover
- Webhook retry logic with exponential backoff
- Circuit breaker pattern for external dependencies
- Graceful degradation when AI service is unavailable
```

## Implementation Order:
1. **Database migrations** for new tables
2. **Webhook handler** for inbound calls
3. **Basic call routing** logic
4. **Outbound call initiation** service
5. **Frontend dashboards** for both services
6. **Real-time WebSocket** integration
7. **Analytics and reporting** features
8. **Advanced features** (campaigns, scheduling, etc.)

Focus on creating a seamless experience where businesses can handle both incoming customer calls and proactive outbound campaigns through the same unified AI-powered interface.