# North Shore Empathy Engine

**Production-Ready Emotional Intelligence Framework for Voice AI**

---

## Overview

The North Shore Empathy Engine is a comprehensive framework that enables voice AI systems to understand emotions deeply—not just detect them—and respond with genuine coherence. Built on cognitive appraisal theory, vulnerability mapping, and emotional coherence principles.

---

## Quick Start

### Documentation

- **[Architecture Overview](BRAVETTO_EMOTIONAL_INTELLIGENCE_ARCHITECTURE.md)** - Complete architecture explanation
- **[Full Technical Specification](../EMOTIONAL_INTELLIGENCE_ARCHITECTURE.md)** - Detailed implementation guide
- **[Agent Guidance](../AGENT_PROMPT.md)** - Developer guidelines for working with the system

### Key Concepts

1. **Appraisal-First Approach** - Understand WHY someone feels what they feel
2. **Vulnerability Mapping** - Identify what the customer is protecting
3. **Emotional Coherence** - Ensure all response elements align
4. **Responsibility & Agency** - Take responsibility, restore agency

---

## Architecture

### Four-Layer Stack

```
Layer 4: EXPRESSIVE GENERATION
    ↓
Layer 3: RESONANCE & UNDERSTANDING
    ↓
Layer 2: APPRAISAL SIMULATION
    ↓
Layer 1: DEEP CONTEXTUAL MODELING
```

### Core Components

- **Context Graph Engine** - Builds semantic understanding of situations
- **Appraisal Engine** - Predicts emotions using six appraisal dimensions
- **Perspective-Taking Module** - Understands customer viewpoint and trajectory
- **Emotional Linguistic Mapper** - Ensures response coherence
- **Content Generator** - Complete pipeline for emotionally intelligent responses

---

## Example Flow

**Customer:** "I've been trying to fix this for THREE DAYS"

1. **Context Graph** extracts: Goal (resolve issue), Event (3-day problem), Trust eroding
2. **Appraisal** predicts: Frustration → Anger (intensity 85)
3. **Perspective** identifies: Vulnerabilities (Competence, Safety), Trajectory (→ Rage if not fixed)
4. **Generation** creates: Coherent response with aligned syntax, lexicon, pacing

**Output:** Authentic, empathetic response that honors the customer's emotional reality

---

## Integration

```typescript
// In voice call handler
const contextGraph = await contextGraphEngine.buildContextGraph(history, customer);
const appraisal = await appraisalEngine.appraise(contextGraph);
const content = await emotionalContentGenerator.generate({
  conversationHistory: history,
  customerInfo: customer,
  targetResponse: 'I understand your frustration...',
  targetEmotion: appraisal.primary_emotion.name,
});
```

---

## Status

**Production-Ready Design** - Complete architecture, ready for implementation

---

## Repository

`bravetto/north-shore-emathy-engine`

---

**Built with care for genuine emotional understanding.**
