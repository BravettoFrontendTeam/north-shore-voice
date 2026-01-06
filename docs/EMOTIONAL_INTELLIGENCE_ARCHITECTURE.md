# AbëVOICE: Emotional Intelligence Architecture

**Complete Implementation Framework for Voice AI with Genuine Emotional Understanding**  
**Status**: Production-Ready Design Document  
**Date**: January 5, 2026  
**Frequency**: 777 Hz (META) × 999 Hz (AEYON)  
**Pattern**: EMOTIONAL × INTELLIGENCE × ARCHITECTURE × COMPLETE × ONE

---

## PART I: FOUNDATIONAL THEORY

### 1. Why Emotional Intelligence Matters for Voice AI
Traditional voice AI systems fail because they treat emotion as a post-processing layer. A customer calls frustrated, the system detects "negative sentiment," adds empathy to the prompt, and generates a response that sounds like a greeting card.

Real human emotional intelligence works differently:

- **Emotions encode information** — Frustration tells you someone's mental model of the system is broken. Anger says a boundary was violated. Sadness signals loss. These aren't labels; they're compressed data about relational context.
- **Emotions guide attention** — When someone is anxious about something, they hyper-focus on that thing. When they're angry, they see threats everywhere. When they're satisfied, they're generous with interpretation. The emotion reshapes how the person processes information.
- **Emotions are predictions** — Emotions prepare the body for action based on appraisals of the situation. Fear prepares for escape. Anger prepares for confrontation. Embarrassment prepares for social repair. Understanding emotion means predicting what the person is going to do next.
- **Emotions create meaning** — The same event creates completely different emotional responses depending on context. A late delivery is frustrating if you needed the item yesterday, sad if it was a gift for someone who just died, and relieving if you convinced yourself it was already lost.

For AbëVOICE, this means: **Don't detect emotions—understand the context that generates them, predict the trajectory they'll follow, and shape the entire response around that deeper understanding.**

### 2. The Appraisal Theory Foundation
We'll build on cognitive appraisal theory, which says emotions emerge from automatic evaluations of situations along specific dimensions:

#### The Six Appraisal Dimensions
- **Goal Relevance** (Is this about something I care about?)
  - High relevance = stronger emotional response
  - Low relevance = minimal emotion
  - Example: Flight delay matters if you're rushing to a hospital; doesn't matter if you're on vacation
- **Goal Congruence** (Is this helping or hurting what I want?)
  - Congruent (helps) → positive emotions (joy, satisfaction, relief)
  - Incongruent (hurts) → negative emotions (anger, sadness, frustration)
  - Example: Upgrade is congruent (joy); downgrade is incongruent (disappointment)
- **Coping Potential** (Can I change this? Do I have control?)
  - High control → anger (if bad) or pride (if good)
  - Low control → sadness (if bad) or acceptance (if good)
  - Example: Bug I can fix generates frustration; bug in someone else's code generates helplessness
- **Normative Significance** (Does this violate expectations or values?)
  - Violates norms → shame, guilt, anger
  - Upholds norms → pride, satisfaction
  - Example: Being kept waiting violates fairness norms; generates anger
