// backend/src/services/appraisal-engine.ts
import { ContextGraph, Agent } from './context-graph-engine';

interface AppraisalResult {
  goal_relevance: number;
  goal_congruence: number;
  coping_potential: number;
  normative_significance: number;
  self_other_agency: AgencyAttribution;
  temporal_dynamics: TemporalAppraisal;
  primary_emotion: Emotion;
  secondary_emotions: Emotion[];
  emotion_intensity: number;
  expected_action_tendency: ActionTendency[];
  resolution_pathways: ResolutionPathway[];
}

interface AgencyAttribution {
  responsible_agent: 'self' | 'other' | 'circumstance' | 'mixed';
  intentionality: 'intentional' | 'unintentional' | 'unknown';
  preventability: 'preventable' | 'unpreventable' | 'unclear';
}

interface TemporalAppraisal {
  trajectory: 'improving' | 'worsening' | 'stable' | 'oscillating';
  changeability: number;
  timeframe: 'imminent' | 'near' | 'distant' | 'ongoing';
}

interface Emotion {
  name: string;
  intensity: number;
  arousal: number;
  valence: number;
  facial_expression: string;
  vocal_pattern: VocalPattern;
  action_tendency: string;
}

interface VocalPattern {
  pitch: 'higher' | 'lower' | 'normal' | 'slightly_higher' | 'slightly_lower';
  pace: 'faster' | 'slower' | 'normal' | 'slightly_faster' | 'slightly_slower';
  volume: 'louder' | 'quieter' | 'normal';
  breathiness: 'more' | 'less' | 'normal';
}

interface ActionTendency {
  action: string;
  probability: number;
  intensity: number;
}

interface ResolutionPathway {
  action: string;
  how_it_shifts_appraisal: {
    goal_relevance?: number;
    goal_congruence?: number;
    coping_potential?: number;
    normative_significance?: number;
  };
  likelihood_of_success: number;
}

class AppraisalEngine {
  async appraise(contextGraph: ContextGraph): Promise<AppraisalResult> {
    const customer = contextGraph.agents.find((a) => a.type === 'customer')!;
    return {
      goal_relevance: this.assessGoalRelevance(customer, contextGraph),
      goal_congruence: this.assessGoalCongruence(customer, contextGraph),
      coping_potential: this.assessCopingPotential(customer, contextGraph),
      normative_significance: this.assessNormativeSignificance(customer, contextGraph),
      self_other_agency: this.attributeAgency(contextGraph),
      temporal_dynamics: this.assessTemporalDynamics(contextGraph),
      primary_emotion: await this.predictPrimaryEmotion(customer, contextGraph),
      secondary_emotions: await this.predictSecondaryEmotions(customer, contextGraph),
      emotion_intensity: await this.assessEmotionIntensity(customer, contextGraph),
      expected_action_tendency: await this.predictActionTendencies(customer, contextGraph),
      resolution_pathways: await this.generateResolutionPathways(customer, contextGraph),
    };
  }

  private assessGoalRelevance(customer: Agent, contextGraph: ContextGraph): number {
    let relevance = 0;
    for (const goal of customer.goals) {
      const affectingEvents = contextGraph.events.filter((e) => e.affects_goals?.includes(goal.id));
      relevance += affectingEvents.length * goal.importance;
    }
    return Math.min(100, relevance);
  }

  private assessGoalCongruence(customer: Agent, contextGraph: ContextGraph): number {
    let congruence = 0;
    for (const goal of customer.goals) {
      const helpingEvents = contextGraph.events.filter(
        (e) => e.description.includes('fix') || e.description.includes('resolve') || e.description.includes('solution'),
      );
      const hurtingEvents = contextGraph.events.filter(
        (e) => e.description.includes('broken') || e.description.includes('failed') || e.description.includes('blocked'),
      );
      congruence += (helpingEvents.length - hurtingEvents.length) * 20;
    }
    return Math.max(-100, Math.min(100, congruence));
  }

  private assessCopingPotential(customer: Agent, contextGraph: ContextGraph): number {
    let coping = 0;
    coping += customer.coping_resources.length * 20;
    const controllableEvents = contextGraph.events.filter((e) => e.controllable);
    coping += controllableEvents.length * 15;
    const supportAgent = contextGraph.agents.find((a) => a.type === 'support_agent');
    if (supportAgent && supportAgent.agency === 100) {
      coping += 25;
    }
    if (customer.beliefs.has('can_understand_this')) {
      coping += 20;
    }
    return Math.min(100, coping);
  }

