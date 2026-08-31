---
title: "Shadow AI Governance: Finding and Managing Unsanctioned AI Use"
slug: "shadow-ai-governance-2026"
description: "How to discover unsanctioned AI use, assess the actual risk rather than the imagined one, and build policy people follow instead of circumvent."
category: "AI & Automation"
targetKeyword: "shadow ai governance programme"
secondaryKeywords: "shadow ai, unsanctioned ai use, ai governance policy, enterprise ai risk management"
readTime: "6 min read"
publishedAt: "2026-08-31"
status: "published"
cornerstone: true
---

**Shadow AI** is employees using AI tools your organisation has not approved. It is nearly universal, it is mostly benign, and the response it usually receives makes it worse.

The instinct is to block. Blocking drives usage onto personal devices and personal accounts, where you have no visibility at all. You have not reduced the risk; you have removed your ability to see it.

Governance that works starts from discovery and proportionate response, not prohibition.

## Discovering actual usage

You cannot govern what you cannot see. Four sources, in rough order of usefulness:

**Network and DNS logs.** Requests to known AI service domains from corporate networks. Fast, broad, and catches browser-based usage. Misses anything on personal devices or off-network.

**Identity provider logs.** OAuth grants to third-party applications reveal tools that requested access to corporate accounts — often the highest-risk category, because these tools may have ongoing access to mail, files, or calendars.

**Expense data.** Individual subscriptions on personal cards, reimbursed. Reveals sustained, deliberate use rather than experimentation.

**Anonymous survey.** Genuinely anonymous, framed as understanding needs rather than finding violations. This finds personal-device usage that no technical control can see, and the results are usually startling to leadership.

Run all four. Technical signals find sanctioned-device usage; the survey finds everything else. Organisations that rely only on network logs consistently underestimate by a wide margin.

## Assessing risk proportionately

Not all shadow AI carries meaningful risk. Treating it uniformly produces policy nobody follows.

**Low risk — usually fine.** Public information as input, output reviewed by the user: drafting general copy, explaining public concepts, brainstorming, rewriting for tone. No confidential input, no automated action.

**Moderate risk — needs guidance.** Internal but non-regulated information: summarising internal documents, drafting from internal notes, code assistance on non-sensitive repositories. The concern is retention and training use, addressable through tool selection and configuration.

**High risk — needs control.** Regulated or confidential data: customer personal data, financial records, health information, unreleased strategic material, credentials, proprietary source code. Also anything where output drives action without human review.

**Unacceptable.** Regulated data into consumer tools with training-on-input defaults. Automated decisions affecting individuals without oversight. Anything breaching contractual confidentiality with a customer.

The distribution in most organisations is heavily weighted toward the first two categories. Policy that treats a marketing draft the same as a customer database will be ignored on both.

## What the real risks are

Separating genuine concerns from imagined ones:

**Training on input.** Consumer tiers of many services may use input to improve models. Business and enterprise tiers generally do not, contractually. This is the most-cited risk and the most easily solved — by providing an approved tool with the right contractual terms.

**Retention and breach exposure.** Data sent to a service sits in that service's systems under its retention policy. If they suffer a breach, your data is in it. Ask what retention is configured, not merely whether training is disabled.

**Regulatory processing.** Under GDPR and comparable regimes, sending personal data to a third party is processing requiring lawful basis and, usually, a data processing agreement. An employee pasting customer data into a personal-account tool has likely created an unlawful processing activity that your organisation is accountable for.

**Contractual breach.** Customer contracts frequently restrict where their data may be processed and by whom. Shadow AI can breach these without anyone realising.

**Output quality without review.** Confident, wrong output entering work products unchecked. This is a competence and process problem rather than a tooling one, and it does not disappear by choosing an approved tool.

**Over-stated: intellectual property.** The concern that using AI assistance contaminates ownership of output is largely unfounded for typical business use, though positions vary by jurisdiction and specific circumstances. Do not let this dominate a policy discussion at the expense of retention and regulatory concerns, which are concrete.

## Policy that gets followed

Policy fails when it is prohibitive, vague, or unenforceable. Three properties that make it work:

**Provide a sanctioned alternative first.** The single most effective intervention. Most shadow AI exists because people have a real need and no approved way to meet it. An approved enterprise-tier tool with proper contractual terms, made genuinely easy to access, removes most of the incentive. Policy without a provided alternative is a request that people work less effectively, and it will lose.

**Classify by data, not by tool.** "Do not put customer data, credentials, or unreleased financial information into any external AI tool" is memorable and durable. A list of banned tools is out of date within weeks and teaches nothing transferable.

**Make the safe path the easy path.** If the approved tool requires a ticket and three days, people will use the one in their browser. Friction determines compliance far more reliably than policy language.

Additionally: state what happens on accidental disclosure, and make it a reportable incident with a non-punitive first response. Punitive handling guarantees non-reporting, which means you learn about problems from customers rather than from staff.

## A workable sequence

1. **Discover** across all four sources. Establish scale before designing controls.
2. **Categorise findings** by data sensitivity, not by tool count. "Forty tools in use" is less useful than "three tools are receiving customer data."
3. **Provide sanctioned tooling** with enterprise terms — no training on input, defined retention, a DPA in place.
4. **Publish data-classification-based policy**, short enough to remember.
5. **Address high-risk usage directly** with the teams involved, understanding the need before removing the tool.
6. **Monitor continuously.** New tools appear constantly; this is not a one-time exercise.
7. **Review quarterly.** Both the tool landscape and your own usage patterns move quickly.

## What good looks like

An organisation with mature shadow AI governance is not one with zero unsanctioned usage. It is one that:

- Knows approximately what is in use and by whom.
- Has provided good enough sanctioned tooling that most needs are met inside the boundary.
- Has clear, memorable rules about data rather than about tools.
- Treats accidental disclosure as a reportable, non-punitive incident.
- Reviews regularly rather than annually.

Zero shadow AI usually indicates poor visibility rather than good control.

## Frequently asked questions

**How do we find shadow AI use?**
Network and DNS logs, identity provider OAuth grants, expense data, and an anonymous survey. The first three find sanctioned-device usage; only the survey finds personal-device usage, which is typically substantial.

**Should we block AI tools?**
Generally not. Blocking moves usage to personal devices where you have no visibility. Providing a good sanctioned alternative reduces unsanctioned use far more effectively than prohibition.

**What is the biggest actual risk?**
Regulated or confidential data entering consumer-tier tools with training and retention defaults. This creates both a regulatory processing issue and breach exposure, and it is solved by providing an enterprise-tier approved tool.

**How should policy be written?**
By data classification rather than by tool list. Rules about what data may leave the organisation stay valid as tools change; banned-tool lists are stale within weeks.

**How often should this be reviewed?**
Quarterly. The tool landscape moves quickly and internal usage patterns shift with it. Annual review is too slow to be meaningful.

## Further reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [ICO guidance on AI and data protection](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/)

## Related

- [Our services](/services)
- [CRM and management systems](/services/crm-systems)
- [Talk to us](/contact)
