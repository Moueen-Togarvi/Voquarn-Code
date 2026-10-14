---
title: "Software Discovery Workshop: Agenda, Outputs and Decisions"
slug: "software-development-discovery-workshop"
description: "Plan a software discovery workshop that tests assumptions, maps a real workflow and produces clear scope, evidence gaps and a build-or-stop decision."
category: "Software Development"
targetKeyword: "software development discovery workshop"
secondaryKeywords: "software discovery workshop agenda, product discovery deliverables, discovery phase decision checklist"
readTime: "6 min read"
publishedAt: "2026-08-18"
modifiedAt: "2026-10-14"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

**A software discovery workshop should end with decisions and evidence gaps, not just a long list of features.** Its purpose is to understand a specific problem, expose the assumptions that could invalidate a solution, and decide what to investigate or deliver next. A workshop is one activity within discovery; it cannot replace observation, user research or technical investigation.

The format below suits a business evaluating a new workflow system or an international product team working with engineers in Pakistan. It separates the facilitated meeting from the research needed afterward, so a busy agenda does not create false certainty about cost or delivery.

## Begin with a decision the workshop must enable

Write a question the sponsor can actually answer after the work. “Should we replace the order spreadsheet with a shared approval workflow?” is useful. “What should our digital platform contain?” is too broad to constrain the discussion.

Record why the decision matters now, which users experience the problem, and what evidence currently supports it. If the issue is slow approval, distinguish time spent waiting for a person from time spent entering data. Software may address one without changing the other.

The [GOV.UK discovery guidance](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) treats discovery as understanding a problem before committing to build. It also recognizes stopping as a valid result. A commercial workshop can use that principle without copying a government programme's duration or approval process.

## Bring evidence and the right participants

Invite people who do the work, someone who understands the systems, a decision owner and a facilitator. A workshop attended only by senior sponsors can miss the exceptions handled by operational staff every day.

Before the meeting, request:

- An anonymized example of a completed transaction.
- One example that failed, stalled or required manual correction.
- A rough count of how often the workflow occurs.
- Existing process notes, forms and user instructions.
- Names of systems that hold authoritative records.
- Known access, integration and retention constraints.
- The business deadline and what creates it.
- Decisions the attending sponsor can approve directly.

Remove personal or confidential data that the participants do not need. If evidence cannot be shared, arrange a controlled walkthrough with the system owner. Do not let missing inputs become invented assumptions in the final estimate.

## An illustrative workshop agenda

For a bounded workflow, start with a short review of the problem and the desired decision. Then ask an operator to narrate one real case from trigger to completion. The facilitator records actions, handoffs, information and waiting points without immediately proposing screens.

Next, walk through an exception. Compare the two journeys and identify where a proposed change could create a new failure. Spend a separate session reviewing data ownership and external dependencies with a technical participant.

Close by ranking uncertainties, selecting the smallest next investigation and assigning owners. The sequence matters more than a fixed number of hours. If the group cannot explain the existing workflow or access essential records, schedule research rather than stretching the meeting until everyone agrees with an unsupported guess.

## Worked example: an order-approval process

Imagine a distributor whose branch staff submit orders through email. Managers approve them, warehouse staff reserve stock, and accounting creates invoices. The sponsor initially asks for an approval dashboard.

During the workshop, an operator shows that orders are frequently edited after approval. Another explains that two branches can promise the same remaining stock. These examples change the problem: the system needs explicit order versions and a stock-reservation rule, not merely an approval button.

The team could leave with three decisions. First, approval applies to a particular order version. Second, an edit to quantity cancels the prior approval. Third, the warehouse system remains authoritative for available stock. Each decision has an owner and a consequence for the first release.

One uncertainty remains: does the warehouse system support a reservation operation with a reliable result? That becomes a technical investigation using its documented interface. Until the answer is known, the workshop should not promise an automated, real-time reservation feature.

## Turn opinions into research questions

“Customers will use a portal” is an assumption. Ask which customers, for what task, with what device and alternative. “The integration is easy” becomes a request to demonstrate authentication, a representative read or write, and failure behavior in an approved test environment.

Use an uncertainty list with the assumption, consequence if wrong, current evidence, next test and owner. Prioritize uncertainty that could change the investment decision, rather than the item easiest to investigate.

The [GOV.UK user research planning guide](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service) recommends turning assumptions into research questions and choosing activities that answer them. For this workshop, practical follow-up might include observing an operator, testing a low-fidelity prototype or checking an integration's documented limits. These activities answer different questions; one does not substitute for another.

## Specify the artifacts that survive the meeting

Ask for a process map that participants can correct, a glossary of important terms, and a decision log with reasons. Add an initial boundary for the product: which users and workflow stages it includes, and which systems continue to own their existing responsibilities.

The delivery outline should distinguish confirmed work from conditional work. For example, manual stock confirmation may be feasible now, while automatic reservation depends on the integration test. Explain the fallback openly so the sponsor can decide whether the smaller release still creates value.

Keep estimates tied to their assumptions. Our [SaaS MVP budgeting guide](/blog/saas-mvp-budget-pakistan-scope-acceptance-2026) explains how scope and acceptance shape a budget; discovery supplies evidence for those inputs rather than a universal price per feature.

## Decide whether to proceed, investigate or stop

Proceed when the problem is sufficiently understood, the proposed next step is affordable, and its acceptance can be explained. Investigate further when a critical uncertainty is still testable. Stop when evidence shows that a process change or existing product solves the problem more appropriately.

For remote teams, circulate decisions in writing after the meeting. Record unresolved disagreement instead of treating silence across time zones as approval. A Pakistan-based engineer and an overseas business owner need the same definitions of the workflow even when they do not share every working hour.

Use the [contract checklist](/blog/software-development-contract-checklist) to make discovery outputs, ownership and the next approval point explicit. A workshop purchase should not automatically commit the buyer to a full build.

## Common questions

### Must discovery produce production code?

No. A small technical experiment can answer a feasibility question, but it should be labeled and scoped as an experiment. Production readiness requires additional design, security, verification and operating decisions.

### Can we run discovery in one meeting?

A meeting can align participants and identify questions. Whether discovery is complete depends on the evidence available, not the calendar. If an essential user group or integration has not been investigated, name that gap in the outcome.

### What should we send a facilitator first?

Send the decision you need to make, a representative workflow and the people who can explain it. Our [contact page](/contact) can be used to discuss that starting brief without inventing a complete feature specification in advance.
