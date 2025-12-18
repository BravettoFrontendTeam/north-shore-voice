/**
 * Telnyx Telephony Provider
 * Cost: 50-70% cheaper than Twilio
 * Voice: $0.004-0.008/min
 */

import fetch from 'node-fetch';
import {
  ITelephonyProvider,
  CallRequest,
  CallResponse,
  CallStatus,
  SMSRequest,
  SMSResponse,
  PhoneNumber,
  WebhookEvent,
} from '../types';

export class TelnyxProvider implements ITelephonyProvider {
  name: 'telnyx' = 'telnyx';
  private apiKey: string;
  private baseUrl = 'https://api.telnyx.com/v2';
  private defaultFrom: string;
  private webhookBaseUrl: string;
  private connectionId?: string;

  constructor(config: {
    apiKey: string;
    defaultFromNumber: string;
    webhookBaseUrl: string;
    connectionId?: string;
  }) {
    this.apiKey = config.apiKey;
    this.defaultFrom = config.defaultFromNumber;
    this.webhookBaseUrl = config.webhookBaseUrl;
    this.connectionId = config.connectionId;
  }

  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telnyx API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async makeCall(request: CallRequest): Promise<CallResponse> {
    try {
      const payload: Record<string, any> = {
        from: request.from || this.defaultFrom,
        to: request.to,
        webhook_url: request.webhookUrl || `${this.webhookBaseUrl}/telnyx/voice`,
        webhook_url_method: 'POST',
        timeout_secs: request.timeout || 30,
      };

      if (this.connectionId) {
        payload.connection_id = this.connectionId;
      }

      if (request.machineDetection) {
        payload.answering_machine_detection = 'detect';
      }

      if (request.recordCall) {
        payload.record = 'record-from-answer';
      }

      const result = await this.request('/calls', 'POST', payload);

      return {
        success: true,
        callId: result.data.call_control_id,
        provider: 'telnyx',
        status: 'queued',
      };
    } catch (error) {
      return {
        success: false,
        callId: '',
        provider: 'telnyx',
        status: 'failed',
        error: (error as Error).message,
      };
    }
  }

  async getCallStatus(callId: string): Promise<CallStatus> {
    const result = await this.request(`/calls/${callId}`);
    const call = result.data;
    
    return {
      callId: call.call_control_id,
      status: this.mapStatus(call.state),
      direction: call.direction,
      duration: call.call_duration || 0,
      from: call.from,
      to: call.to,
      startTime: call.start_time ? new Date(call.start_time) : undefined,
      endTime: call.end_time ? new Date(call.end_time) : undefined,
      recordingUrl: call.record?.recording_urls?.[0],
      cost: parseFloat(call.cost?.amount) || 0,
    };
  }

  async endCall(callId: string): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/hangup`, 'POST');
      return true;
    } catch {
      return false;
    }
  }

  async transferCall(callId: string, transferTo: string): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/transfer`, 'POST', {
        to: transferTo,
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    try {
      const payload: Record<string, any> = {
        from: request.from || this.defaultFrom,
        to: request.to,
        text: request.body,
        webhook_url: request.statusCallbackUrl || `${this.webhookBaseUrl}/telnyx/sms-status`,
      };

      if (request.mediaUrls?.length) {
        payload.media_urls = request.mediaUrls;
        payload.type = 'MMS';
      }

      const result = await this.request('/messages', 'POST', payload);

      return {
        success: true,
        messageId: result.data.id,
        provider: 'telnyx',
        status: 'queued',
      };
    } catch (error) {
      return {
        success: false,
        messageId: '',
        provider: 'telnyx',
        status: 'failed',
        error: (error as Error).message,
      };
    }
  }

