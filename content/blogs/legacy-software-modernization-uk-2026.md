---
title: "Legacy Software Modernization in the UK: Approaches and Real Costs"
slug: "legacy-software-modernization-uk-2026"
description: "How UK organisations approach legacy modernisation: strangler fig versus rewrite, cost drivers, procurement realities, and failure patterns."
category: "Software Development"
targetKeyword: "legacy software development uk"
secondaryKeywords: "legacy software modernization uk, legacy system migration uk, application modernisation uk, legacy modernisation cost"
readTime: "7 min read"
publishedAt: "2026-08-31"
status: "published"
cornerstone: true
---

Legacy modernisation fails more often than it succeeds, and it fails in a recognisable way: an eighteen-month programme reaches month twenty-four with the new system incomplete, the old system still running, and both requiring maintenance.

The organisations that succeed generally chose a different shape of programme at the outset. This covers what those choices are, in a UK context where procurement rules and skills availability shape the options.

## Deciding what "legacy" means here

"Legacy" is not a synonym for old. Well-maintained systems run for decades productively. A system is legacy when it obstructs the business in a specific, nameable way:

- **Change is disproportionately expensive.** A modification that should take days takes months, because nobody understands the dependencies.
- **Skills have evaporated.** The people who understand it are retiring, and replacements cannot be hired at any reasonable rate.
- **It blocks required capability.** Integration, real-time processing, or a regulatory requirement the architecture cannot accommodate.
- **Compliance exposure.** Unsupported platform versions with no security patching path.
- **Operational cost is disproportionate** to the value delivered.

Being written in COBOL or running on-premises is not itself a reason to modernise. If a system runs reliably, changes rarely, and blocks nothing, modernising it is expenditure without return. The most valuable output of an assessment is sometimes "leave this alone."

Rank candidates by business obstruction, not technical distaste.

## The approaches, and when each fits

**Rehost ("lift and shift").** Move to cloud infrastructure without changing the application. Fast, comparatively low-risk, and addresses hardware end-of-life and data-centre exit. Does not improve maintainability — you now have the same system with a different hosting bill, occasionally a larger one.

Appropriate for: data-centre exit deadlines, hardware EOL, buying time. Not a modernisation in any deeper sense, and should not be presented internally as one.

**Replatform.** Move with targeted changes — managed database, containerisation, updated runtime. Moderate effort, real operational gains, application logic largely untouched.

**Refactor incrementally (strangler fig).** Build new functionality alongside the old system, route traffic progressively, retire the legacy component by component. Named for the fig that grows around a host tree and eventually replaces it.

This is the approach with the best evidence base for large systems. It delivers value continuously, keeps risk bounded per increment, and can be paused or redirected. It requires an integration layer for the period both systems coexist — a genuine cost, often 15–25% of programme effort, and consistently under-budgeted.

**Rewrite.** Build the replacement, migrate, decommission. Occasionally correct: small systems, or where the domain has changed so fundamentally that the existing logic is not worth preserving.

Usually wrong for large systems, for a well-documented reason. The existing system encodes years of accumulated edge-case handling that nobody has documented and everybody depends on. Rewrites reproduce the visible 80% and discover the remaining 20% through production incidents. Meanwhile the old system needs continued maintenance and the business needs new features, so you fund three things at once.

**Replace with a package.** Adopt commercial software and migrate. Sensible for genuinely commodity functions — payroll, general ledger, CRM. The risk is customisation: heavily customised packages combine the constraints of a package with the maintenance burden of bespoke software.

## Cost drivers

Realistic UK budget ranges for a mid-size business-critical system:

```
Assessment and discovery          £40,000-120,000
Strangler fig (2-3 years)         £800,000-4,000,000
Full rewrite (comparable scope)   £1,500,000-8,000,000+
Rehost only                       £150,000-600,000
```

Wide ranges, because these dominate:

**Undocumented business logic.** The single largest driver. A system with comprehensive documentation and tests costs a fraction of one where behaviour must be archaeologically recovered from code and production observation. Budget genuine discovery time; teams that skip it pay more later, with interest.

**Data migration.** Consistently underestimated. Decades of accumulated data with schema changes, orphaned records, encoding inconsistencies, and business rules encoded in data rather than logic. Expect 20–35% of total programme effort. Cleansing is a business decision requiring business time, not merely a technical exercise.

