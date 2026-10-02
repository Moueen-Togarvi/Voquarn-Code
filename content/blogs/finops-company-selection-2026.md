---
title: "Choosing a FinOps Company: What They Do and What They Charge"
slug: "finops-company-selection-2026"
description: "How FinOps providers are structured and priced, the difference between tooling resellers and practitioners, and the terms that decide real savings."
category: "AI Infrastructure"
targetKeyword: "finops company"
secondaryKeywords: "FinOps consulting services, AI cost optimization, cloud unit economics, cloud cost allocation, FinOps vendor selection"
readTime: "6 min read"
publishedAt: "2026-08-31"
status: "published"
cornerstone: true
modifiedAt: "2026-10-03"
allowExcludedTerms: true
---

A **FinOps company** sells cloud cost reduction. The category contains three quite different businesses, and the pricing model tells you which one you are speaking to.

Distinguishing them matters, because the cheapest engagement structure is frequently the most expensive over three years.

## Three business models

**Tooling vendors.** They sell a cost-visibility platform — dashboards, anomaly alerts, allocation reporting, rightsizing recommendations. You do the work.

Genuinely valuable if you have engineers who will act on the data. Worthless if the dashboard becomes something nobody opens. The most common failure in this category is buying visibility without assigning ownership.

Pricing can be a percentage of monitored spend or a subscription. Ask for the actual fee schedule, minimum term, covered accounts, and additional implementation charges.

**Percentage-of-savings consultancies.** They find and implement reductions, taking a contractual share of attributed savings. Compare the proposed percentage, fee cap, baseline, and duration directly.

Attractive because it appears risk-free. The problems are structural. Savings must be measured against a counterfactual baseline that becomes progressively more disputable as your workloads change. And the incentive rewards fast, visible wins — buying reserved capacity, rightsizing instances — over architectural improvements whose savings are harder to attribute.

Also examine what happens to the fee when *your* team finds a saving. Some contracts claim a share of all reductions, not only those the vendor drove.

**Practice-building consultancies.** They establish FinOps capability inside your organisation — allocation and tagging standards, showback or chargeback, budgeting process, engineering accountability. Fixed fee or retainer.

Slower and less immediately gratifying. It is the only model that produces durable results, because cloud cost is generated continuously by engineering decisions and cannot be fixed once.

Request a current assessment quote and a separate support quote tied to cloud accounts, allocation complexity, and engineering involvement.

## Where savings actually come from

Useful for judging whether a proposal is credible:

**Commitment purchasing (20–40% on eligible spend).** Reserved instances, savings plans, committed use discounts. Real, immediate, and mostly a procurement exercise rather than an engineering one. Any competent provider does this. It is also the easiest to claim credit for.

**Rightsizing (10–30% on compute).** Matching instance sizes to actual utilisation. Requires observability and a tolerance for change. Straightforward but ongoing — instances drift back toward oversizing as teams provision defensively.

**Waste elimination (5–20%).** Unattached volumes, idle load balancers, orphaned snapshots, forgotten non-production environments, cross-AZ traffic that need not cross. Unglamorous and reliable.

**Storage tiering (10–40% on storage).** Lifecycle policies moving cold data to cheaper classes. High return, low risk, frequently neglected.

**Architectural change (highly variable).** Replacing an always-on cluster with serverless, consolidating over-provisioned databases, redesigning data transfer paths. Largest potential, longest timeline, hardest to attribute — and therefore systematically underinvested in by percentage-of-savings vendors.

A proposal composed entirely of the first three is real but shallow. It will produce a good first quarter and little thereafter.

## Questions that separate practitioners from resellers

**"What happens to costs after the engagement ends?"** If they cannot describe how your organisation sustains the practice, they are selling a one-time cleanup. Costs regress within two to three quarters.

**"How do you handle allocation for shared infrastructure?"** Shared clusters, common data platforms, and networking are the genuinely hard part of cost allocation. A provider without a considered answer has not worked at depth.