  private assessNormativeSignificance(customer: Agent, contextGraph: ContextGraph): number {
    let significance = 0;
    const fairnessViolation = contextGraph.social_dynamics.find((d) => d.type === 'fairness' && d.strength < 0);
    if (fairnessViolation) significance -= 30;
    const trustViolation = contextGraph.social_dynamics.find((d) => d.type === 'trust' && d.strength < 0);
    if (trustViolation) significance -= 25;
    for (const value of customer.values) {
      if (contextGraph.events.some((e) => e.description.includes(value.name))) {
        significance += 15;
      }
    }
    return Math.max(-100, Math.min(100, significance));
  }

  private attributeAgency(contextGraph: ContextGraph): AgencyAttribution {
    const events = contextGraph.events;
    let selfResponsibility = 0;
    let otherResponsibility = 0;
    let circumstanceResponsibility = 0;

    for (const event of events) {
      if (event.controlled_by.includes('customer')) {
        selfResponsibility += 1;
      }
      if (event.controlled_by.includes('support_agent')) {
        otherResponsibility += 1;
      }
      if (event.controlled_by.length === 0) {
        circumstanceResponsibility += 1;
      }
    }

    const intentionalMarkers = events.filter(
      (e) =>
        e.description.includes('intentional') ||
        e.description.includes('on purpose') ||
        e.description.includes('deliberately'),
    );

    return {
      responsible_agent:
        selfResponsibility > otherResponsibility && selfResponsibility > circumstanceResponsibility
          ? 'self'
          : otherResponsibility > circumstanceResponsibility
          ? 'other'
          : circumstanceResponsibility > 0
          ? 'circumstance'
          : 'mixed',
      intentionality: intentionalMarkers.length > 0 ? 'intentional' : 'unintentional',
      preventability: events.every((e) => e.reversible) ? 'preventable' : 'unpreventable',
    };
  }

  private assessTemporalDynamics(contextGraph: ContextGraph): TemporalAppraisal {
    const recentEvents = contextGraph.events.slice(-3);
    let trajectory: 'improving' | 'worsening' | 'stable' | 'oscillating' = 'stable';

    const sentiments = recentEvents.map((e) =>
      e.description.includes('fixed') || e.description.includes('resolved') || e.description.includes('working')
        ? 1
        : e.description.includes('broken') || e.description.includes('failed') || e.description.includes('error')
        ? -1
        : 0,
    );

    const trend = sentiments.reduce((a, b) => a + b, 0);
    if (trend > 1) trajectory = 'improving';
    else if (trend < -1) trajectory = 'worsening';
    else if (sentiments.some((s) => s !== sentiments[0])) trajectory = 'oscillating';

    return {
      trajectory,
      changeability: 50,
      timeframe: 'near',
    };
  }

  private async predictPrimaryEmotion(customer: Agent, contextGraph: ContextGraph): Promise<Emotion> {
    const appraisals = {
      goal_relevance: this.assessGoalRelevance(customer, contextGraph),
      goal_congruence: this.assessGoalCongruence(customer, contextGraph),
      coping_potential: this.assessCopingPotential(customer, contextGraph),
      normative_significance: this.assessNormativeSignificance(customer, contextGraph),
    };

    if (appraisals.goal_congruence < 0) {
      if (appraisals.coping_potential > 50) {
        return {
          name: 'anger',
          intensity: appraisals.goal_relevance * 0.8,
          arousal: 80,
          valence: -60,
          facial_expression: 'tense, frowning',
          vocal_pattern: { pitch: 'higher', pace: 'faster', volume: 'louder', breathiness: 'normal' },
          action_tendency: 'confrontation, problem-solving',
        };
      }
      return {
        name: 'sadness',
        intensity: appraisals.goal_relevance * 0.7,
        arousal: 30,
        valence: -80,
        facial_expression: 'downturned, resigned',
        vocal_pattern: { pitch: 'lower', pace: 'slower', volume: 'quieter', breathiness: 'more' },
        action_tendency: 'withdrawal, acceptance',
      };
    }

    if (appraisals.goal_congruence > 0) {
      return {
        name: 'joy',
        intensity: appraisals.goal_relevance * 0.6,
        arousal: 60,
        valence: 80,
        facial_expression: 'smiling, relaxed',
        vocal_pattern: { pitch: 'higher', pace: 'faster', volume: 'normal', breathiness: 'less' },
        action_tendency: 'approach, celebration',
      };
    }

    return {
      name: 'frustration',
      intensity: 50,
      arousal: 65,
      valence: -40,
      facial_expression: 'tense, uncertain',
      vocal_pattern: {
        pitch: 'slightly_higher',
        pace: 'slightly_faster',
        volume: 'normal',
        breathiness: 'normal',
      },
      action_tendency: 'problem-solving, escalation',
    };
  }

