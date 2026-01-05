// backend/src/services/context-graph-engine.ts
import { PrismaClient } from '@prisma/client';

interface Agent {
  id: string;
  name: string;
  type: 'customer' | 'support_agent' | 'system' | 'external_actor';
  goals: Goal[];
  beliefs: Map<string, Belief>;
  values: Value[];
  vulnerabilities: Vulnerability[];
  history: HistoricalInteraction[];
  agency: number; // 0-100
  coping_resources: CopingResource[];
}

interface Goal {
  id: string;
  description: string;
  importance: number; // 1-10
  time_frame: 'immediate' | 'short_term' | 'long_term';
  status: 'active' | 'blocked' | 'achieved' | 'abandoned';
  dependencies: Goal[];
  obstacles: string[];
}

interface Event {
  id: string;
  timestamp: Date;
  description: string;
  caused_by: Event[];
  causes: Event[];
  reversible: boolean;
  time_sensitive: boolean;
  affects_agents: string[];
  affects_goals: string[];
  controllable: boolean;
  controlled_by: string[];
}

interface SocialDynamic {
  type: 'power' | 'intimacy' | 'obligation' | 'trust' | 'fairness';
  between: [string, string];
  strength: number; // -100 (violated) to +100 (strong)
  history: SocialDynamicChange[];
}

interface Stakes {
  potential_gains: string[];
  value_of_gains: number;
  potential_losses: string[];
  value_of_losses: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  likelihood_of_positive_outcome: number;
}

interface NarrativeArc {
  act: 'setup' | 'conflict' | 'rising_action' | 'climax' | 'resolution';
  recent_turning_points: TurningPoint[];
  potential_turning_points: TurningPoint[];
  character_transformation: string;
  possible_endings: PossibleEnding[];
}

interface ContextGraph {
  id: string;
  created_at: Date;
  updated_at: Date;
  agents: Agent[];
  events: Event[];
  social_dynamics: SocialDynamic[];
  stakes: Stakes;
  narrative_arc: NarrativeArc;
  central_conflict: string;
  key_uncertainty: string;
  critical_path: Event[];
}

interface Turn {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface CustomerProfile {
  name: string;
  call_history: HistoricalInteraction[];
}

interface Belief {
  id: string;
  content: string;
  confidence: number;
}

interface Value {
  id: string;
  name: string;
  importance: number;
}

interface Vulnerability {
  id: string;
  type: 'identity' | 'belonging' | 'competence' | 'safety' | 'autonomy' | 'meaning';
  description: string;
  intensity: number;
}

interface HistoricalInteraction {
  id: string;
  timestamp: Date;
  outcome: string;
}

interface CopingResource {
  id: string;
  type: string;
  available: boolean;
}

interface SocialDynamicChange {
  timestamp: Date;
  change: number;
  reason: string;
}

interface TurningPoint {
  id: string;
  description: string;
  timestamp: Date;
}

interface PossibleEnding {
  id: string;
  description: string;
  probability: number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

class ContextGraphEngine {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async buildContextGraph(
    conversationHistory: Turn[],
    customerInfo: CustomerProfile
  ): Promise<ContextGraph> {
    const graph: ContextGraph = {
      id: generateId(),
      created_at: new Date(),
      updated_at: new Date(),
      agents: [],
      events: [],
      social_dynamics: [],
      stakes: {} as Stakes,
      narrative_arc: {} as NarrativeArc,
      central_conflict: '',
      key_uncertainty: '',
      critical_path: [],
    };

    graph.agents = await this.identifyAgents(conversationHistory, customerInfo);
    graph.events = await this.extractEvents(conversationHistory);
    graph.social_dynamics = await this.identifySocialDynamics(graph.agents);
    graph.stakes = await this.assessStakes(graph.agents, graph.events);
    graph.narrative_arc = await this.buildNarrativeArc(graph.events, graph.stakes);
    graph.central_conflict = await this.identifyCentralConflict(graph);
    graph.key_uncertainty = await this.identifyKeyUncertainty(graph);
    graph.critical_path = await this.identifyCriticalPath(graph);

    return graph;
  }

  private async identifyAgents(
    conversationHistory: Turn[],
    customerInfo: CustomerProfile
  ): Promise<Agent[]> {
    const agents: Agent[] = [];

    agents.push({
      id: 'customer',
      name: customerInfo.name,
      type: 'customer',
      goals: await this.extractGoalsFromHistory(conversationHistory),
      beliefs: await this.extractBeliefs(conversationHistory),
      values: await this.extractValues(customerInfo, conversationHistory),
      vulnerabilities: await this.mapVulnerabilities(conversationHistory),
      history: customerInfo.call_history.slice(0, 5),
      agency: this.assessAgency(conversationHistory),
      coping_resources: await this.identifyCopingResources(customerInfo),
    });

    agents.push({
      id: 'support_agent',
      name: 'AbëVOICE Support Agent',
      type: 'support_agent',
      goals: [
        {
          id: 'resolve_issue',
          description: 'Resolve customer issue',
          importance: 10,
          time_frame: 'immediate',
          status: 'active',
          dependencies: [],
          obstacles: [],
        },
      ],
      beliefs: new Map(),
      values: [],
      vulnerabilities: [],
      history: [],
      agency: 100,
      coping_resources: [],
    });

    return agents;
  }

