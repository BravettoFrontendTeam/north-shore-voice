// AbëVoice API Types
export interface AbëVoiceConfig {
  apiKey: string;
  baseUrl: string;
  voiceModelId: string;
  businessContext: BusinessContext;
}

export interface BusinessContext {
  companyName: string;
  industry: string;
  description: string;
  faqs: FAQ[];
  greeting: string;
  fallbackMessage: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// Call Types
export interface CallSession {
  id: string;
  phoneNumber: string;
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface IncomingCall {
  callId: string;
  from: string;
  to: string;
  timestamp: Date;
}

export interface CallResponse {
  sessionId: string;
  status: 'accepted' | 'rejected';
  voiceModelId: string;
}

export interface CallSummary {
  sessionId: string;
  duration: number;
  transcript: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  actionItems: string[];
}

export interface Transcript {
  sessionId: string;
  messages: TranscriptMessage[];
}

export interface TranscriptMessage {
  speaker: 'ai' | 'caller';
  text: string;
  timestamp: Date;
  confidence: number;
}

// Dashboard Types
export interface CallAnalytics {
  totalCalls: number;
  completedCalls: number;
  averageDuration: number;
  satisfactionRate: number;
  callsByHour: { hour: string; count: number }[];
  callsByDay: { day: string; count: number }[];
  topTopics: { topic: string; count: number }[];
}

export interface VoiceModel {
  id: string;
  name: string;
  status: 'training' | 'ready' | 'failed';
  createdAt: Date;
  sampleCount: number;
  personality: VoicePersonality;
}

export interface VoicePersonality {
  friendliness: number;
  professionalism: number;
  energy: number;
  formality: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
}

// Pricing Types
export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  callsIncluded: number;
  popular?: boolean;
}