**Integration surface.** Every downstream consumer is a coordination point. A system with forty integrations is a programme of forty negotiations.

**Parallel running.** Operating both systems during transition — infrastructure, reconciliation, and dual maintenance. Necessary for risk management and always an additional cost.

**Regulatory validation.** In financial services, healthcare, and government, validation and assurance can approach the build cost.

## UK-specific considerations

**Procurement.** Public sector and regulated bodies operate under procurement rules that shape delivery. Frameworks such as G-Cloud and the Digital Outcomes route can shorten timelines considerably compared with full tender. Programme structure should account for procurement duration from the beginning, not treat it as a preliminary.

**GDPR and data residency.** Migration is a processing activity. Data minimisation applies — modernisation is a natural opportunity to stop carrying data you no longer have grounds to hold, and a natural moment for a DPIA. Cross-border processing needs explicit consideration where offshore delivery is involved.

**Skills market.** COBOL, mainframe, and older .NET and Java stacks have a thin and expensive contractor market. This cuts both ways: it raises modernisation urgency and raises the cost of the people who can safely do it. Retaining incumbent knowledge through the programme is usually cheaper than replacing it, even at uncomfortable rates.

**Accessibility obligations.** Public sector bodies must meet WCAG 2.2 AA. Building accessibility in is markedly cheaper than retrofitting, and a modernisation programme that ignores it will need remediation before it can go live.

## How these programmes fail

**Big-bang cutover.** A single switchover date for a business-critical system. When problems appear — and they do — rollback is the only option, and rollback after data has diverged is frequently impossible.

**No decommissioning plan.** The new system launches, the old one stays because something still depends on it, and now two systems need maintenance permanently. Decommissioning must be a funded, scheduled deliverable with a named owner, not an assumed consequence.

**Scope expansion during build.** "While we're rewriting, let's add..." Every addition extends the period of dual running. Freeze functional scope to parity, deliver, then add.

**Losing domain knowledge.** The people who understand the system leave during the programme, often because they see themselves being replaced. Retention through completion matters more than any technology choice.

**Treating it as purely technical.** Modernisation changes processes and requires business decisions about edge cases and data quality. Without sustained business involvement, engineering guesses, and the guesses become defects.

## A shape that works

1. **Assess and prioritise** by business obstruction. Accept that some systems should be left alone.
2. **Instrument the existing system.** Observe real usage before changing anything — dead functionality is common and need not be rebuilt.
3. **Establish the integration layer** enabling coexistence. Foundation for everything after.
4. **Migrate the highest-value, lowest-risk component first.** Prove the approach where failure is survivable.
5. **Deliver continuously**, retiring legacy components as their replacements go live.
6. **Fund decommissioning explicitly**, with dates and an owner.

The characteristic that distinguishes successful programmes is not technology selection. It is that value arrives continuously rather than at the end, which keeps sponsorship intact through the inevitable difficult periods.

## Frequently asked questions

**Rewrite or incremental modernisation?**
Incremental for anything large or business-critical. Rewrites fail because undocumented edge-case handling is discovered in production rather than in analysis. Rewrites suit small systems or domains that have fundamentally changed.

**What does it cost in the UK?**
A mid-size business-critical system typically runs £800,000–4,000,000 over two to three years incrementally. Rehosting alone is £150,000–600,000 but does not improve maintainability.

**What is most underestimated?**
Data migration, at 20–35% of effort, and the integration layer for coexistence at 15–25%. Both are consistently under-scoped because neither produces visible features.

**How long should it take?**
Incremental programmes deliver value within three to six months and run two to three years to completion. Any plan promising full replacement of a large system within twelve months should be examined closely.

**Should we offshore it?**
Discovery and domain-heavy analysis benefit from proximity to the business. Implementation offshores effectively once the domain is understood. Offshoring discovery on an undocumented system tends to be expensive.

## Further reading

- [UK Government Digital Marketplace frameworks](https://www.gov.uk/digital-marketplace)
- [Martin Fowler on the strangler fig pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)

## Related

- [CRM and management systems](/services/crm-systems)
- [Our services](/services)
- [Talk to us](/contact)
