# TCPA Compliance Requirements for North Shore Voice Customers

## ⚠️ Legal Notice

**AI-generated voices are considered "artificial prerecorded" calls under TCPA (FCC Feb 2024).**  
**Non-compliance penalties: $500-1,500 per call.**

---

## Customer Checklist (Required BEFORE Outbound Calling)

### Prior Express Written Consent (Marketing Calls)
- [ ] Obtain PRIOR EXPRESS WRITTEN CONSENT for marketing calls
- [ ] Consent must be clear, conspicuous, and unambiguous
- [ ] Consent must include authorization for AI/automated calls
- [ ] Store consent records (call_id, consent_date, consent_type, consent_method)

### Prior Express Consent (Informational Calls)
- [ ] Obtain PRIOR EXPRESS CONSENT for informational calls (appointments, reminders)
- [ ] Consent can be oral or written
- [ ] Must disclose that calls may be automated/AI-powered

### Do Not Call Registry
- [ ] Check National Do Not Call Registry before each call
- [ ] Maintain internal Do Not Call list
- [ ] Process opt-outs within 10 days
- [ ] Honor opt-outs permanently

### Calling Hours
- [ ] Respect calling hours: 8 AM - 9 PM (recipient's local time)
- [ ] Validate recipient timezone before dialing
- [ ] Do not call on holidays (if applicable)

### Call Disclosure
- [ ] Disclose AI voice at call start: "This is an AI-powered call from [Company]"
- [ ] Provide clear identification of caller
- [ ] Include contact information

### Opt-Out Mechanism
- [ ] Provide easy opt-out mechanism (press 9, say "stop", etc.)
- [ ] Process opt-outs immediately
- [ ] Confirm opt-out processing
- [ ] Remove from calling lists within 10 days

---

## North Shore Voice Responsibilities

### Consent Storage
- [ ] Store consent records in database
  - `call_id`: Unique call identifier
  - `consent_date`: When consent was obtained
  - `consent_type`: Written/Oral, Marketing/Informational
  - `consent_method`: How consent was obtained (form, phone, etc.)
  - `phone_number`: Phone number consent applies to

### DNC List Integration
- [ ] Integrate with National Do Not Call Registry API
- [ ] Check before each outbound call
- [ ] Block calls to DNC numbers
- [ ] Log DNC blocks for audit

### Timezone Validation
- [ ] Validate recipient timezone before dialing
- [ ] Check if current time is within allowed hours (8 AM - 9 PM local)
- [ ] Block calls outside allowed hours
- [ ] Log timezone validation results

### Audit Logging
- [ ] Log all outbound calls:
  - Timestamp
  - Phone number (last 4 digits only for privacy)
  - Consent status
  - DNC check result
  - Timezone validation
  - Call outcome
- [ ] Retain logs for 4 years (TCPA requirement)
- [ ] Enable audit trail export

---

## Implementation Timeline

### Week 1 (Current - P0 Launch)
- ✅ **Document TCPA requirements** (this document)
- ✅ **Customer acknowledgment** (add to Terms of Service)

### Week 3 (Post-Launch)
- [ ] Consent storage database schema
- [ ] Consent capture UI/API
- [ ] DNC API integration (FCC registry)
- [ ] DNC check before outbound calls

### Week 4 (Post-Launch)
- [ ] Timezone validation service
- [ ] Timezone check before dialing
- [ ] Audit logging system
- [ ] Log retention policy

### Week 5 (Post-Launch)
- [ ] Opt-out processing automation
- [ ] Opt-out confirmation system
- [ ] Internal DNC list management
- [ ] Compliance reporting dashboard

---

## Legal Disclaimer

**This document provides general guidance only. It is not legal advice.**

**Customers are responsible for:**
- Obtaining proper consent
- Complying with TCPA regulations
- Maintaining compliance records
- Consulting legal counsel for specific situations

**North Shore Voice provides:**
- Technical tools to support compliance
- Documentation and guidance
- Audit logging capabilities

**North Shore Voice does NOT:**
- Provide legal advice
- Guarantee compliance
- Assume liability for customer violations

---

## Resources

- **FCC TCPA Rules**: https://www.fcc.gov/consumers/guides/telemarketing-and-robocalls
- **National Do Not Call Registry**: https://www.donotcall.gov
- **TCPA Compliance Guide**: https://www.fcc.gov/general/telephone-consumer-protection-act-tcpa

---

## Customer Acknowledgment

By using North Shore Voice for outbound calling, customers acknowledge:

1. ✅ They understand TCPA requirements
2. ✅ They will obtain proper consent before calling
3. ✅ They will check Do Not Call lists
4. ✅ They will respect calling hours
5. ✅ They will process opt-outs promptly
6. ✅ They are responsible for compliance
7. ✅ They will maintain compliance records

---

**Last Updated**: $(date)  
**Version**: 1.0.0  
**Status**: P0 Launch Documentation

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

