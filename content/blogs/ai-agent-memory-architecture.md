---
title: "AI Agent Memory Architecture: What to Store and What to Forget"
slug: "ai-agent-memory-architecture"
description: "Design AI agent memory architecture: memory types, retention and scoping rules, permission handling, retrieval quality, and the privacy obligations memory creates."
category: "Agentic AI"
targetKeyword: "AI agent memory architecture"
readTime: "5 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
secondaryKeywords: "agent memory tenant isolation, AI memory deletion, long term agent memory, memory retention policy"
---
**AI agent memory architecture** decides what an agent carries between steps and sessions, and who can retrieve it. Persistent memory can improve continuity, but creates additional data copies and opportunities for stale information or cross-account disclosure.

Design it as a data system with owners, scopes, and retention, not as a feature that accumulates whatever seems useful.

## Distinguish the memory types

- **Working memory** is the current context: the task, recent steps, and tool results. Its persistence is an implementation choice; some frameworks checkpoint task state to a database, so ending a conversation does not necessarily delete it.
- **Episodic memory** records what happened in past interactions: what a user asked, what was done, what the outcome was. It supports continuity across sessions.
- **Semantic memory** holds durable facts: a user's stated preferences, account configuration, established constraints. These are assertions rather than events.
- **Procedural memory** captures how to do things well in your environment, such as corrections that improved past outcomes.

Conflating these produces systems that cannot answer basic operational questions, such as which stored item to delete when a user withdraws consent.

LangGraph's [memory documentation](https://docs.langchain.com/oss/python/langgraph/add-memory) distinguishes thread-level persistence from memory shared across sessions. Its stores support namespaces and deletion operations, but the application still has to authenticate users and derive the correct namespace; a framework feature is not a complete access policy.

## Scope every memory explicitly

Each memory item needs a scope recorded with it: this user only, this account or tenant, this workspace, or global.

Cross-tenant leakage can occur when memory is retrieved by similarity without checking ownership. Semantic relevance does not imply that a user has permission to see an item.

Enforce scope in the retrieval query itself, as a filter applied in the datastore, not as a post-filter over results and never as an instruction in the prompt. A model asked to ignore items it should not see will sometimes use them.

## Decide retention before you launch

Every memory type needs a retention rule and a deletion path.

Set explicit expiry for working state and checkpoints. Episodic memory needs a retention window matched to business need. Semantic memory needs an update and expiry policy too: a previously stated preference may no longer apply.

Map deletion across the primary store, vector index, checkpoints, caches, derived summaries, and backups. The required response depends on applicable law and any valid retention exception. The UK's [ICO erasure guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/) explains that the right is not absolute and discusses backup handling. Do not apply a single legal rule to every client country.

Test that deleted items are no longer available to the live agent, and that a restore process reapplies deletion records before serving restored data. Document backup expiry and access restrictions rather than promising immediate removal from every immutable backup.

## Control what gets written

Do not write everything. Indiscriminate memory accumulates noise, raises cost, degrades retrieval precision, and expands your privacy surface.

Write deliberately: outcomes, corrections, stated preferences, and durable facts. Avoid writing raw conversation transcripts as memory, and avoid writing sensitive categories of data unless there is a documented need and lawful basis.

Have the agent propose memory writes and apply rules to accept them, rather than allowing free-form writes. An allowlist makes accepted memory categories explicit and easier to test.

## Retrieval quality determines usefulness

Poor retrieval makes memory worse than none, because irrelevant recalled items mislead the agent with apparent authority.

Combine semantic similarity with metadata filters on scope, recency, and type. Rank by relevance and recency together, since an old preference that has been superseded should lose to the newer one.

Cap how much memory enters context and evaluate the result. An arbitrary fixed number is not a quality guarantee; compare answer correctness with and without the retrieved items.

Handle contradiction explicitly. A newer inference should not silently override an older verified preference. Store the source and verification status, and ask for clarification when neither record can be treated as authoritative.

## Example: a language preference in a shared client portal

Suppose a hypothetical portal remembers that user U17 in tenant T3 prefers Urdu summaries. Store a preference key with the tenant, user, source, update time, and any expiry. Derive the tenant and user from the authenticated session when reading it; do not accept a model-generated tenant ID as the access filter.

If U17 changes the preference to English, update that key rather than leaving contradictory free-text notes for similarity search to resolve. A request from tenant T4 must never retrieve T3's record, even if the wording is an exact semantic match. Test this using two synthetic users with otherwise identical histories.

When the preference is removed, invalidate the corresponding cache and check whether any summary or checkpoint still contains it. Repeat the check after restoring a test backup. This produces a concrete acceptance test for continuity and deletion without needing to store every past conversation as memory.

## Make it inspectable

Give users an understandable way to inspect and correct persistent preferences where appropriate. Separately determine which access, correction, or erasure duties apply to the personal data and jurisdictions involved.

Log memory reads and writes with the task that caused them. Without this, explaining why an agent behaved a certain way is guesswork, because the deciding input may have been a memory item retrieved silently.

## Frequently asked questions

### Do agents need long-term memory?

Many production workflows do not. Start without it and add it when a specific continuity requirement justifies the cost and privacy obligations.

### Where should memory live?

In systems you already govern, with the same access control, backup, and deletion capabilities as other personal data.

### How do we prevent one user's memory reaching another?

Filter by tenant and user in the retrieval query at the datastore level, and test explicitly for cross-boundary retrieval.

### Does memory make agents more accurate?

It can help when relevant, current, authorised information improves the task. Measure this against a baseline without memory; stale or irrelevant recall can make an answer worse.

For the search-quality side of memory, read [retrieval evaluation metrics](/blog/retrieval-evaluation-metrics). Explore [our software and web capabilities](/services) or [discuss the retention and access boundaries of your AI workflow](/contact).
