/**
 * SignalWire Telephony Provider
 * Cost: ~25% cheaper than Twilio, Twilio-compatible API
 * Voice: $0.0085/min
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

export class SignalWireProvider implements ITelephonyProvider {
  name: 'signalwire' = 'signalwire';
  private projectId: string;
  private authToken: string;
  private spaceUrl: string;
  private baseUrl: string;
  private defaultFrom: string;
  private webhookBaseUrl: string;

  constructor(config: {
    projectId: string;
    authToken: string;
    spaceUrl: string;
    defaultFromNumber: string;
    webhookBaseUrl: string;
  }) {
    this.projectId = config.projectId;
    this.authToken = config.authToken;
    this.spaceUrl = config.spaceUrl;
    this.defaultFrom = config.defaultFromNumber;
    this.webhookBaseUrl = config.webhookBaseUrl;
    this.baseUrl = `https://${this.spaceUrl}/api/laml/2010-04-01/Accounts/${this.projectId}`;
  }

  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const auth = Buffer.from(`${this.projectId}:${this.authToken}`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...(body && { body: new URLSearchParams(body).toString() }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SignalWire API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async makeCall(request: CallRequest): Promise<CallResponse> {
    try {
      const payload: Record<string, string> = {
        From: request.from || this.defaultFrom,
        To: request.to,
        Url: request.webhookUrl || `${this.webhookBaseUrl}/signalwire/voice`,
        Method: 'POST',
        Timeout: String(request.timeout || 30),
        StatusCallback: request.statusCallbackUrl || `${this.webhookBaseUrl}/signalwire/status`,
        StatusCallbackMethod: 'POST',
      };

      if (request.machineDetection) {
        payload.MachineDetection = 'Enable';
      }

      if (request.recordCall) {
        payload.Record = 'true';
        payload.RecordingStatusCallback = `${this.webhookBaseUrl}/signalwire/recording`;
      }

      const result = await this.request('/Calls.json', 'POST', payload);

      return {
        success: true,
        callId: result.sid,
        provider: 'signalwire',
        status: 'queued',
      };
    } catch (error) {
      return {
        success: false,
        callId: '',
        provider: 'signalwire',
        status: 'failed',
        error: (error as Error).message,
      };
    }
  }

  async getCallStatus(callId: string): Promise<CallStatus> {
    const result = await this.request(`/Calls/${callId}.json`);
    
    return {
      callId: result.sid,
      status: this.mapStatus(result.status),
      direction: result.direction,
      duration: parseInt(result.duration) || 0,
      from: result.from,
      to: result.to,
      startTime: result.start_time ? new Date(result.start_time) : undefined,
      endTime: result.end_time ? new Date(result.end_time) : undefined,
      cost: parseFloat(result.price) || 0,
    };
  }

  async endCall(callId: string): Promise<boolean> {
    try {
      await this.request(`/Calls/${callId}.json`, 'POST', {
        Status: 'completed',
      });
      return true;
    } catch {
      return false;
    }
  }

  async transferCall(callId: string, transferTo: string): Promise<boolean> {
    try {
      await this.request(`/Calls/${callId}.json`, 'POST', {
        Url: `${this.webhookBaseUrl}/signalwire/transfer?to=${transferTo}`,
        Method: 'POST',
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    try {
      const payload: Record<string, string> = {
        From: request.from || this.defaultFrom,
        To: request.to,
        Body: request.body,
        StatusCallback: request.statusCallbackUrl || `${this.webhookBaseUrl}/signalwire/sms-status`,
      };

      if (request.mediaUrls?.length) {
        request.mediaUrls.forEach((url, i) => {
          payload[`MediaUrl${i}`] = url;
        });
      }

      const result = await this.request('/Messages.json', 'POST', payload);

      return {
        success: true,
        messageId: result.sid,
        provider: 'signalwire',
        status: 'queued',
      };
    } catch (error) {
      return {
        success: false,
        messageId: '',
        provider: 'signalwire',
        status: 'failed',
        error: (error as Error).message,
      };
    }
  }

  async listNumbers(): Promise<PhoneNumber[]> {
    const result = await this.request('/IncomingPhoneNumbers.json');
    
    return result.incoming_phone_numbers.map((num: any) => ({
      number: num.phone_number,
      country: num.phone_number.startsWith('+1') ? 'US' : 'Other',
      capabilities: {
        voice: num.capabilities?.voice || true,
        sms: num.capabilities?.sms || true,
        mms: num.capabilities?.mms || false,
      },
      monthlyPrice: 1.0, // SignalWire typical price
    }));
  }

  async purchaseNumber(number: string): Promise<PhoneNumber> {
    const result = await this.request('/IncomingPhoneNumbers.json', 'POST', {
      PhoneNumber: number,
    });
    
    return {
      number: result.phone_number,
      country: result.phone_number.startsWith('+1') ? 'US' : 'Other',
      capabilities: {
        voice: true,
        sms: true,
        mms: false,
      },
      monthlyPrice: 1.0,
    };
  }

  async releaseNumber(number: string): Promise<boolean> {
    try {
      // Get the SID first
      const numbers = await this.request('/IncomingPhoneNumbers.json');
      const numObj = numbers.incoming_phone_numbers.find(
        (n: any) => n.phone_number === number
      );
      
      if (numObj) {
        await this.request(`/IncomingPhoneNumbers/${numObj.sid}.json`, 'DELETE');
      }
      return true;
    } catch {
      return false;
    }
  }

  parseWebhook(payload: Record<string, any>): WebhookEvent {
    const eventType = this.mapWebhookEvent(payload.CallStatus || payload.MessageStatus);
    
    return {
      provider: 'signalwire',
      eventType,
      callId: payload.CallSid,
      messageId: payload.MessageSid,
      from: payload.From,
      to: payload.To,
      timestamp: new Date(),
      rawPayload: payload,
    };
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.request('/Calls.json?PageSize=1');
      return true;
    } catch {
      return false;
    }
  }

  private mapStatus(status: string): CallStatus['status'] {
    const statusMap: Record<string, CallStatus['status']> = {
      'queued': 'queued',
      'ringing': 'ringing',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'busy': 'busy',
      'no-answer': 'no-answer',
      'failed': 'failed',
      'canceled': 'canceled',
    };
    return statusMap[status.toLowerCase()] || 'failed';
  }

  private mapWebhookEvent(status: string): WebhookEvent['eventType'] {
    const eventMap: Record<string, WebhookEvent['eventType']> = {
      'initiated': 'call.initiated',
      'ringing': 'call.ringing',
      'in-progress': 'call.answered',
      'completed': 'call.completed',
      'failed': 'call.failed',
      'delivered': 'sms.delivered',
    };
    return eventMap[status?.toLowerCase()] || 'call.initiated';
  }
}

