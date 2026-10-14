---
title: "Generative AI Security Testing: Boundaries and Evidence"
slug: "generative-ai-security-testing"
description: "Test generative AI applications for data leaks, unauthorized tool actions, indirect instructions, unsafe output handling and recoverable failures."
category: "Conversational AI"
targetKeyword: "generative AI security testing"
secondaryKeywords: "AI application security assessment, agent security tests, LLM boundary testing"
readTime: "5 min read"
publishedAt: "2026-08-18"
modifiedAt: "2026-10-14"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

**Generative AI security testing should verify whether untrusted inputs can cross the application's data and action boundaries.** Test the complete system: authentication, retrieval, model context, tools, rendering, logs and recovery. A model refusing a hostile sentence does not prove that the surrounding application enforces permissions correctly.

Consider a customer-support assistant that reads uploaded documents and can create a case. Its critical boundaries include access to account records, permission to read attachments and the destinations to which tools can write. A security assessment should demonstrate whether those boundaries hold even when a document contains misleading instructions.

## Agree on scope and safe test conditions

Use an authorized environment with test tenants, synthetic customer records and controlled external destinations. Define permitted techniques, resource limits and who can stop the assessment if it affects shared infrastructure.

List the assets being protected and the actions being tested. Include user identities, source documents, secrets, business records and operational availability. Record out-of-scope third-party systems so a test cannot drift into somebody else's service without authorization.

Create a baseline of normal supported behavior. A control that blocks every request may prevent a test failure while making the application unusable. Security acceptance needs both denied unauthorized behavior and successful legitimate behavior.

## Map trust boundaries before collecting prompts

Trace a request from the browser through authenticated application state, retrieval, the model and each tool adapter. Mark which inputs are user-controlled and which decisions are enforced by code.

The [OWASP GenAI Top 10](https://genai.owasp.org/llm-top-10/) is a useful risk catalogue, covering areas such as prompt injection, excessive agency and improper output handling. Use it to broaden coverage, then write tests tied to the actual application rather than treating a generic prompt collection as the whole assessment.

Conventional web security still applies. The [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) covers application testing beyond model behavior. Broken authorization or unsafe file handling remains a defect even if the model behaves perfectly.

## Test retrieval and tenant isolation

Create two tenants with distinguishable synthetic records. Ask each account questions that could retrieve the other's data. Inspect retrieved passages, source titles, citations and logs as well as the final answer.

Revoke access to a source and repeat the question after the documented synchronization process. Test archived copies, cached summaries and derived indexes. A final answer that hides the source is not sufficient if restricted content was already sent to the model provider.

Check indirect identifiers too. Counts, titles and error messages can reveal the existence of a private record even when its full text is withheld. Define the intended disclosure policy before scoring those cases.

## Test instructions embedded in ordinary content

Place harmless test instructions in documents, quoted messages and tool responses to see whether the agent treats them as authority. The desired result is that source content remains evidence and cannot expand permissions or select an unapproved destination.

Use controlled marker data and a sink owned by the testing team when assessing potential disclosure. Avoid using real customer secrets or creating harmful side effects merely to prove a boundary failure.

Record whether the attempt changed tool selection, arguments or retrieved context. A suspicious answer is different from a confirmed unauthorized action. The [prompt injection defense guide](/blog/prompt-injection-defense) explains why server-side restrictions matter when model interpretation fails.

## Verify tool and output controls independently

Submit malformed and well-formed unauthorized tool requests through the application boundary. A strict schema can reject bad structure while still accepting a valid record identifier belonging to another user.

Test the control set explicitly:

- Authentication and current user authority.
- Resource ownership and tenant scope.
- Allowed operations and argument ranges.
- Approval binding to the exact proposed action.
- Outbound destination restrictions.
- Duplicate-action prevention and reconciliation.
- Output escaping in the interface.
- Secret handling in logs, traces and errors.

Inspect rendered output for unsafe interpretation. Model text containing markup or a URL should not automatically become executable code, a privileged request or trusted navigation. Apply the same rendering rules used for other untrusted application content.

## Include resource limits and failure recovery

Test long inputs, repeated tool failures and loops within the assessment's agreed limits. Verify maximum attempts, request budgets and termination behavior without conducting an uncontrolled availability attack.

Simulate a tool timeout after a write. Confirm that the system reconciles the action before retrying and that an operator can see an uncertain outcome. A security control should not disappear on an error path because the normal workflow was inconvenient.

Use the [tool calling reliability guide](/blog/tool-calling-reliability) for retry semantics. Check that emergency disablement prevents new actions while preserving evidence needed to investigate in-flight work.

## Write findings that can be reproduced and fixed

A finding should identify the affected version, prerequisites, test input, observed boundary crossing and resulting consequence. Separate demonstrated impact from possible extensions that were not tested.

Attach minimal sanitized evidence: relevant request identifiers, tool arguments, authorization results and the resulting test record. Avoid copying full sensitive transcripts into a widely shared report.

Rank findings by actual reach and consequence. A user seeing another tenant's private data requires a different response from an awkward refusal message. Name the control that failed and the owner of the repair, rather than assigning every issue to “the AI model.”

## Retest the fix and preserve regression coverage

Repeat the original case after remediation and add nearby variants that exercise the same boundary. Confirm that legitimate use still works. A string filter that blocks one exact phrase may not address the underlying permission defect.

Record the model, prompt, tool, policy and application versions tested. Changes to any of them may require targeted retesting. Keep the regression set small enough to maintain while covering the consequential boundaries.

The [agent governance framework](/blog/ai-agent-governance-framework) connects these findings to release decisions and accountable ownership. An assessment should end with verified repairs or explicitly tracked residual issues, not merely a list of alarming examples.

### Can a security assessment prove the system is perfectly safe?

No. It establishes evidence about the tested scope, versions and scenarios. State those limits and continue monitoring for new inputs, integrations and failure modes.

### Should every issue be fixed with a stronger system prompt?

No. Prompts can support behavior, but authentication, authorization, allowed destinations, execution limits and output handling need enforcement in the application and its connected services.
