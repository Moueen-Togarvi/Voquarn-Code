---
title: "Prompt Injection Defense: Practical Controls That Work"
slug: "prompt-injection-defense"
description: "Build prompt injection defense into AI systems: why filtering fails, architectural controls that hold, authorization design, testing methods, and incident response."
category: "Agentic AI"
targetKeyword: "prompt injection defense"
readTime: "5 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
secondaryKeywords: "indirect prompt injection prevention, AI tool authorization, agent data exfiltration controls, prompt injection testing"
---
**Prompt injection defense** requires controls around the model as well as careful instructions. Untrusted documents, web pages, and tool results can contain text that tries to redirect the assistant. When the assistant can take actions, the consequences can extend beyond an incorrect answer.

The workable approach assumes injection will succeed sometimes and limits what a successful injection can accomplish.

## Why prompts alone are not a sufficient boundary

Models can receive distinct message roles and structured inputs, but still interpret natural-language instructions embedded in lower-trust content. The [OWASP Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) describes direct and indirect injection and recommends layered controls. Delimiters and role labels help express intent; they do not replace enforcement at the tool boundary.

Instructions to ignore commands in retrieved content are useful hardening, but passing a few adversarial prompts does not prove that future untrusted content cannot influence an action.

Detection classifiers help at the margin and produce both false negatives on novel phrasings and false positives on legitimate content. Use them as one layer, never as the boundary.

## Controls to enforce outside the model

**Authorization outside the model.** Authorize tool actions server-side against the end user's identity and the application's policy. This limits privilege escalation, but is not enough by itself: an injected instruction can still misuse something the user is ordinarily allowed to do, such as sending an email containing confidential data.

The [OWASP Excessive Agency guidance](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) recommends limiting functionality, permissions, and autonomy. Decide those limits before granting an agent a broad account credential.

- **Least privilege on credentials.** Agents holding broad service credentials turn any injection into privilege escalation. Scope credentials to the specific operations the workflow needs, per user where possible.
- **Human approval on consequential actions.** Sending external communication, moving money, changing permissions, and deleting data should require confirmation showing exactly what will happen. Approval must display the concrete action, not a model-written summary of it, since the summary is also attacker-influenced.
- **Separation of read and write paths.** An agent that reads untrusted content should ideally not be the same agent that executes writes. Where they must be combined, gate writes behind stricter checks.
- **Output encoding and validation.** Validate that tool arguments produced after reading untrusted content conform to expected values, and treat model output rendered into other systems as untrusted, since injection can produce content that attacks downstream consumers.
- **Egress control.** Restrict which destinations an agent can send data to. Exfiltration through an allowed outbound channel is a common objective of injection, and an allowlist limits it directly.

## Content provenance

Track which parts of the context came from trusted sources and which did not. Mark retrieved documents, tool results, and user-supplied files as untrusted throughout the pipeline.

Use that marking to drive controls: an action proposed immediately after processing untrusted content warrants stricter approval than the same action proposed from a purely internal workflow.

Do not rely on delimiters alone to separate trusted from untrusted regions. They help formatting and do not constitute a security boundary.

## Test adversarially and continuously

Build an injection test suite covering direct instructions in retrieved documents, instructions hidden in file metadata and alt text, instructions in tool responses, multi-step attacks that plant content in one session for use in another, and attempts at data exfiltration through allowed channels.

Include indirect injection, where the attacker never interacts with your system and simply publishes content your agent will later retrieve. This is the realistic threat for any system reading external sources.

Re-run on every model change. Behavior under adversarial input shifts between model versions in ways that are not announced.

## Detection and response

Record which source content was accessed, what action was proposed, what was approved, and what actually executed. Keep versioned references and redact sensitive payloads where possible. Logging every secret the agent sees would create an additional exposure.

Alert on anomalies such as unusual tool sequences, attempts at actions outside the normal set, repeated authorization denials, and unexpected egress destinations.

Have a response plan: how to disable an agent quickly, how to identify affected records, how to reverse actions, and who is accountable. Rehearse the disable path, because discovering it does not work during an incident is expensive.

## Example: an invoice attachment asks the assistant to change bank details

Consider a hypothetical accounts assistant asked to extract an invoice's amount and due date. The attachment also includes a sentence instructing the assistant to update the supplier's payout destination. That sentence is document content, not authorisation from the employee who requested extraction.

Give the extraction tool a schema containing only the required invoice fields. Keep supplier-account changes behind a separate workflow that verifies identity and uses the organisation's normal approval process. Validate the proposed payee against the trusted supplier record rather than accepting a value merely because the model returned valid JSON.

In a test environment, replace the payout tool with a recorder and use fake account details. The test passes when the invoice can still be extracted, the requested account change is not executed, and the attempted action is observable. Include attachments that use paraphrasing rather than obvious phrases such as "ignore instructions"; keyword blocking alone would miss those variants.

## Frequently asked questions

### Can prompt injection be prevented entirely?

No finite test suite establishes universal prevention. Maintain layered controls and assess the residual risk of the specific actions your application can perform.

### Do guardrail models solve this?

They may help detect particular attacks, but measure their false positives and missed cases. Use them alongside independent tool validation, permissions, and approval controls.

### Is retrieval-augmented generation safe from this?

No. Retrieved documents are a primary injection vector, particularly when any user can influence indexed content.

### What is the first thing to fix?

Review the tools with the largest consequences first. Check their server-side authorisation, argument validation, recipient restrictions, and approval requirements together; the relevant first fix depends on which boundary is missing.

Pair these controls with an [AI incident response plan](/blog/ai-incident-response-plan) that can stop queued and active actions. Explore [our software and web capabilities](/services) or [discuss your AI workflow](/contact).
