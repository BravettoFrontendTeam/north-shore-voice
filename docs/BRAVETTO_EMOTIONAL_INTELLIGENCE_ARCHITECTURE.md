# Emotional Intelligence Engine Architecture

**Production-Ready Framework for Voice AI with Genuine Emotional Understanding**

---

## Executive Summary

This document describes the architecture for an emotional intelligence engine that enables voice AI systems to understand emotions deeply—not just detect them—and respond with genuine coherence. The system uses cognitive appraisal theory, vulnerability mapping, and emotional coherence to create responses that honor the customer's emotional reality.

**Status:** Production-ready design document  
**Repository:** `bravetto/north-shore-emathy-engine`  
**Date:** January 2026

---

## The Problem with Traditional Voice AI

Traditional voice AI systems treat emotion as a post-processing layer:

1. Customer calls frustrated
2. System detects "negative sentiment"
3. Adds empathy to the prompt
4. Generates response that sounds like a greeting card

**Result:** Responses feel fake and disconnected.

---

## Our Approach: Deep Emotional Understanding

Instead of detecting emotions, we understand:

- **The context that generates them** (what's really happening)
- **Why they feel what they feel** (appraisal dimensions)
- **Where their emotion is heading** (trajectory prediction)
- **What they're protecting** (vulnerabilities)
- **How to respond with genuine coherence** (aligned linguistic patterns)

**Result:** Responses that feel authentic because they're built on deep understanding.

---

## The Four-Layer Architecture

The system is built in four layers, each building on the one below:

```
┌─────────────────────────────────────────┐
│ Layer 4: EXPRESSIVE GENERATION          │
│ (Emotion → Output Coherence)            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Layer 3: RESONANCE & UNDERSTANDING     │
│ (Perspective-taking, Trajectory)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Layer 2: APPRAISAL SIMULATION          │
│ (Goal Relevance, Coping Potential)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Layer 1: DEEP CONTEXTUAL MODELING      │
│ (Context Graph, Agent Understanding)   │
└─────────────────────────────────────────┘
```

---

## Layer 1: Deep Contextual Modeling

**Purpose:** Build a rich semantic representation of the situation that captures what's really going on, not just what's being said.

### The Context Graph

The Context Graph models:

- **Agents** (who's involved)

  - Goals, beliefs, values, vulnerabilities
  - Agency (how much control they have)
  - Coping resources

- **Events** (what happened)

  - Causal chains (what caused what)
  - Impact (who/what is affected)
  - Control (who can change it)

- **Social Dynamics** (relationships)

  - Power, trust, fairness between agents
  - How relationships are changing

- **Stakes** (what matters)

  - What could be gained or lost
  - Urgency and likelihood of outcomes

- **Narrative Arc** (the story)
  - Where we are (setup, conflict, resolution)
  - Turning points and possible endings

### Example

**Customer says:** "I've been trying to fix this for THREE DAYS"

**Context Graph extracts:**

- **Goal:** Resolve the issue (importance: 10/10, immediate, blocked)
- **Event:** Problem persists for 3 days (affects goal, not controllable by customer)
- **Social Dynamic:** Trust eroding (fairness violated, strength: -60)
- **Stakes:** High urgency, workflow blocked, time wasted
- **Narrative:** Conflict phase, escalating frustration

---

## Layer 2: Appraisal Simulation Engine

**Purpose:** Understand WHY the customer feels what they feel using cognitive appraisal theory.

### The Six Appraisal Dimensions

1. **Goal Relevance** (0-100)

   - How important is this to what they care about?
   - High relevance = stronger emotional response

2. **Goal Congruence** (-100 to +100)

   - Is this helping or hurting their goals?
   - Congruent → positive emotions
   - Incongruent → negative emotions

3. **Coping Potential** (0-100)

   - Can they change this? Do they have control?
   - High control + bad situation → anger
   - Low control + bad situation → sadness

4. **Normative Significance** (-100 to +100)

   - Does this violate their values/expectations?
   - Violation → anger, shame
   - Upholds → pride, satisfaction

5. **Self-Other Agency**

   - Who's responsible? Was it intentional?
   - Someone else intentionally hurt me → anger
   - Someone else accidentally hurt me → sadness
   - I hurt myself → shame

6. **Temporal Dynamics**
   - Is this getting better or worse?
   - Improving → hope
   - Worsening → anxiety, despair

### Emotion Prediction

**Example:** "I've been trying to fix this for THREE DAYS"

**Appraisal:**

- Goal Relevance: **90/100** (critical to workflow)
- Goal Congruence: **-80** (blocking goal)
- Coping Potential: **20/100** (tried for 3 days, can't fix)
- Normative Significance: **-60** (company should help)
- Agency: **OTHER** (company's fault, unintentional)
- Temporal: **WORSENING** (3 days suggests broken system)

**Predicted Emotion:** **FRUSTRATION → ANGRY** (intensity: 85/100)

**Expected Behavior:** Escalating demands, potential churn

---

## Layer 3: Resonance & Understanding

**Purpose:** Model the customer's perspective, predict their emotional trajectory, and identify vulnerabilities to honor.

### Perspective-Taking

Shifts to the customer's viewpoint:

- What matters to them?
- What are their concerns and constraints?
- What's threatening them?

### Emotional Trajectory Prediction

Predicts where their emotion is heading:

**Current state:** Frustration (intensity 85)

**Predicted next states:**

- If issue not addressed in 5 minutes → **Rage** (intensity 90, probability 40%)
- If clear progress made → **Hope** (intensity 60, probability 50%)
- If still broken after extensive effort → **Despair** (intensity 75, probability 30%)

### Vulnerability Mapping

Understands what the customer is protecting:

- **Identity:** "Am I competent?"
- **Belonging:** "Do I belong?"
- **Competence:** "Can I handle this?"
- **Safety:** "Am I safe?"
- **Autonomy:** "Do I have choice?"
- **Meaning:** "Does this matter?"

**Example:** Customer frustrated about wasted money

- **Primary Vulnerabilities:** Safety (money lost) + Competence (didn't understand)
- **Response Strategy:** Acknowledge loss, explain clearly, offer fix

---

## Layer 4: Expressive Generation

**Purpose:** Generate responses where every element aligns with the intended emotional tenor.

### Emotional Coherence

When humans express emotions, everything aligns:

- **Word choice** (lexicon)
- **Sentence structure** (syntax)
- **Pacing** (prosody)
- **Perspective** (pronouns, agency)
- **Voice qualities** (pitch, volume, breathiness)

### Example: Same Message, Different Coherence

**Scenario:** Customer's data was deleted

**Low Coherence (mismatched):**

> "I'm incredibly sorry. Your data was deleted. We deeply regret this. Moving forward, we will implement new safeguards." [Upbeat voice, fast pacing]

- Words say apologetic, but voice is upbeat ❌
- Pacing is efficient (should be slow) ❌
- No vulnerability shown ❌

**High Coherence (aligned):**

> "I need to tell you something that happened on our end, and I'm not going to dress it up. Your data got deleted. That's... that shouldn't have happened. You trusted us with that.
>
> I'm going to level with you: I can't undo it. What I can do is help you understand exactly what went wrong so you can decide if you want to keep working with us."

- **Syntax:** Short declarative, then longer reflective (mirrors shock → processing)
- **Lexicon:** Concrete ("deleted," "trust," "undo"), admits limitation
- **Pacing:** Slow introduction, slightly faster through explanation
- **Perspective:** Takes responsibility, then offers agency back
- **Vulnerability:** Shows genuine impact ✅

### Emotional Linguistic Patterns

Each emotion has specific patterns:

**Anger:**

- Short declarative statements
- Action verbs ("demand," "insist," "require")
- Fast pacing, higher pitch, louder volume
- **Rules:** No artificial apologies, acknowledge violation, show agency

**Sadness:**

- Longer, reflective sentences
- Loss words ("lost," "gone," "missed")
- Slow pacing, lower pitch, quieter, more breathy
- **Rules:** Honor the loss, create space for emotion, avoid platitudes

**Frustration:**

- Compound sentences with "but"
- Problem-focused words ("broken," "stuck," "blocked")
- Moderate pacing, slightly faster
- **Rules:** Acknowledge repeated effort, offer different approaches, create momentum

---

## The Complete Flow

### Step-by-Step Process

1. **Customer speaks:** "I've been trying to fix this for THREE DAYS"

2. **Layer 1 - Build Context Graph:**

   - Extract goals, events, social dynamics, stakes
   - Model the complete situation

3. **Layer 2 - Appraise:**

   - Assess six appraisal dimensions
   - Predict emotion: Frustration → Anger (intensity 85)
   - Predict behavior: Escalating demands

4. **Layer 3 - Understand Perspective:**

   - Shift to customer's viewpoint
   - Predict trajectory: If not fixed → Rage in 5 minutes
   - Identify vulnerabilities: Competence, Safety, Identity

5. **Layer 4 - Generate Coherent Response:**

   - Use anger linguistic patterns
   - Generate response with aligned syntax, lexicon, pacing
   - Validate coherence (must score >70)
   - Add voice guidance (pitch, pace, pauses)

6. **Output:**
   ```typescript
   {
     response: "I hear you — this has been a terrible experience...",
     emotion: "anger",
     intensity: 85,
     pacing: "fast",
     voiceGuidance: {
       pace: "fast",
       pitch: "higher",
       volume: "louder",
       pauses: [...]
     },
     expectedImpact: {
       emotionalShift: "Shift toward hope",
       actionTendency: "Continued engagement"
     }
   }
   ```

---

## Key Principles

### 1. Appraisal-First

Don't detect emotions—understand the context that generates them. The six appraisal dimensions tell you WHY someone feels what they feel.

### 2. Vulnerability-Mapping

Emotions are reactions to threats to what we care about. Understanding vulnerabilities (Identity, Safety, Competence, etc.) tells you what to honor.

### 3. Emotional Coherence

Every element must align: word choice, syntax, pacing, voice. Mismatched elements feel fake.

### 4. Responsibility & Agency

Take responsibility for system faults. Offer clear fixes. Restore agency to the user. Don't blame or minimize.

---

## Integration with Voice Pipeline

### Hook Points

```typescript
// In voice call handler:
app.post('/api/voice/call-handler', async (req, res) => {
  const { callId, transcript, customerPhoneNumber } = req.body;

  // 1. Load customer info
  const customer = await db.customer.findUnique({
    where: { phoneNumber: customerPhoneNumber },
  });

  // 2. Load conversation history
  const conversationHistory = await loadConversationHistory(callId);

  // 3. Build emotional understanding
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
    emotion: appraisal.primary_emotion.name,
    intensity: appraisal.emotion_intensity,
    pacing: content.voiceGuidance.pace,
    callId,
    customerPhoneNumber,
  };

  // 6. Generate and stream audio
  const audioStream = await abevoice.generateAudio(voiceRequest);
  res.setHeader('Content-Type', 'audio/mpeg');
  audioStream.pipe(res);
});
```

---

## Technical Implementation

### Core Services

- **`context-graph-engine.ts`** - Builds context graph from conversation
- **`appraisal-engine.ts`** - Runs appraisal simulation
- **`perspective-taking-module.ts`** - Perspective-taking and trajectory prediction
- **`emotional-linguistic-mapper.ts`** - Linguistic patterns for emotions
- **`emotionally-intelligent-content-generator.ts`** - Complete content generation pipeline

### Data Structures

```typescript
interface ContextGraph {
  agents: Agent[];
  events: Event[];
  social_dynamics: SocialDynamic[];
  stakes: Stakes;
  narrative_arc: NarrativeArc;
}

interface AppraisalResult {
  goal_relevance: number;
  goal_congruence: number;
  coping_potential: number;
  normative_significance: number;
  self_other_agency: AgencyAttribution;
  temporal_dynamics: TemporalAppraisal;
  primary_emotion: Emotion;
  emotion_intensity: number;
  expected_action_tendency: ActionTendency[];
  resolution_pathways: ResolutionPathway[];
}

interface GeneratedContent {
  response: string;
  emotionalCoherence: { score: number; violations: string[] };
  voiceGuidance: { pace: string; pitch: string; volume: string; pauses: PauseLocation[] };
  expectedImpact: { emotionalShift: string; actionTendency: string; engagementLevel: number };
}
```

---

## Testing & Validation

### Test Suite

- **Context Graph Engine Tests** - Verify goal extraction, event modeling
- **Appraisal Engine Tests** - Verify emotion prediction accuracy
- **Emotional Coherence Tests** - Verify linguistic pattern alignment
- **End-to-End Tests** - Complete pipeline validation

### Success Metrics

- Emotional accuracy > 80%
- Coherence quality > 75%
- Customer understanding > 70% positive feedback
- Ethical usage: 0 violations

---

## Ethical Considerations

### Transparency

Customers should know they're talking to an AI with emotional intelligence, not a human.

### Avoiding Manipulation

Use emotional intelligence to understand and serve, not to manipulate:

- ✅ Recognize what matters to customers
- ✅ Respond with genuine respect
- ✅ Solve problems more effectively
- ❌ Coerce customers into decisions
- ❌ Hide problems with false empathy
- ❌ Exploit vulnerabilities

---

## Implementation Roadmap

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

---

## Conclusion

This framework transforms voice AI from a system that detects emotions into one that understands them. Every element aligns: the system comprehends what situations mean to people, predicts what they'll feel and do next, and responds in a way that honors their emotional reality.

**This isn't manipulation—it's genuine respect encoded in architecture.**

---

## References

- Full architecture document: `docs/EMOTIONAL_INTELLIGENCE_ARCHITECTURE.md`
- Agent guidance: `AGENT_PROMPT.md`
- Implementation examples: `backend/src/services/`

---

**Repository:** `bravetto/north-shore-emathy-engine`  
**Status:** Production-ready design  
**Last Updated:** January 2026