**"What do you change about engineering process?"** Durable cost control comes from engineers seeing cost consequences during design. If the proposal has no process component, savings will erode.

**"Show me a case where savings did not materialise."** Every practitioner has one. An unbroken record of success is a filtered record.

**"How is the baseline defined?"** For percentage-of-savings deals this is the entire commercial substance. Baselines that do not adjust for organic growth mean paying a share of savings that did not occur.

## Contract terms worth negotiating

**Baseline methodology in writing**, including how it adjusts for workload growth, seasonality, and price changes by the cloud provider.

**Fee scope limited to vendor-driven savings.** Excludes reductions your team achieves independently, and excludes cloud-provider price cuts.

**A defined term.** Three years of percentage-of-savings on a large commitment purchase can exceed the value of the work substantially. Two years is common; one is achievable with negotiation.

**Knowledge transfer as a deliverable.** Documentation, runbooks, and training specified and tied to payment.

**No unilateral commitment authority.** The vendor should recommend; you approve. Multi-year commitments made on your behalf constrain architecture decisions for years.

## Doing it in-house first

Much of the initial return does not require a vendor. Before engaging one:

1. **Enable and examine cost allocation tags.** If under 80% of spend is attributable to a team or service, fix that first — no analysis is meaningful without it.
2. **Take the obvious waste.** Unattached storage, idle resources, non-production environments running overnight and at weekends. Usually recovers 5–15% within a fortnight.
3. **Review commitment coverage.** If steady-state compute is on-demand, that is 20–40% left on the table with no engineering work required.
4. **Set storage lifecycle policies.**
5. **Give each team visibility into its own spend.** Showback alone changes behaviour measurably.

Doing this first means a vendor engages with the hard, high-value problems rather than billing you a percentage of the easy wins you could have taken yourself.

## Include AI unit economics in the FinOps brief

The [FinOps Framework](https://www.finops.org/framework/) provides a shared operating framework, but your commercial baseline still needs to be defined. When AI features are part of the product, add model usage, retries, retrieval infrastructure, trace storage, and human review to the cost view. Token totals alone do not explain whether the feature creates value.

Use cost per accepted output or completed workflow alongside reliability. A smaller model may reduce inference charges while increasing corrections; a cached answer may cost less but be stale. Assign an owner who can decide whether that trade is acceptable for the specific task.

- Separate production usage from experiments.
- Attribute shared infrastructure with a documented rule.
- Track commitment coverage without hiding unused capacity.
- Review savings against service quality and workload growth.

## Frequently asked questions

**How much does a FinOps company cost?**
There is no verified universal rate in this guide. Compare subscriptions, savings-share contracts, and fixed-scope assessments using the same account coverage and change responsibilities.

**Is percentage-of-savings a good deal?**
It appears risk-free but incentivises fast attributable wins over architectural improvement, and the baseline becomes disputable as workloads change. Negotiate the baseline methodology explicitly and cap the term.

**What savings are realistic?**
Savings depend on measured waste, commitments, workload growth, and implementation constraints. Require a baseline and an itemised recommendation register before accepting a percentage target.

**Can we do this without a vendor?**
The first tranche, yes — tagging, waste elimination, commitment coverage, storage lifecycle. Vendors add most value on allocation for shared infrastructure and on embedding cost awareness into engineering process.

**Why do costs regress after an engagement?**
Because cloud spend is generated continuously by engineering decisions. A one-time cleanup without process change regresses within two to three quarters. Durability requires ownership inside the organisation.

## Further reading

- [FinOps Foundation framework](https://www.finops.org/framework/)
- [AWS savings plans documentation](https://docs.aws.amazon.com/savingsplans/latest/userguide/)

## Related

- [SaaS application development](/services/saas-apps)
- [Our services](/services)
- [Talk to us](/contact)