  private async predictSecondaryEmotions(customer: Agent, contextGraph: ContextGraph): Promise<Emotion[]> {
    const secondary: Emotion[] = [];
    const agency = this.attributeAgency(contextGraph);

    if (agency.responsible_agent === 'other') {
      secondary.push({
        name: 'anger',
        intensity: 40,
        arousal: 70,
        valence: -50,
        facial_expression: 'accusatory',
        vocal_pattern: { pitch: 'higher', pace: 'faster', volume: 'louder', breathiness: 'normal' },
        action_tendency: 'blame, demand accountability',
      });
    }

    if (agency.responsible_agent === 'self') {
      secondary.push({
        name: 'shame',
        intensity: 35,
        arousal: 40,
        valence: -70,
        facial_expression: 'avoidant, embarrassed',
        vocal_pattern: { pitch: 'lower', pace: 'slower', volume: 'quieter', breathiness: 'more' },
        action_tendency: 'withdrawal, self-blame',
      });
    }

    return secondary;
  }

  private async assessEmotionIntensity(customer: Agent, contextGraph: ContextGraph): Promise<number> {
    let intensity = 0;
    intensity += this.assessGoalRelevance(customer, contextGraph) * 0.5;
    intensity += Math.abs(this.assessGoalCongruence(customer, contextGraph)) * 0.3;
    intensity += (100 - this.assessCopingPotential(customer, contextGraph)) * 0.2;
    return Math.min(100, intensity);
  }

  private async predictActionTendencies(customer: Agent, contextGraph: ContextGraph): Promise<ActionTendency[]> {
    const primaryEmotion = await this.predictPrimaryEmotion(customer, contextGraph);

    const emotionTendencies: Record<string, ActionTendency[]> = {
      anger: [
        { action: 'demand escalation', probability: 70, intensity: 80 },
        { action: 'insist on compensation', probability: 60, intensity: 75 },
        { action: 'consider switching providers', probability: 50, intensity: 70 },
      ],
      sadness: [
        { action: 'withdraw from engagement', probability: 70, intensity: 60 },
        { action: 'accept situation passively', probability: 65, intensity: 55 },
        { action: 'seek emotional support', probability: 45, intensity: 50 },
      ],
      frustration: [
        { action: 'seek troubleshooting help', probability: 75, intensity: 70 },
        { action: 'demand faster resolution', probability: 65, intensity: 65 },
        { action: 'escalate if not resolved quickly', probability: 55, intensity: 60 },
      ],
      anxiety: [
        { action: 'ask repeated questions', probability: 80, intensity: 70 },
        { action: 'seek reassurance', probability: 75, intensity: 65 },
        { action: 'prepare for worst case', probability: 60, intensity: 55 },
      ],
    };

    return emotionTendencies[primaryEmotion.name] || [{ action: 'seek resolution', probability: 60, intensity: 50 }];
  }

  private async generateResolutionPathways(customer: Agent, contextGraph: ContextGraph): Promise<ResolutionPathway[]> {
    const pathways: ResolutionPathway[] = [];
    for (const goal of customer.goals) {
      pathways.push({
        action: `Help achieve goal: ${goal.description}`,
        how_it_shifts_appraisal: { goal_congruence: 50, coping_potential: 30 },
        likelihood_of_success: 70,
      });
    }
    return pathways;
  }
}

export { AppraisalEngine, AppraisalResult, Emotion, AgencyAttribution, TemporalAppraisal, ActionTendency, ResolutionPathway };

