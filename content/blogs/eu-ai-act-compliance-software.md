---
title: "EU AI Act for Software Teams: Roles, Dates and Delivery Evidence"
slug: "eu-ai-act-compliance-software"
description: "Review EU AI Act roles, application dates and engineering evidence for software teams using third-party models, with current Commission references."
category: "AI Governance"
targetKeyword: "EU AI Act compliance software"
secondaryKeywords: "AI Act provider vs deployer, EU AI Act application dates, AI software documentation, third-party model responsibilities"
readTime: "4 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
---

**EU AI Act obligations for software teams depend on the system, intended use, your role and the applicable date.** Using a third-party model API does not automatically make a company only a deployer. A business that develops or commissions a system and supplies it under its own name may be a provider.

This engineering overview was reviewed on 14 October 2026. It helps teams prepare evidence for qualified legal review; it does not classify a particular product or establish that it complies.

## Identify the organization’s role for each system

The Commission's [Article 3 text](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-3) distinguishes providers that develop or commission and market or put systems into service under their name from deployers using systems under their authority.

Map the model, the application and its customer separately. For example, an API supplier may provide the underlying model while another business builds and brands the application. The application business can have obligations of its own. One organization can occupy different roles for different activities.

Record who defines the intended purpose, whose name appears on the product, who operates it and who makes consequential changes. Give that record to counsel instead of selecting a role from the technology stack.

## Use the current application schedule

The Commission's [AI Act overview](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) states that the AI Omnibus entered into force on 27 July 2026. Its service desk presents consolidated text reflecting those amendments. This is different from relying on an earlier proposal or political announcement.

The current [Article 113 schedule](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113), checked for this review, includes:

- **Chapters I and II, subject to specified exceptions.** 2 February 2025.
- **Listed governance and general-purpose model provisions.** 2 August 2025.
- **General application date.** 2 August 2026.
- **Specified newly added prohibited-practice provisions.** 2 December 2026.
- **Listed high-risk provisions for Article 6(2)/Annex III systems.** 2 December 2027.
- **Listed high-risk provisions for Article 6(1)/Annex I systems.** 2 August 2028.

These are schedule entries, not one blanket deadline for every business. Check the exact provision, transitional treatment and current consolidated law with counsel. An extension for specified high-risk requirements does not postpone all other duties.

## Classify the intended use before designing controls

[Article 6](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-6) sets the high-risk classification framework. A broad label such as “HR software” or “healthcare AI” is not a complete classification. Document what the system actually does, the decision it influences and any claimed exception.

A scheduling assistant and a tool that ranks employment candidates can have different purposes and consequences even if both use the same model. Record where human review happens and whether that person can reject or correct the output in practice.

Assess [Article 50 transparency requirements](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50) separately. Disclosure and synthetic-content duties have defined conditions and exceptions; do not reduce them to a universal rule that every AI-generated sentence needs an identical label.

## Assemble an inspectable engineering record

Once the legal assessment identifies duties, turn them into named delivery artifacts:

- A system inventory with purpose, owner, suppliers and deployment context.
- A role and classification record with the legal reviewer and review date.
- Data-flow diagrams showing inputs, outputs, storage and external transfers.
- Versioned evaluation cases covering the intended use and meaningful failure modes.
- Human-review screens and evidence that intervention works.
- Access, logging and retention settings matched to the agreed obligations.
- Supplier documentation and a process for handling model or service changes.
- Incident escalation and correction responsibilities.

These are practical preparation items. Their presence alone is not certification, and every product does not require the same set or level of documentation.

## Connect change management to the assessment

Review changes to intended purpose, affected users, autonomy, data sources and model behavior. A feature that starts as drafting assistance may later influence a consequential decision.

Keep the assessment with the release record so engineers can identify which assumptions changed. The [AI agent acceptance-testing guide](/blog/ai-agent-acceptance-testing-tool-actions-2026) provides examples of testable tool actions and human approval paths.

## Frequently asked questions

### Are Pakistan-based suppliers automatically outside scope?

No geographical assumption is sufficient. EU market placement, use and other scope conditions need assessment for the actual arrangement.

### Does using an API make us a deployer?

Not necessarily. Building or commissioning and supplying your own system can create a provider role; operating systems can create a deployer role. Assess the activities separately.

### Is an AI Act checklist proof of compliance?

No. It can organize work, but legal classification, applicable duties and supporting evidence need qualified review.

For engineering support with [AI and software delivery](/services), [share the intended workflow](/contact) together with the responsibilities established by your legal team.