  async listNumbers(): Promise<PhoneNumber[]> {
    const result = await this.request('/phone_numbers');
    
    return result.data.map((num: any) => ({
      number: num.phone_number,
      country: num.address?.country_code || 'US',
      capabilities: {
        voice: true,
        sms: num.messaging_profile_id ? true : false,
        mms: num.messaging_profile_id ? true : false,
      },
      monthlyPrice: parseFloat(num.monthly_cost?.amount) || 0,
    }));
  }

  async purchaseNumber(number: string): Promise<PhoneNumber> {
    const result = await this.request('/number_orders', 'POST', {
      phone_numbers: [{ phone_number: number }],
    });
    
    const ordered = result.data.phone_numbers[0];
    
    return {
      number: ordered.phone_number,
      country: 'US',
      capabilities: {
        voice: true,
        sms: true,
        mms: true,
      },
      monthlyPrice: 1.0,
    };
  }

  async releaseNumber(number: string): Promise<boolean> {
    try {
      // Get the number ID first
      const numbers = await this.request(`/phone_numbers?filter[phone_number]=${number}`);
      const numObj = numbers.data[0];
      
      if (numObj) {
        await this.request(`/phone_numbers/${numObj.id}`, 'DELETE');
      }
      return true;
    } catch {
      return false;
    }
  }

  parseWebhook(payload: Record<string, any>): WebhookEvent {
    const eventType = this.mapWebhookEvent(payload.data?.event_type || payload.event_type);
    
    return {
      provider: 'telnyx',
      eventType,
      callId: payload.data?.payload?.call_control_id,
      messageId: payload.data?.payload?.id,
      from: payload.data?.payload?.from,
      to: payload.data?.payload?.to,
      timestamp: new Date(payload.data?.occurred_at || Date.now()),
      rawPayload: payload,
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.request('/balance');
      return true;
    } catch {
      return false;
    }
  }

  // Additional Telnyx-specific methods
  
  async speak(callId: string, text: string, voice: string = 'female'): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/speak`, 'POST', {
        payload: text,
        voice,
        language: 'en-US',
      });
      return true;
    } catch {
      return false;
    }
  }

  async playAudio(callId: string, audioUrl: string): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/playback_start`, 'POST', {
        audio_url: audioUrl,
      });
      return true;
    } catch {
      return false;
    }
  }

  async gatherDTMF(callId: string, options: {
    minDigits?: number;
    maxDigits?: number;
    timeoutMs?: number;
    terminatingDigit?: string;
  }): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/gather`, 'POST', {
        minimum_digits: options.minDigits || 1,
        maximum_digits: options.maxDigits || 128,
        timeout_millis: options.timeoutMs || 60000,
        terminating_digit: options.terminatingDigit || '#',
      });
      return true;
    } catch {
      return false;
    }
  }

  async bridge(callId: string, targetCallId: string): Promise<boolean> {
    try {
      await this.request(`/calls/${callId}/actions/bridge`, 'POST', {
        call_control_id: targetCallId,
      });
      return true;
    } catch {
      return false;
    }
  }

  private mapStatus(state: string): CallStatus['status'] {
    const statusMap: Record<string, CallStatus['status']> = {
      'queued': 'queued',
      'ringing': 'ringing',
      'active': 'in-progress',
      'answered': 'in-progress',
      'completed': 'completed',
      'busy': 'busy',
      'timeout': 'no-answer',
      'failed': 'failed',
      'hangup': 'completed',
    };
    return statusMap[state?.toLowerCase()] || 'failed';
  }

  private mapWebhookEvent(eventType: string): WebhookEvent['eventType'] {
    const eventMap: Record<string, WebhookEvent['eventType']> = {
      'call.initiated': 'call.initiated',
      'call.ringing': 'call.ringing',
      'call.answered': 'call.answered',
      'call.hangup': 'call.completed',
      'call.failed': 'call.failed',
      'message.sent': 'sms.delivered',
      'message.finalized': 'sms.delivered',
    };
    return eventMap[eventType?.toLowerCase()] || 'call.initiated';
  }
}