  private async extractGoalsFromHistory(conversationHistory: Turn[]): Promise<Goal[]> {
    const transcript = conversationHistory.map((t) => `${t.role}: ${t.content}`).join('\n');
    const goalKeywords = ['want', 'need', 'trying', 'fix', 'resolve', 'get', 'achieve'];
    const goals: Goal[] = [];

    for (const turn of conversationHistory) {
      if (turn.role === 'user') {
        for (const keyword of goalKeywords) {
          if (turn.content.toLowerCase().includes(keyword)) {
            goals.push({
              id: generateId(),
              description: turn.content,
              importance: 8,
              time_frame: 'immediate',
              status: 'active',
              dependencies: [],
              obstacles: [],
            });
            break;
          }
        }
      }
    }

    return goals;
  }

  private async extractBeliefs(conversationHistory: Turn[]): Promise<Map<string, Belief>> {
    const beliefs = new Map<string, Belief>();
    return beliefs;
  }

  private async extractValues(
    customerInfo: CustomerProfile,
    conversationHistory: Turn[]
  ): Promise<Value[]> {
    return [];
  }

  private async mapVulnerabilities(conversationHistory: Turn[]): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];
    const transcript = conversationHistory.map((t) => t.content).join(' ').toLowerCase();

    if (transcript.includes('stupid') || transcript.includes('idiot') || transcript.includes('should have')) {
      vulnerabilities.push({
        id: generateId(),
        type: 'competence',
        description: 'Self-doubt about capabilities',
        intensity: 70,
      });
    }

    if (transcript.includes('waste') || transcript.includes('lost') || transcript.includes('money')) {
      vulnerabilities.push({
        id: generateId(),
        type: 'safety',
        description: 'Financial security concern',
        intensity: 80,
      });
    }

    return vulnerabilities;
  }

  private assessAgency(conversationHistory: Turn[]): number {
    return 30;
  }

  private async identifyCopingResources(customerInfo: CustomerProfile): Promise<CopingResource[]> {
    return [];
  }

  private async extractEvents(conversationHistory: Turn[]): Promise<Event[]> {
    const events: Event[] = [];

    for (const turn of conversationHistory) {
      if (turn.role === 'user') {
        const eventKeywords = ['happened', 'issue', 'problem', 'error', 'broken', 'failed'];
        for (const keyword of eventKeywords) {
          if (turn.content.toLowerCase().includes(keyword)) {
            events.push({
              id: generateId(),
              timestamp: turn.timestamp || new Date(),
              description: turn.content,
              caused_by: [],
              causes: [],
              reversible: true,
              time_sensitive: true,
              affects_agents: ['customer'],
              affects_goals: [],
              controllable: false,
              controlled_by: [],
            });
            break;
          }
        }
      }
    }

    return events;
  }

  private async identifySocialDynamics(agents: Agent[]): Promise<SocialDynamic[]> {
    const dynamics: SocialDynamic[] = [];

    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        dynamics.push({
          type: 'trust',
          between: [agents[i].id, agents[j].id],
          strength: 50,
          history: [],
        });
        dynamics.push({
          type: 'fairness',
          between: [agents[i].id, agents[j].id],
          strength: 50,
          history: [],
        });
      }
    }

    return dynamics;
  }

  private async assessStakes(agents: Agent[], events: Event[]): Promise<Stakes> {
    const customer = agents.find((a) => a.type === 'customer')!;

    return {
      potential_gains: customer.goals.map((g) => g.description),
      value_of_gains: Math.max(...customer.goals.map((g) => g.importance), 0),
      potential_losses: ['Time wasted', 'Money lost'],
      value_of_losses: 7,
      urgency: 'high',
      likelihood_of_positive_outcome: 60,
    };
  }

  private async buildNarrativeArc(events: Event[], stakes: Stakes): Promise<NarrativeArc> {
    return {
      act: 'conflict',
      recent_turning_points: [],
      potential_turning_points: [],
      character_transformation: '',
      possible_endings: [],
    };
  }

  private async identifyCentralConflict(graph: ContextGraph): Promise<string> {
    return 'Customer needs issue resolved but system is blocking progress';
  }

  private async identifyKeyUncertainty(graph: ContextGraph): Promise<string> {
    return 'Will the issue be resolved?';
  }

  private async identifyCriticalPath(graph: ContextGraph): Promise<Event[]> {
    return graph.events.slice(0, 3);
  }
}

export { ContextGraphEngine, ContextGraph, Agent, Event, Goal, SocialDynamic, Stakes, NarrativeArc };

