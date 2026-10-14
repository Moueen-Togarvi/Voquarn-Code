---
title: "AI Incident Response Plan: Preparing for Model Failures"
slug: "ai-incident-response-plan"
description: "Build an AI incident response plan: incident types unique to AI systems, detection, containment including kill switches, investigation with traces, and remediation."
category: "AI Governance"
targetKeyword: "AI incident response plan"
readTime: "5 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
secondaryKeywords: "AI incident response runbook, LLM failure containment, AI agent kill switch, model incident investigation"
---
An **AI incident response plan** adds model-quality, data-access, and tool-action failures to the organisation's existing response process. A service can return HTTP 200 quickly while producing an incorrect answer; availability monitoring alone does not establish that its output is acceptable.

The plan has to account for failures that look like normal operation. [NIST SP 800-61 Revision 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) connects incident response with wider cybersecurity risk management. Use that organisational process rather than creating an AI escalation path disconnected from the people who can revoke access or contact affected customers.

## Incident types specific to AI systems

- **Systematic wrong output.** The system produces incorrect results for a category of inputs, often after a model or prompt change. Detection depends on evaluation and sampling rather than availability monitoring.
- **Data leakage.** Information appearing in an output where it should not, including cross-tenant leakage through retrieval or memory. Detection may come from access tests, monitoring, or a customer report.
- **Unauthorized action.** An agent performing an action outside its permitted set, whether through a permission gap or prompt injection.
- **Cost incident.** Runaway loops or an unexpected usage pattern producing spend far beyond budget, sometimes within hours.
- **Harmful or inappropriate output** reaching users, with reputational and in some cases regulatory consequence.

**Provider incident**, where the upstream model is degraded, deprecated, or unavailable.

## Detection

Add quality monitoring: run a representative evaluation set at an interval appropriate to the risk and alert on a meaningful change from the accepted baseline. Separate a genuine quality regression from an unavailable grading service. [NIST's Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) identifies risks including confabulation and information security; those categories help define what your checks should observe.

Sample production outputs for human review at a rate proportionate to consequence. This is the control that catches systematic errors evaluation sets miss.

Alert on behavioral anomalies: unusual tool sequences, spikes in escalation or authorization denial, cost per task exceeding expected range, and unexpected egress destinations.

Make user reports easy and route them fast. For many AI incidents, a user is the first detector, and a slow reporting path extends the exposure window.

## Containment

Build a kill switch before you need one, and test it. Every AI system should have a documented way to disable it quickly, ideally without a deployment, and someone on call who is authorized to use it.

Define degraded modes as an alternative to full shutdown: disable automated actions while keeping recommendations, fall back to a deterministic path, or route everything to human handling. Partial containment is often the right response and needs to be designed in advance.

For agent systems, containment includes stopping in-flight tasks and preventing queued ones from starting, which is easy to overlook.

## Investigation

Preserve request identifiers, model and prompt versions, retrieved-source identifiers, tool decisions, approval records, and execution outcomes. Store sensitive prompt or output content only where necessary, with redaction, access restrictions, and an agreed retention period. A diagnostic log must not become an uncontrolled second customer database.

The first investigative questions are what changed and when. Model version, prompt, tool definitions, retrieval corpus, and upstream data are the usual candidates, and provider-side model updates you did not initiate belong on that list.

Determine scope: which requests were affected, over what period, and which users or records. This informs notification and remediation decisions. Correlate application records with provider and downstream-system evidence rather than assuming any one log is complete.

Reproduce the failure with a test case, and add it to the evaluation set so the fix is verified and protected against regression.

## Remediation and notification

Fix forward or roll back, with the choice depending on whether you understand the cause. Rolling back to a known-good prompt and model version is often the fastest containment even when the root cause is unclear.

Correct downstream effects. Wrong outputs may have produced wrong records, communications, or decisions that need reversing.

Assess notification obligations for data incidents, regulated decisions, and contractual commitments. Involve legal and privacy functions early rather than after the technical fix.

Run a review that examines detection lag as well as cause. Record which control detected the problem, which control failed, and whether operators could use the documented containment path.

## Example: duplicate CRM updates after an agent retry

Consider a hypothetical appointment assistant that creates duplicate bookings after a timeout. The incident lead first disables booking writes and leaves the read-only schedule view available. Operators pause queued jobs, identify requests sharing the same customer and booking intent, and check the booking system's actual state before retrying anything.

The engineer compares request IDs with tool execution receipts to determine whether the first write succeeded before the timeout. A useful repair is an idempotency key enforced by the booking API, plus a status lookup before retry. Changing the assistant's wording alone would not repair this transaction failure.

Before resuming writes, replay timeout cases against a test booking store and confirm that one approved booking creates one record. Reconcile affected appointments with staff; do not automatically delete apparent duplicates without checking whether they represent real separate visits. The runbook should name who can restart processing and what evidence they need.

## Frequently asked questions

### Who should own AI incidents?

The existing incident function, extended with AI-specific detection and containment, plus the accountable system owner. A separate parallel process fragments response.

### How long should traces be retained?

Match retention to investigation needs, data sensitivity, contractual duties, and applicable rules. Keep durable identifiers and version records where possible, while minimising stored personal content. There is no universal retention duration for every AI system.

### Should users be told an AI system failed?

Where it affected them, yes, and being specific about what was wrong preserves trust better than a general apology.

### Which containment gap should we check first?

A useful first gap to check is whether the disable path actually stops both queued and in-flight actions. This is a review priority, not a measured claim about the frequency of incidents across the industry.

For prevention controls, read the [prompt injection defence guide](/blog/prompt-injection-defense). Explore [our software and web capabilities](/services) or [contact Voquarn Code](/contact) to scope a runbook and containment test for your workflow.