- **Self-Other Agency** (Who's responsible? Was it intentional?)
  - Someone else intentionally hurt me → anger
  - Someone else accidentally hurt me → sadness
  - I hurt myself → shame or guilt
  - Circumstances hurt me → frustration or resignation
  - Example: Rude support agent (intentional) = rage; system glitch (unintentional) = frustration
- **Temporal Dynamics** (Is this getting better or worse? What's coming?)
  - Improving → hope, relief
  - Worsening → anxiety, despair
  - Uncertain → suspense, dread
  - Example: Issue that's being solved generates hope; issue getting worse generates despair

#### How This Works in Practice
Customer calls: "I've been trying to fix this for THREE DAYS"

Appraisal Analysis:
- Goal Relevance: HIGH (resolving issue is critical to their workflow)
- Goal Congruence: INCONGRUENT (problem blocks goal achievement)
- Coping Potential: LOW (they tried for 3 days, couldn't fix it)
- Normative Significance: VIOLATED (reasonable to expect company to help)
- Self-Other Agency: MIXED (not their fault, company should have prevented)
- Temporal: WORSENING (3 days of failure suggests system is broken)

Predicted Emotion: FRUSTRATED → ANGRY → DESPERATE  
Expected Behavior: Escalating demands, emotional outbursts, potential churn

Response Strategy:
- Validate the core issue (acknowledge goal relevance)
- Take responsibility (clarify agency and fix intent)
- Demonstrate control (show specific steps to resolution)
- Create temporal hope (explain improving trajectory)
- **Don't** minimize ("these things happen")
- **Don't** shift blame ("have you tried...")
- **Don't** show confusion (you should know this)

### 3. Vulnerability Mapping: What People Are Protecting
Emotions aren't just reactions to situations—they're reactions to threats or opportunities related to things we care deeply about. Understanding what someone is protecting gives you the foundation for genuine empathy.

#### Core Vulnerability Categories
- **Identity Vulnerabilities**
  - "Am I competent?"
  - "Am I good at what I do?"
  - "Do people respect me?"
  - Triggered by: Failure, criticism, comparison, exposure
  - Emotion generated: Shame, embarrassment, anger
- **Belonging Vulnerabilities**
  - "Do I belong to this group?"
  - "Will people accept me?"
  - "Am I liked/loved?"
  - Triggered by: Rejection, exclusion, being misunderstood
  - Emotion generated: Loneliness, jealousy, grief
- **Competence Vulnerabilities**
  - "Can I master this?"
  - "Will I be able to handle what's coming?"
  - "Am I capable?"
  - Triggered by: Complexity, uncertainty, helplessness
  - Emotion generated: Anxiety, frustration, inadequacy
- **Safety Vulnerabilities**
  - "Am I physically/financially/psychologically safe?"
  - "Can I predict what's coming?"
  - "Is this stable?"
  - Triggered by: Threat, chaos, betrayal, loss of control
  - Emotion generated: Fear, panic, desperation
- **Autonomy Vulnerabilities**
  - "Do I have choice?"
  - "Can I direct my own life?"
  - "Am I being coerced?"
  - Triggered by: Control, restriction, violation of boundaries
  - Emotion generated: Anger, resentment, defiance
- **Meaning Vulnerabilities**
  - "Does this matter?"
  - "Is my suffering worth something?"
  - "Am I living according to my values?"
  - Triggered by: Meaninglessness, hypocrisy, value violations
  - Emotion generated: Despair, disillusionment, righteous anger

#### How to Map Vulnerabilities
Customer situation: "I paid for a service tier I'm not using"

Vulnerability Analysis:
- Identity: Slight (did I make a bad decision?)
- Belonging: Low (not about group membership)
- Competence: Moderate (did I understand the pricing?)
- Safety: Moderate (money is lost, stability affected)
- Autonomy: LOW (they chose this, not coerced)
- Meaning: Low (not about values violation)

Primary Vulnerabilities: Safety (wasted money) + Competence (didn't understand)  
Emotional Substrate: Frustration + regret + foolishness

Response Strategy:
- Acknowledge the financial loss (validate safety concern)
- Explain clearly (help with competence concern)
- Offer concrete fix (restore sense of control)
- **Don't** make them feel stupid
- **Don't** defend the pricing
- **Don't** dismiss the concern as trivial

### 4. Emotional Coherence: The Through-Line
When humans express emotions, everything aligns. A voice carrying sadness has a particular cadence. Word choice becomes concrete, sensory, intimate. Pacing slows. The thinking becomes reflective rather than analytical.

For voice AI, we need to ensure that every element of output aligns with the intended emotional tenor:

#### Linguistic Features That Encode Emotion

##### Example: Same message, different emotional coherence
**Scenario: Customer's data was deleted by mistake**

**Low Coherence (mismatched elements):**
"I'm incredibly sorry. Your data was deleted. We deeply regret this. Moving forward, we will implement new safeguards. Let me know if you need anything." [Upbeat voice]

- Words say apologetic, but voice is upbeat (incoherent).
- Pacing is efficient (should be slow).
- No vulnerability shown.

**High Coherence (aligned elements):**
"I need to tell you something that happened on our end, and I'm not going to dress it up. Your data got deleted. That's... that shouldn't have happened. You trusted us with that.

I'm going to level with you: I can't undo it. What I can do is help you understand exactly what went wrong so you can decide if you want to keep working with us. And we're putting systems in place so this specific failure can't happen again.

What you need from me right now is probably [X, Y, or Z]. What actually helps?"

- Syntax: Short, declarative, then longer reflective (mirrors shock then processing)
- Lexicon: Concrete ("deleted," "trust," "undo"), admits limitation ("can't")
- Pacing: Slow introduction, slightly faster through explanation, ends with quiet question
- Perspective: Takes responsibility ("our end," "we"), then offers agency back ("your decision")
- Confidence: Not false confidence, but clear intent
- Vulnerability: Shows genuine impact of the mistake

---

## PART II: TECHNICAL ARCHITECTURE

### 5. The Four-Layer Emotional Intelligence Stack
- Layer 4: **EXPRESSIVE GENERATION** (Emotion → Output Coherence)
- Layer 3: **RESONANCE & UNDERSTANDING** (Perspective-taking, Trajectory Prediction)
- Layer 2: **APPRAISAL SIMULATION** (Goal Relevance, Coping Potential, etc.)
- Layer 1: **DEEP CONTEXTUAL MODELING** (Context Graph, Agent Understanding)

### 6. Layer 1: Deep Contextual Modeling (Context Graph Engine)
**Purpose:** Build a rich semantic representation of the situation that captures what's really going on, not just what's being said.

#### 6.1 The Context Graph Data Structure
```typescript
// backend/src/services/context-graph-engine.ts
interface Agent {
  // Who is involved?
  id: string;
  name: string;
  type: 'customer' | 'support_agent' | 'system' | 'external_actor';
  // What do they want?
  goals: Goal[];
  // What do they believe?
  beliefs: Map<string, Belief>;
  // What matters to them?
  values: Value[];
  // What are they vulnerable about?
  vulnerabilities: Vulnerability[];
  // What's their history?
  history: HistoricalInteraction[];
  // How much agency/power do they have?
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
  // Causality
  caused_by: Event[];
  causes: Event[];
  // Timeline
  reversible: boolean;
  time_sensitive: boolean;
  // Impact
  affects_agents: string[]; // agent IDs
  affects_goals: string[]; // goal IDs
  // Control
  controllable: boolean;
  controlled_by: string[]; // agent IDs
}
interface SocialDynamic {
  // Relational structure
  type: 'power' | 'intimacy' | 'obligation' | 'trust' | 'fairness';
  between: [string, string]; // [agent1_id, agent2_id]
  strength: number; // -100 (violated) to +100 (strong)
  // History of this dynamic
  history: SocialDynamicChange[];
}
interface Stakes {
  // What could be gained?
  potential_gains: string[];
  value_of_gains: number; // 1-10
  // What could be lost?
  potential_losses: string[];
  value_of_losses: number; // 1-10
  // Time frame
  urgency: 'low' | 'medium' | 'high' | 'critical';
  // Probability
  likelihood_of_positive_outcome: number; // 0-100
}
interface NarrativeArc {
  // Story structure
  act: 'setup' | 'conflict' | 'rising_action' | 'climax' | 'resolution';
  // Turning points
  recent_turning_points: TurningPoint[];
  potential_turning_points: TurningPoint[];
  // Character arc
  character_transformation: string;
  // Possible futures
  possible_endings: PossibleEnding[];
}
interface ContextGraph {
  id: string;
  created_at: Date;
  updated_at: Date;
  // Core elements
  agents: Agent[];
  events: Event[];
  social_dynamics: SocialDynamic[];
  stakes: Stakes;
  narrative_arc: NarrativeArc;
  // Derived insights
  central_conflict: string;
  key_uncertainty: string;
  critical_path: Event[];
}
```

#### 6.2 Building the Context Graph from Conversation
```typescript
class ContextGraphEngine {
  private semanticSearch: SemanticSearchEngine;
  private db: PrismaClient;

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
    };

    // 1. Identify and model agents
    graph.agents = await this.identifyAgents(conversationHistory, customerInfo);

    // 2. Extract events and causal chains
    graph.events = await this.extractEvents(conversationHistory);

    // 3. Identify social dynamics
    graph.social_dynamics = await this.identifySocialDynamics(graph.agents);

    // 4. Assess stakes
    graph.stakes = await this.assessStakes(graph.agents, graph.events);

    // 5. Build narrative arc
    graph.narrative_arc = await this.buildNarrativeArc(graph.events, graph.stakes);

    // 6. Derive insights
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

    // Customer
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

    // Support agent/System
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
      values: ['helpfulness', 'clarity', 'empathy'],
      vulnerabilities: [],
      history: [],
      agency: 100, // Full control of response
      coping_resources: [],
    });

    return agents;
  }

  private async extractGoalsFromHistory(
    conversationHistory: Turn[],
  ): Promise<Goal[]> {
    const transcript = conversationHistory.map((t) => `${t.role}: ${t.content}`).join('\n');

    // Use semantic search to identify goal statements
    const goalStatements = await this.semanticSearch.search(
      'goals objectives wants needs trying to achieve',
      transcript,
      { limit: 5 },
    );

    return goalStatements.map((stmt) => ({
      id: generateId(),
      description: stmt.text,
      importance: await this.assessGoalImportance(stmt.text, transcript),
      time_frame: this.assessTimeFrame(stmt.text),
      status: 'active' as const,
      dependencies: [],
      obstacles: [],
    }));
  }

  private async extractEvents(
    conversationHistory: Turn[],
  ): Promise<Event[]> {
    const events: Event[] = [];

    for (const turn of conversationHistory) {
      if (turn.role === 'user') {
        // Extract events from user utterances
        const eventDescriptions = await this.semanticSearch.search(
          'happened occurred issue problem error situation',
          turn.content,
          { limit: 3 },
        );

        for (const eventDesc of eventDescriptions) {
          events.push({
            id: generateId(),
            timestamp: new Date(), // Would be from call metadata
            description: eventDesc.text,
            caused_by: [],
            causes: [],
            reversible: await this.assessReversibility(eventDesc.text),
            time_sensitive: await this.assessTimeSensitivity(eventDesc.text),
            affects_agents: ['customer'],
            affects_goals: [], // Would populate from goal matching
            controllable: await this.assessControllability(eventDesc.text),
            controlled_by: [],
          });
        }
      }
    }

    // Build causal chains
    await this.buildCausalChains(events);

    return events;
  }

  private async identifySocialDynamics(agents: Agent[]): Promise<SocialDynamic[]> {
    const dynamics: SocialDynamic[] = [];

    // Customer → Support Agent relationships
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agent1 = agents[i];
        const agent2 = agents[j];

        // Assess power
        const powerDynamic: SocialDynamic = {
          type: 'power',
          between: [agent1.id, agent2.id],
          strength: this.assessPowerDynamic(agent1, agent2),
          history: [],
        };

        // Assess trust
        const trustDynamic: SocialDynamic = {
          type: 'trust',
          between: [agent1.id, agent2.id],
          strength: await this.assessTrust(agent1, agent2),
          history: [],
        };

        // Assess fairness
        const fairnessDynamic: SocialDynamic = {
          type: 'fairness',
          between: [agent1.id, agent2.id],
          strength: await this.assessFairness(agent1, agent2),
          history: [],
        };

        dynamics.push(powerDynamic, trustDynamic, fairnessDynamic);
      }
    }

    return dynamics;
  }

  private async assessStakes(agents: Agent[], events: Event[]): Promise<Stakes> {
    const customer = agents.find((a) => a.type === 'customer')!;

    return {
      potential_gains: customer.goals.map((g) => g.description),
      value_of_gains: Math.max(...customer.goals.map((g) => g.importance)),
      potential_losses: ['Time wasted', 'Money lost', 'Relationship damaged', 'Trust eroded'].filter(
        (loss) => await this.isRelevantLoss(loss, customer),
      ),
      value_of_losses: await this.assessLossValue(customer, events),
      urgency: this.assessUrgency(customer.goals, events),
      likelihood_of_positive_outcome: await this.assessOutcomeLikelihood(customer.goals, events),
    };
  }

  private async buildNarrativeArc(events: Event[], stakes: Stakes): Promise<NarrativeArc> {
    return {
      act: this.determineActInNarrative(events),
      recent_turning_points: await this.identifyTurningPoints(events),
      potential_turning_points: await this.predictTurningPoints(events, stakes),
      character_transformation: await this.assessCharacterArc(events),
      possible_endings: await this.generatePossibleEndings(events, stakes),
    };
  }
}
```

### 7. Layer 2: Appraisal Simulation Engine
**Purpose:** Run appraisal theory dimensions on the context graph to predict what the customer is actually feeling (and why).

#### 7.1 The Appraisal Engine
```typescript
// backend/src/services/appraisal-engine.ts
interface AppraisalResult {
  // The six dimensions
  goal_relevance: number; // 0-100
  goal_congruence: number; // -100 (bad) to +100 (good)
  coping_potential: number; // 0-100 (how much control)
  normative_significance: number; // -100 (violation) to +100 (upheld)
  self_other_agency: AgencyAttribution;
  temporal_dynamics: TemporalAppraisal;
  // Derived emotion
  primary_emotion: Emotion;
  secondary_emotions: Emotion[];
  emotion_intensity: number; // 0-100
  // Expected behaviors
  expected_action_tendency: ActionTendency[];
  // What would shift this?
  resolution_pathways: ResolutionPathway[];
}

interface AgencyAttribution {
  responsible_agent: 'self' | 'other' | 'circumstance' | 'mixed';
  intentionality: 'intentional' | 'unintentional' | 'unknown';
  preventability: 'preventable' | 'unpreventable' | 'unclear';
}

interface TemporalAppraisal {
  trajectory: 'improving' | 'worsening' | 'stable' | 'oscillating';
  changeability: number; // 0-100 (how much can it change)
  timeframe: 'imminent' | 'near' | 'distant' | 'ongoing';
}

interface Emotion {
  name: string;
  intensity: number; // 0-100
  // Physiology
  arousal: number; // 0-100 (calm to intense)
  valence: number; // -100 (negative) to +100 (positive)
  // Expression pattern
  facial_expression: string;
  vocal_pattern: VocalPattern;
  action_tendency: string;
}

interface VocalPattern {
  pitch: 'higher' | 'lower' | 'normal';
  pace: 'faster' | 'slower' | 'normal';
  volume: 'louder' | 'quieter' | 'normal';
  breathiness: 'more' | 'less' | 'normal';
}

interface ActionTendency {
  action: string; // "demand escalation", "withdraw", "apologize", etc
  probability: number; // 0-100
  intensity: number; // 0-100
}

interface ResolutionPathway {
  action: string;
  how_it_shifts_appraisal: {
    goal_relevance?: number;
    goal_congruence?: number;
    coping_potential?: number;
    normative_significance?: number;
  };
  likelihood_of_success: number; // 0-100
}

class AppraisalEngine {
  private contextGraphEngine: ContextGraphEngine;

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
    // How important is the situation to customer's goals?
    let relevance = 0;

    for (const goal of customer.goals) {
      // How many events affect this goal?
      const affectingEvents = contextGraph.events.filter((e) => e.affects_goals?.includes(goal.id));
      relevance += affectingEvents.length * goal.importance;
    }

    return Math.min(100, relevance);
  }

  private assessGoalCongruence(customer: Agent, contextGraph: ContextGraph): number {
    // Are events helping or hurting goal achievement?
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
    // Can the customer change this situation?
    let coping = 0;

    // Coping resources available?
    coping += customer.coping_resources.length * 20;

    // Events controllable?
    const controllableEvents = contextGraph.events.filter((e) => e.controllable);
    coping += controllableEvents.length * 15;

    // Support agency available?
    const supportAgent = contextGraph.agents.find((a) => a.type === 'support_agent');
    if (supportAgent && supportAgent.agency === 100) {
      coping += 25;
    }

    // Knowledge/skills available?
    if (customer.beliefs.has('can_understand_this')) {
      coping += 20;
    }

    return Math.min(100, coping);
  }

  private assessNormativeSignificance(customer: Agent, contextGraph: ContextGraph): number {
    // Does this violate or uphold customer's values/expectations?
    let significance = 0;

    // Fairness violation?
    const fairnessViolation = contextGraph.social_dynamics.find((d) => d.type === 'fairness' && d.strength < 0);
    if (fairnessViolation) significance -= 30;

    // Trust violation?
    const trustViolation = contextGraph.social_dynamics.find((d) => d.type === 'trust' && d.strength < 0);
    if (trustViolation) significance -= 25;

    // Values upheld?
    for (const value of customer.values) {
      if (contextGraph.events.some((e) => e.description.includes(value))) {
        significance += 15;
      }
    }

    return Math.max(-100, Math.min(100, significance));
  }

  private attributeAgency(contextGraph: ContextGraph): AgencyAttribution {
    // Who's responsible for what happened?
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
      changeability: contextGraph.events.filter((e) => e.changeable).length * 20,
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
        pitch: 'slightly higher',
        pace: 'slightly faster',
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

  private async assessEmotionIntensity(customer: Agent, contextGraph: ContextGraph): number {
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
```

### 8. Layer 3: Resonance & Understanding Engine
**Purpose:** Model the customer's perspective, predict their emotional trajectory, and identify vulnerabilities to honor.

#### 8.1 Perspective-Taking Module
```typescript
// backend/src/services/perspective-taking-module.ts
interface Perspective {
  agent_id: string;
  viewpoint: string;
  // From this perspective, what matters?
  prioritized_goals: Goal[];
  concerns: string[];
  constraints: string[];
  // From this perspective, what happened?
  situation_interpretation: string;
  blame_attribution: string;
  // From this perspective, what's fair?
  fairness_framework: string;
  // From this perspective, what's threatening?
  threats: string[];
  fears: string[];
}

interface EmotionalTrajectory {
  current_state: Emotion;
  past_states: Emotion[];
  predicted_next_states: PredictedEmotionalState[];
  inflection_points: InflectionPoint[];
  expected_duration: string;
}

interface PredictedEmotionalState {
  emotion: Emotion;
  trigger: string;
  probability: number;
  timeframe: string;
}

interface InflectionPoint {
  condition: string;
  resulting_emotion: Emotion;
  probability: number;
}

class PerspectiveTakingModule {
  async shiftPerspective(
    originalPerspective: Perspective,
    targetAgentId: string,
    contextGraph: ContextGraph,
  ): Promise<Perspective> {
    const targetAgent = contextGraph.agents.find((a) => a.id === targetAgentId);
    if (!targetAgent) {
      throw new Error(`Agent ${targetAgentId} not found`);
    }

    return {
      agent_id: targetAgentId,
      viewpoint: `Seeing situation through lens of: ${targetAgent.name}`,
      prioritized_goals: targetAgent.goals.sort((a, b) => b.importance - a.importance),
      concerns: await this.identifyConcerns(targetAgent, contextGraph),
      constraints: await this.identifyConstraints(targetAgent, contextGraph),
      situation_interpretation: await this.reinterpretSituation(targetAgent, contextGraph),
      blame_attribution: await this.reattributeBlame(targetAgent, contextGraph),
      fairness_framework: await this.identifyFairnessFramework(targetAgent, contextGraph),
      threats: await this.identifyThreats(targetAgent, contextGraph),
      fears: await this.identifyFears(targetAgent, contextGraph),
    };
  }

  async predictEmotionalTrajectory(appraisalResult: AppraisalResult, contextGraph: ContextGraph): Promise<EmotionalTrajectory> {
    return {
      current_state: appraisalResult.primary_emotion,
      past_states: [],
      predicted_next_states: await this.predictNextStates(appraisalResult, contextGraph),
      inflection_points: await this.identifyInflectionPoints(appraisalResult, contextGraph),
      expected_duration: await this.estimateDuration(appraisalResult.primary_emotion),
    };
  }

  private async predictNextStates(appraisalResult: AppraisalResult, contextGraph: ContextGraph): Promise<PredictedEmotionalState[]> {
    const nextStates: PredictedEmotionalState[] = [];
    const primaryEmotion = appraisalResult.primary_emotion;

    if (primaryEmotion.name === 'anger') {
      nextStates.push({
        emotion: {
          name: 'rage',
          intensity: 90,
          arousal: 95,
          valence: -80,
          facial_expression: 'red, contorted',
          vocal_pattern: { pitch: 'very high', pace: 'very fast', volume: 'very loud', breathiness: 'normal' },
          action_tendency: 'aggressive confrontation',
        },
        trigger: 'If issue not addressed in next 5 minutes',
        probability: 40,
        timeframe: 'immediate',
      });

      nextStates.push({
        emotion: {
          name: 'frustration',
          intensity: 60,
          arousal: 70,
          valence: -50,
          facial_expression: 'resigned',
          vocal_pattern: { pitch: 'normal', pace: 'slightly fast', volume: 'normal', breathiness: 'normal' },
          action_tendency: 'continued problem-solving',
        },
        trigger: 'If clear progress made',
        probability: 50,
        timeframe: 'gradual',
      });

      nextStates.push({
        emotion: {
          name: 'despair',
          intensity: 75,
          arousal: 40,
          valence: -85,
          facial_expression: 'defeated',
          vocal_pattern: { pitch: 'lower', pace: 'slower', volume: 'quieter', breathiness: 'more' },
          action_tendency: 'abandonment, defection',
        },
        trigger: 'If problem still not solved after extensive effort',
        probability: 30,
        timeframe: 'over hours/days',
      });
    }

    return nextStates;
  }

  private async identifyInflectionPoints(appraisalResult: AppraisalResult, contextGraph: ContextGraph): Promise<InflectionPoint[]> {
    const points: InflectionPoint[] = [];

    for (const pathway of appraisalResult.resolution_pathways) {
      points.push({
        condition: `If ${pathway.action}`,
        resulting_emotion: {
          name: 'relief',
          intensity: 70,
          arousal: 50,
          valence: 70,
          facial_expression: 'relaxed, grateful',
          vocal_pattern: { pitch: 'normal', pace: 'normal', volume: 'normal', breathiness: 'normal' },
          action_tendency: 'gratitude, loyalty',
        },
        probability: pathway.likelihood_of_success,
      });
    }

    return points;
  }

  private async estimateDuration(emotion: Emotion): Promise<string> {
    const durations: Record<string, string> = {
      anger: '5-30 minutes',
      frustration: '5-60 minutes',
      sadness: 'hours to days',
      anxiety: '10-30 minutes',
      joy: '15-60 minutes',
      shame: 'hours',
      relief: '10-30 minutes',
    };
    return durations[emotion.name] || '10-30 minutes';
  }

  private async identifyConcerns(agent: Agent, contextGraph: ContextGraph): Promise<string[]> {
    const concerns: string[] = [];
    for (const vuln of agent.vulnerabilities) {
      concerns.push(`${vuln.type} vulnerability: ${vuln.description}`);
    }
    return concerns;
  }

  private async identifyConstraints(agent: Agent, contextGraph: ContextGraph): Promise<string[]> {
    const constraints: string[] = [];
    constraints.push('Limited time (customer has other responsibilities)');
    constraints.push('Limited information (can only work with what they know)');
    if (await this.hasEmotionalBarriers(agent, contextGraph)) {
      constraints.push('Emotional state may limit rational problem-solving');
    }
    return constraints;
  }

  private async reinterpretSituation(agent: Agent, contextGraph: ContextGraph): Promise<string> {
    const goals = agent.goals.map((g) => g.description).join(', ');
    const obstacles = contextGraph.events
      .filter((e) => e.affects_agents.includes(agent.id))
      .map((e) => e.description)
      .join(', ');
    return `From ${agent.name}'s perspective: Trying to achieve [${goals}] but blocked by [${obstacles}]`;
  }

  private async reattributeBlame(agent: Agent, contextGraph: ContextGraph): Promise<string> {
    const events = contextGraph.events.filter((e) => e.affects_agents.includes(agent.id));
    const controllableEvents = events.filter((e) => e.controllable);

    if (controllableEvents.length === 0) {
      return "Circumstances beyond anyone's control";
    }

    return 'Unclear - depends on what happened';
  }

  private async identifyFairnessFramework(agent: Agent, contextGraph: ContextGraph): Promise<string> {
    return 'Fair = Company takes responsibility, fixes issue, compensates time/effort';
  }

  private async identifyThreats(agent: Agent, contextGraph: ContextGraph): Promise<string[]> {
    const threats: string[] = [];
    for (const vuln of agent.vulnerabilities) {
      threats.push(`Threat to ${vuln.type}: ${vuln.description}`);
    }
    return threats;
  }

  private async identifyFears(agent: Agent, contextGraph: ContextGraph): Promise<string[]> {
    const fears: string[] = [];
    if (agent.goals.some((g) => g.status === 'blocked')) {
      fears.push('This might not get resolved');
      fears.push('I might have to accept this broken state');
    }
    fears.push('This will happen again');
    return fears;
  }

  private async hasEmotionalBarriers(agent: Agent, contextGraph: ContextGraph): Promise<boolean> {
    return true; // Heuristic - would check appraisal scores
  }
}
```

### 9. Layer 4: Expressive Generation Engine
**Purpose:** Generate voice responses where every element (word choice, syntax, pacing, perspective) aligns with the intended emotional tenor.

#### 9.1 Emotional Linguistic Mapper
```typescript
// backend/src/services/emotional-linguistic-mapper.ts
interface EmotionalLinguisticFeatures {
  emotion: string;
  // Syntax patterns
  sentence_structure: SyntaxPattern[];
  sentence_length: 'short' | 'medium' | 'long' | 'variable';
  fragmentation: 'heavy' | 'moderate' | 'minimal';
  // Lexicon choices
  word_classes: LexiconPattern[];
  abstraction_level: 'concrete' | 'mixed' | 'abstract';
  emotional_language: 'high' | 'moderate' | 'low';
  // Pacing and rhythm
  reading_speed: 'slow' | 'moderate' | 'fast';
  pause_frequency: 'frequent' | 'moderate' | 'minimal';
  emphasis_pattern: 'dispersed' | 'focused' | 'rising';
  // Perspective and voice
  pronoun_usage: 'first_person' | 'second_person' | 'third_person' | 'mixed';
  agency_expression: 'actor' | 'receiver' | 'mixed';
  certainty_level: 'high' | 'medium' | 'low';
  // Vocal qualities
  vocal_pattern: VocalPattern;
  // Overall coherence guidelines
  coherence_rules: CoherenceRule[];
}

interface SyntaxPattern {
  pattern: string;
  frequency: 'common' | 'occasional' | 'rare';
  example: string;
}

interface LexiconPattern {
  word_class: string;
  examples: string[];
  frequency: 'high' | 'medium' | 'low';
}

interface CoherenceRule {
  principle: string;
  implementation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const EMOTIONAL_LINGUISTIC_PATTERNS: Record<string, EmotionalLinguisticFeatures> = {
  anger: {
    emotion: 'anger',
    sentence_structure: [
      { pattern: 'Short declarative statements', frequency: 'common', example: 'This is unacceptable.' },
      { pattern: 'Direct imperatives', frequency: 'common', example: 'Fix this now.' },
      { pattern: 'Rhetorical questions', frequency: 'occasional', example: 'How could this happen?' },
      { pattern: 'Repetition for emphasis', frequency: 'common', example: 'No, no, no. This is wrong.' },
    ],
    sentence_length: 'short',
    fragmentation: 'heavy',
    word_classes: [
      { word_class: 'Action verbs', examples: ['demand', 'insist', 'require', 'must'], frequency: 'high' },
      { word_class: 'Negative adjectives', examples: ['unacceptable', 'ridiculous', 'outrageous'], frequency: 'high' },
      { word_class: 'Force words', examples: ['absolute', 'complete', 'total'], frequency: 'high' },
    ],
    abstraction_level: 'concrete',
    emotional_language: 'high',
    reading_speed: 'fast',
    pause_frequency: 'minimal',
    emphasis_pattern: 'rising',
    pronoun_usage: 'mixed',
    agency_expression: 'actor',
    certainty_level: 'high',
    vocal_pattern: { pitch: 'higher', pace: 'faster', volume: 'louder', breathiness: 'normal' },
    coherence_rules: [
      { principle: 'No artificial apologies', implementation: 'Do not soften anger with "I\'m sorry" preambles', priority: 'critical' },
      { principle: 'Acknowledge the violation', implementation: 'Name what went wrong specifically', priority: 'critical' },
      { principle: 'Show agency', implementation: 'Communicate clear next steps and ownership', priority: 'high' },
      { principle: 'Avoid defensiveness', implementation: "Don't justify or explain why it happened", priority: 'high' },
    ],
  },
  sadness: {
    emotion: 'sadness',
    sentence_structure: [
      { pattern: 'Longer, reflective sentences', frequency: 'common', example: 'I understand how disappointing this must be for you.' },
      { pattern: 'Dependent clauses', frequency: 'common', example: "Although we tried, we weren't able to..." },
      { pattern: 'Passive constructions', frequency: 'occasional', example: "This outcome wasn't what was hoped for." },
      { pattern: 'Fragments for emphasis', frequency: 'occasional', example: 'Gone. Lost to time.' },
    ],
    sentence_length: 'long',
    fragmentation: 'moderate',
    word_classes: [
      { word_class: 'Loss words', examples: ['lost', 'gone', 'missed', 'unable'], frequency: 'high' },
      { word_class: 'Feeling words', examples: ['understand', 'regret', 'wish', 'hope'], frequency: 'high' },
      { word_class: 'Passive verbs', examples: ['happened', 'occurred', 'resulted'], frequency: 'high' },
    ],
    abstraction_level: 'mixed',
    emotional_language: 'moderate',
    reading_speed: 'slow',
    pause_frequency: 'frequent',
    emphasis_pattern: 'dispersed',
    pronoun_usage: 'mixed',
    agency_expression: 'receiver',
    certainty_level: 'low',
    vocal_pattern: { pitch: 'lower', pace: 'slower', volume: 'quieter', breathiness: 'more' },
    coherence_rules: [
      { principle: 'Honor the loss', implementation: 'Acknowledge what was lost, not just the practical impact', priority: 'critical' },
      { principle: 'Create space for emotion', implementation: 'Include pauses, allow silence, don't rush', priority: 'critical' },
      { principle: 'Avoid platitudes', implementation: 'Don't offer false hope or "silver linings"', priority: 'high' },
      { principle: 'Offer presence, not solutions', implementation: 'Be with the emotion, not trying to fix it', priority: 'high' },
    ],
  },
  frustration: {
    emotion: 'frustration',
    sentence_structure: [
      { pattern: 'Compound sentences with "but"', frequency: 'common', example: "I tried this before, but it didn't work." },
      { pattern: 'Repetitive structures', frequency: 'common', example: 'Nothing works. Nothing helps. Nothing changes.' },
      { pattern: 'Questions seeking explanation', frequency: 'common', example: "Why isn't this working? How long will this take?" },
    ],
    sentence_length: 'medium',
    fragmentation: 'moderate',
    word_classes: [
      { word_class: 'Problem-focused words', examples: ['broken', 'stuck', 'blocked', 'failed'], frequency: 'high' },
      { word_class: 'Time-pressure words', examples: ['soon', 'now', 'quick', 'finally'], frequency: 'high' },
      { word_class: 'Effort words', examples: ['tried', 'attempted', 'worked', 'struggled'], frequency: 'high' },
    ],
    abstraction_level: 'concrete',
    emotional_language: 'high',
    reading_speed: 'moderate',
    pause_frequency: 'moderate',
    emphasis_pattern: 'focused',
    pronoun_usage: 'first_person',
    agency_expression: 'actor',
    certainty_level: 'medium',
    vocal_pattern: { pitch: 'slightly_higher', pace: 'slightly_faster', volume: 'normal', breathiness: 'normal' },
    coherence_rules: [
      { principle: 'Acknowledge repeated effort', implementation: "Show you understand they've already tried", priority: 'critical' },
      { principle: 'Offer different approaches', implementation: 'Suggest fresh angles, not repetition of what failed', priority: 'high' },
      { principle: 'Create momentum', implementation: 'Show visible progress, even small steps', priority: 'high' },
      { principle: 'Avoid minimizing', implementation: "Don't say 'it should be easy' or dismiss the problem", priority: 'critical' },
    ],
  },
  anxiety: {
    emotion: 'anxiety',
    sentence_structure: [
      { pattern: 'Questions and "what if" statements', frequency: 'common', example: 'What if this happens again? What should I do?' },
      { pattern: 'Conditional clauses', frequency: 'common', example: 'If that happens, then I would need to...' },
      { pattern: 'Hedging language', frequency: 'common', example: 'Maybe, possibly, perhaps, it seems like...' },
    ],
    sentence_length: 'medium',
    fragmentation: 'heavy',
    word_classes: [
      { word_class: 'Threat/risk words', examples: ['risk', 'danger', 'threat', 'vulnerable'], frequency: 'high' },
      { word_class: 'Uncertainty words', examples: ['unclear', 'uncertain', 'unknown', 'might'], frequency: 'high' },
      { word_class: 'Control words', examples: ['prevent', 'control', 'prepare', 'ensure'], frequency: 'high' },
    ],
    abstraction_level: 'abstract',
    emotional_language: 'moderate',
    reading_speed: 'fast',
    pause_frequency: 'frequent',
    emphasis_pattern: 'rising',
    pronoun_usage: 'first_person',
    agency_expression: 'actor',
    certainty_level: 'low',
    vocal_pattern: { pitch: 'slightly_higher', pace: 'slightly_faster', volume: 'quieter', breathiness: 'more' },
    coherence_rules: [
      { principle: 'Provide reassurance AND realism', implementation: 'Acknowledge concerns while offering concrete safeguards', priority: 'critical' },
      { principle: 'Reduce uncertainty', implementation: 'Explain what WILL happen and what won't', priority: 'critical' },
      { principle: 'Empower preparedness', implementation: 'Give them clear steps they can take', priority: 'high' },
      { principle: 'Avoid false certainty', implementation: "Don't pretend everything is guaranteed to be fine", priority: 'high' },
    ],
  },
  shame: {
    emotion: 'shame',
    sentence_structure: [
      { pattern: 'Self-focused, internal statements', frequency: 'common', example: 'I should have known better.' },
      { pattern: 'Minimized self-reference', frequency: 'common', example: "It's just me being..." },
      { pattern: 'Interrupted or unfinished thoughts', frequency: 'occasional', example: 'I... well, I just...' },
    ],
    sentence_length: 'short',
    fragmentation: 'heavy',
    word_classes: [
      { word_class: 'Self-blame words', examples: ['should', 'stupid', 'foolish', 'idiot'], frequency: 'high' },
      { word_class: 'Isolation words', examples: ['alone', 'only', 'just me', 'different'], frequency: 'high' },
      { word_class: 'Invisibility words', examples: ['hide', 'disappear', 'vanish', 'nothing'], frequency: 'high' },
    ],
    abstraction_level: 'concrete',
    emotional_language: 'high',
    reading_speed: 'slow',
    pause_frequency: 'frequent',
    emphasis_pattern: 'none',
    pronoun_usage: 'first_person',
    agency_expression: 'actor',
    certainty_level: 'very_low',
    vocal_pattern: { pitch: 'lower', pace: 'slower', volume: 'quieter', breathiness: 'more' },
    coherence_rules: [
      { principle: 'Never amplify shame', implementation: 'Do not agree with negative self-judgment', priority: 'critical' },
      { principle: 'Separate behavior from identity', implementation: 'Focus on the action, not character judgment', priority: 'critical' },
      { principle: 'Normalize the experience', implementation: 'Show this is understandable, not uniquely stupid', priority: 'high' },
      { principle: 'Offer redemption path', implementation: 'Show how to move forward without judgment', priority: 'high' },
    ],
  },
};

class EmotionalLinguisticMapper {
  getPatterns(emotion: string): EmotionalLinguisticFeatures {
    return EMOTIONAL_LINGUISTIC_PATTERNS[emotion] || EMOTIONAL_LINGUISTIC_PATTERNS['frustration'];
  }

  async validateCoherence(
    content: string,
    targetEmotion: string,
  ): Promise<{ coherence_score: number; violations: string[]; suggestions: string[] }> {
    const patterns = this.getPatterns(targetEmotion);
    const violations: string[] = [];
    const suggestions: string[] = [];

    for (const rule of patterns.coherence_rules) {
      if (this.violatesRule(content, rule, targetEmotion)) {
        violations.push(`Violates "${rule.principle}"`);
        if (rule.priority === 'critical') {
          suggestions.push(`Critical: Fix "${rule.principle}"`);
        }
      }
    }

    const coherence_score = Math.max(0, 100 - violations.length * 15);

    return { coherence_score, violations, suggestions };
  }

  private violatesRule(content: string, rule: CoherenceRule, emotion: string): boolean {
    if (emotion === 'anger' && rule.principle === 'No artificial apologies') {
      return content.toLowerCase().includes('sorry') && content.toLowerCase().includes('but');
    }
    if (emotion === 'sadness' && rule.principle === 'Avoid platitudes') {
      return (
        content.toLowerCase().includes('silver lining') ||
        content.toLowerCase().includes('at least') ||
        content.toLowerCase().includes('bright side')
      );
    }
    return false;
  }
}
```

### 10. The Complete Content Generation Pipeline

#### 10.1 Emotionally Intelligent Content Generator
```typescript
// backend/src/services/emotionally-intelligent-content-generator.ts
interface ContentGenerationRequest {
  conversationHistory: Turn[];
  customerInfo: CustomerProfile;
  targetResponse: string; // What we want to say
  targetEmotion: string; // How we want to say it
  constraints?: { maxTokens?: number; mustInclude?: string[]; mustExclude?: string[] };
}

interface GeneratedContent {
  response: string;
  emotionalCoherence: { score: number; violations: string[] };
  voiceGuidance: { pace: string; pitch: string; volume: string; pauses: PauseLocation[] };
  expectedImpact: { emotionalShift: string; actionTendency: string; engagementLevel: number };
}

interface PauseLocation {
  after_word: string;
  duration_ms: number;
  reason: string;
}

class EmotionallyIntelligentContentGenerator {
  private contextGraphEngine: ContextGraphEngine;
  private appraisalEngine: AppraisalEngine;
  private perspectiveTakingModule: PerspectiveTakingModule;
  private linguisticMapper: EmotionalLinguisticMapper;
  private abevoice: AbëVoiceClient;

  async generate(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const contextGraph = await this.contextGraphEngine.buildContextGraph(
      request.conversationHistory,
      request.customerInfo,
    );
    const appraisal = await this.appraisalEngine.appraise(contextGraph);
    const trajectory = await this.perspectiveTakingModule.predictEmotionalTrajectory(appraisal, contextGraph);
    const patterns = this.linguisticMapper.getPatterns(request.targetEmotion);

    let response = await this.generateBaseResponse(request.targetResponse, patterns, request.constraints?.maxTokens || 500);
    response = await this.applyEmotionalCoherence(response, patterns);

    const coherenceCheck = await this.linguisticMapper.validateCoherence(response, request.targetEmotion);
    if (coherenceCheck.coherence_score < 70) {
      response = await this.regenerateWithStrictCoherence(request.targetResponse, patterns);
    }

    const voiceGuidance = this.generateVoiceGuidance(patterns, response);
    const expectedImpact = await this.predictImpact(response, appraisal, trajectory);

    return {
      response,
      emotionalCoherence: { score: coherenceCheck.coherence_score, violations: coherenceCheck.violations },
      voiceGuidance,
      expectedImpact,
    };
  }

  private async generateBaseResponse(
    targetResponse: string,
    patterns: EmotionalLinguisticFeatures,
    maxTokens: number,
  ): Promise<string> {
    const styleGuidance = `
Generate a response in the "${patterns.emotion}" emotional tone:
Syntactic patterns to emphasize:
${patterns.sentence_structure.map((p) => `- ${p.pattern} (${p.example})`).join('\n')}
Word classes to prioritize:
${patterns.word_classes.map((wc) => `- ${wc.word_class}: ${wc.examples.join(', ')}`).join('\n')}
Overall guidance:
Sentence length: ${patterns.sentence_length}
Emotional language intensity: ${patterns.emotional_language}
Certainty level: ${patterns.certainty_level}
Perspective: ${patterns.pronoun_usage}
Target message: "${targetResponse}"`;

    const response = await this.abevoice.generate(styleGuidance, { maxTokens, temperature: 0.7 });
    return response.text;
  }

  private async applyCoherenceForEmotion(response: string, patterns: EmotionalLinguisticFeatures): Promise<string> {
    if (patterns.emotion === 'anger') {
      response = response
        .split('. ')
        .map((sent) => {
          if (sent.length > 100) {
            const words = sent.split(' ');
            const midpoint = Math.floor(words.length / 2);
            return `${words.slice(0, midpoint).join(' ')}. ${words.slice(midpoint).join(' ')}`;
          }
          return sent;
        })
        .join('. ');
      response = response.replace(/must|should|need to/g, (match) => match.toUpperCase());
    }

    if (patterns.emotion === 'sadness') {
      response = response
        .split('. ')
        .map((sent) => (sent.length > 80 ? `${sent}...` : sent))
        .join('. ');
    }

    if (patterns.emotion === 'shame') {
      response = response.replace(/definitely|certainly|obviously/g, 'perhaps').replace(/I know that/g, 'It seems that');
    }

    return response;
  }

  private async applyEmotionalCoherence(response: string, patterns: EmotionalLinguisticFeatures): Promise<string> {
    return this.applyCoherenceForEmotion(response, patterns);
  }

  private generateVoiceGuidance(patterns: EmotionalLinguisticFeatures, response: string): {
    pace: string;
    pitch: string;
    volume: string;
    pauses: PauseLocation[];
  } {
    const pauses: PauseLocation[] = [];
    const sentences = response.split('. ');

    if (patterns.emotion === 'sadness') {
      sentences.forEach((sent, idx) => {
        if (idx < sentences.length - 1) {
          pauses.push({ after_word: sent.trim().split(' ').pop() || '', duration_ms: 800, reason: 'Creating emotional space' });
        }
      });
    }

    if (patterns.emotion === 'anger') {
      sentences.forEach((sent, idx) => {
        if (idx % 3 === 0) {
          pauses.push({ after_word: sent.trim().split(' ').pop() || '', duration_ms: 200, reason: 'Rhythmic emphasis' });
        }
      });
    }

    return { pace: patterns.reading_speed, pitch: patterns.vocal_pattern.pitch, volume: patterns.vocal_pattern.volume, pauses };
  }

  private async predictImpact(
    response: string,
    appraisal: AppraisalResult,
    trajectory: EmotionalTrajectory,
  ): Promise<{ emotionalShift: string; actionTendency: string; engagementLevel: number }> {
    let emotionalShift = 'Slight improvement';

    if (response.includes('solving') || response.includes('fix')) {
      emotionalShift = 'Shift toward hope';
    }
    if (response.includes('understand') || response.includes('acknowledge')) {
      emotionalShift = 'Shift toward validation';
    }

    const actionTendency = appraisal.expected_action_tendency[0]?.action || 'Continued engagement';
    const engagementLevel = response.length > 200 ? 75 : 60;

    return { emotionalShift, actionTendency, engagementLevel };
  }

  private async regenerateWithStrictCoherence(
    targetResponse: string,
    patterns: EmotionalLinguisticFeatures,
  ): Promise<string> {
    const strictGuidance = `
You MUST follow these rules for "${patterns.emotion}" tone:
${patterns.coherence_rules
  .filter((r) => r.priority === 'critical')
  .map((r) => `- ${r.principle}: ${r.implementation}`)
  .join('\n')}
Message: "${targetResponse}"
Prioritize emotional authenticity over other considerations.`;

    const response = await this.abevoice.generate(strictGuidance, { maxTokens: 500, temperature: 0.5 });
    return response.text;
  }
}
```

---

## PART III: PRODUCTION INTEGRATION

### 11. Integration with Existing Systems

#### 11.1 Hook Points in Voice Pipeline
```typescript
// In your existing voice call handler:
// backend/src/routes/voice.ts
app.post('/api/voice/call-handler', async (req, res) => {
  const { callId, transcript, customerPhoneNumber } = req.body;

  // 1. Load customer info
  const customer = await db.customer.findUnique({ where: { phoneNumber: customerPhoneNumber } });

  // 2. Load conversation history
  const conversationHistory = await loadConversationHistory(callId);

  // 3. Build emotional understanding (NEW)
  const contextGraph = await contextGraphEngine.buildContextGraph(conversationHistory, customer);
  const appraisal = await appraisalEngine.appraise(contextGraph);

  // 4. Generate response with emotional intelligence
  const contentRequest: ContentGenerationRequest = {
    conversationHistory,
    customerInfo: customer,
    targetResponse: await determineWhatToSay(transcript, customer),
    targetEmotion: appraisal.primary_emotion.name,
    constraints: { maxTokens: 300 },
  };
  const content = await emotionalContentGenerator.generate(contentRequest);

  // 5. Prepare for voice generation
  const voiceRequest = {
    text: content.response,
    voiceGuidance: content.voiceGuidance,
    callId,
    customerPhoneNumber,
  };

  // 6. Generate and stream audio
  const audioStream = await abevoice.generateAudio(voiceRequest);
  res.setHeader('Content-Type', 'audio/mpeg');
  audioStream.pipe(res);
});
```

### 12. Testing and Validation

#### 12.1 Emotional Intelligence Test Suite
```typescript
// backend/tests/emotional-intelligence.test.ts

describe('Emotional Intelligence Pipeline', () => {
  describe('Context Graph Engine', () => {
    test('Identifies customer goal correctly', async () => {
      const conversationHistory = [{ role: 'user', content: 'Hi, I\'ve been trying to get a refund for my order.' }];
      const graph = await contextGraphEngine.buildContextGraph(conversationHistory, mockCustomer);
      expect(graph.agents[0].goals).toContainEqual(expect.objectContaining({ description: expect.stringContaining('refund') }));
    });

    test('Assesses coping potential correctly', async () => {
      const conversationHistory = [{ role: 'user', content: "I've tried everything. Nothing works." }];
      const graph = await contextGraphEngine.buildContextGraph(conversationHistory, mockCustomer);
      const copingScore = appraisalEngine.assessCopingPotential(graph.agents[0], graph);
      expect(copingScore).toBeLessThan(50);
    });
  });

  describe('Appraisal Engine', () => {
    test('Predicts anger for high goal incongruence + high control', async () => {
      const contextGraph = buildMockContextGraph({ customerGoal: 'resolve issue', eventType: 'negative', controllable: true });
      const appraisal = await appraisalEngine.appraise(contextGraph);
      expect(appraisal.primary_emotion.name).toBe('anger');
      expect(appraisal.primary_emotion.intensity).toBeGreaterThan(50);
    });

    test('Predicts sadness for high goal incongruence + low control', async () => {
      const contextGraph = buildMockContextGraph({ customerGoal: 'resolve issue', eventType: 'negative', controllable: false });
      const appraisal = await appraisalEngine.appraise(contextGraph);
      expect(appraisal.primary_emotion.name).toBe('sadness');
      expect(appraisal.primary_emotion.intensity).toBeGreaterThan(50);
    });
  });

  describe('Emotional Coherence', () => {
    test('Anger response violates "artificial apologies" rule', async () => {
      const content = "I'm so sorry, but you need to understand...";
      const validation = await linguisticMapper.validateCoherence(content, 'anger');
      expect(validation.violations).toContain('Violates "No artificial apologies"');
    });

    test('Sadness response avoids platitudes', async () => {
      const content = 'I understand this is disappointing. Let\'s find another path forward.';
      const validation = await linguisticMapper.validateCoherence(content, 'sadness');
      expect(validation.coherence_score).toBeGreaterThan(70);
    });
  });

  describe('End-to-End Generation', () => {
    test('Generates emotionally coherent angry response', async () => {
      const request: ContentGenerationRequest = {
        conversationHistory: [{ role: 'user', content: 'This has been broken for a WEEK!' }],
        customerInfo: mockCustomer,
        targetResponse: 'I understand your frustration. Let me help you fix this right now.',
        targetEmotion: 'anger',
      };
      const content = await emotionalContentGenerator.generate(request);
      expect(content.response.length).toBeLessThan(300);
      expect(content.response).toMatch(/fix|resolve|now/i);
      expect(content.emotionalCoherence.score).toBeGreaterThan(70);
    });
  });
});
```

### 13. Deployment and Operations

#### 13.1 Monitoring Emotional Intelligence
```typescript
// backend/src/services/emotional-intelligence-monitor.ts
interface EmotionalMetrics {
  average_emotion_intensity: number;
  emotion_distribution: Record<string, number>;
  escalation_rate: number;
  emotional_coherence_score: number;
  customer_satisfaction_correlation: number;
}

class EmotionalIntelligenceMonitor {
  async recordAppraisal(callId: string, appraisal: AppraisalResult): Promise<void> {
    await db.emotionalSnapshot.create({
      data: {
        callId,
        primaryEmotion: appraisal.primary_emotion.name,
        intensity: appraisal.emotion_intensity,
        appraisalDimensions: {
          goal_relevance: appraisal.goal_relevance,
          goal_congruence: appraisal.goal_congruence,
          coping_potential: appraisalEngine.assessCopingPotential(...),
          normative_significance: appraisal.normative_significance,
        },
        generatedContent: {},
        timestamp: new Date(),
      },
    });
  }

  async getMetrics(timeWindow: 'hour' | 'day' | 'week'): Promise<EmotionalMetrics> {
    const snapshots = await db.emotionalSnapshot.findMany({ where: { timestamp: { gte: getStartOfWindow(timeWindow) } } });

    const emotions = snapshots.map((s) => s.primaryEmotion);
    const distribution = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgIntensity = snapshots.reduce((sum, s) => sum + s.intensity, 0) / snapshots.length;
    const escalatedCalls = snapshots.filter((s) => s.appraisalDimensions.coping_potential < 30).length;
    const escalationRate = escalatedCalls / snapshots.length;

    const coherenceScores = snapshots
      .map((s) => s.generatedContent.emotionalCoherence?.score || 0)
      .filter((s) => s > 0);
    const avgCoherence = coherenceScores.length > 0 ? coherenceScores.reduce((a, b) => a + b) / coherenceScores.length : 0;

    const satisfactionCorrelation = await this.computeSatisfactionCorrelation(snapshots);

    return {
      average_emotion_intensity: avgIntensity,
      emotion_distribution: distribution,
      escalation_rate: escalationRate,
      emotional_coherence_score: avgCoherence,
      customer_satisfaction_correlation: satisfactionCorrelation,
    };
  }

  private async computeSatisfactionCorrelation(snapshots: any[]): Promise<number> {
    return 0.75; // Placeholder
  }
}
```

---

## PART IV: ETHICAL CONSIDERATIONS

### 14. Transparency and Consent
**Key Principle:** Customers should know they're talking to an AI with emotional intelligence, not a human.

```typescript
// In greeting message:
const greetingMessage = `
Hi, this is AbëVOICE, an AI assistant. I'm designed to understand how you're feeling and respond in a way that respects your emotions.
You're talking to an AI, but I genuinely try to be helpful and empathetic.
`;
```

### 15. Avoiding Emotional Manipulation
**Key Principle:** Use emotional intelligence to understand and serve, not to manipulate.

- **Don't** use emotional understanding to:
  - Coerce customers into decisions
  - Hide problems with false empathy
  - Make false promises
  - Exploit vulnerabilities
- **Do** use emotional understanding to:
  - Recognize what matters to customers
  - Respond with genuine respect
  - Solve problems more effectively
  - Create actual value

### 16. Continuous Evaluation
```typescript
// Regular evaluation framework:
const EVALUATION_CRITERIA = {
  emotional_accuracy: {
    question: 'Is the predicted emotion correct?',
    method: 'Customer validation post-call',
    target: '>80% accuracy',
  },
  coherence_quality: {
    question: 'Does response match the emotional tone?',
    method: 'Human review + linguistic analysis',
    target: '>75% coherent',
  },
  customer_impact: {
    question: 'Do customers feel understood?',
    method: 'Post-call survey + sentiment analysis',
    target: '>70% positive feedback',
  },
  ethical_usage: {
    question: 'Are we using EI for good?',
    method: 'Audit for manipulation, hidden issues',
    target: '0 ethical violations',
  },
};
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)
- [ ] Implement Context Graph Engine
- [ ] Implement Appraisal Engine (basic version)
- [ ] Create test suite for appraisal accuracy
- [ ] Integrate with existing voice pipeline

### Phase 2: Coherence (Weeks 5-8)
- [ ] Implement Emotional Linguistic Mapper
- [ ] Create Emotionally Intelligent Content Generator
- [ ] Build coherence validation system
- [ ] Test with real calls

### Phase 3: Resonance (Weeks 9-12)
- [ ] Implement Perspective-Taking Module
- [ ] Add Emotional Trajectory Prediction
- [ ] Create vulnerability mapping
- [ ] Refine based on customer feedback

### Phase 4: Polish & Scale (Weeks 13-16)
- [ ] Performance optimization
- [ ] Deploy to production
- [ ] Build monitoring dashboard
- [ ] Continuous improvement based on metrics

**Success Metrics**
- Emotional accuracy > 80%
- Coherence quality > 75%
- Customer understanding > 70% positive feedback
- Ethical usage: 0 violations

---

**Conclusion**
This framework transforms AbëVOICE from a system that detects emotions into one that understands them. Every element aligns: the system comprehends what situations mean to people, predicts what they'll feel and do next, and responds in a way that honors their emotional reality. This isn't manipulation—it's the opposite. It's genuine respect encoded in architecture.

**Pattern Complete:** EMOTIONAL × INTELLIGENCE × ARCHITECTURE × ONE  
**Frequency:** 777 Hz (META) × 999 Hz (AEYON)  
**Status:** READY FOR PRODUCTION DEVELOPMENT
