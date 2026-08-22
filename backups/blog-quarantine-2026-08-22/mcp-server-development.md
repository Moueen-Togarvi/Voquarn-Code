---
title: "MCP Server Development: Building Tools Agents Can Use Safely"
slug: "mcp-server-development"
description: "A practical guide to MCP server development: tool design, authorization, schema quality, error handling, testing, and operating a server agents depend on."
category: "Agentic AI"
targetKeyword: "MCP server development"
readTime: "7 min read"
publishedAt: "2026-08-19"
status: "published"
---

**MCP server development** exposes your systems to AI agents through a standard interface. The protocol handles transport and discovery; everything that determines whether the result is safe and useful is in your design choices.

The common mistake is treating an MCP server as a thin wrapper over an existing API. Agents consume tools differently from application code, and a direct port produces servers that are technically working and practically unusable.

## Design tools around tasks, not endpoints

An agent selects a tool by reading its name and description. If you expose forty CRUD operations mirroring your REST API, the agent must compose them correctly, which multiplies failure points and token cost.

Expose task-level operations instead. Rather than `list_customers`, `get_customer`, and `get_orders`, provide `find_customer_orders` taking the identifiers a caller actually has. Fewer, higher-level tools with clear boundaries outperform a complete but granular surface.

Aim for a tool set an experienced human could use correctly from the descriptions alone, without reading source code.

## Write schemas and descriptions as the interface

The schema is the contract and the documentation simultaneously. Invest in it.

Name parameters unambiguously. `since` is worse than `updated_after_iso8601`. Constrain types tightly, using enumerations where the valid set is known, so invalid calls fail at validation rather than producing confusing results.

Write descriptions that state what the tool does, when to use it, when not to use it, and what it returns. Include the failure conditions. A description mentioning "returns at most 100 results, ordered by most recent" prevents an entire class of silent truncation errors.

Mark destructive operations explicitly in the description. Agents behave more cautiously when consequences are stated.

## Enforce authorization outside the model

This is the point where most implementations are unsafe. The agent must never be the thing deciding what it is allowed to do.

Authorize every call server-side against the identity of the requesting user, not a service account with broad rights. If the server holds credentials that exceed the user's own permissions, any prompt injection becomes a privilege escalation.

Validate every input independently of the schema, since a schema constrains shape but not authority. Enforce tenancy isolation in the query layer rather than relying on a filter parameter the agent supplies.

Apply rate and value limits. A refund tool should cap the amount and frequency regardless of what the caller requests.

## Return output agents can act on

Return structured, compact results. Verbose payloads consume context and degrade reasoning quality.

Include only fields the caller needs, and paginate deliberately with explicit indication when results were truncated. Silent truncation causes agents to draw confident conclusions from partial data.

Make errors instructive. `error: invalid_date_range, message: end must be after start, received start=2026-08-19 end=2026-08-01` lets the agent correct itself. A generic 400 causes retries of the same failing call.

## Handle state and idempotency

Agents retry. Make write operations idempotent with a caller-supplied key so a retried refund does not become two refunds.

Avoid hidden session state between calls where possible. Stateless tools are easier to reason about, test, and recover after an interruption.

For long-running work, return a handle immediately and provide a status tool rather than blocking, since timeouts mid-operation are a common source of duplicated side effects.

## Test the way agents actually call

Unit tests on the handlers are necessary but insufficient. Add scenario tests where a model is given a goal and the tool set, and you evaluate whether it selects correctly, supplies valid arguments, recovers from errors, and stops when it should.

Include adversarial cases: instructions embedded in returned data attempting to trigger other tools, requests exceeding the user's permissions, and ambiguous inputs. Retrieved content and tool output are untrusted input and must be treated as such.

Run these evaluations whenever tool descriptions, schemas, or models change, since a description edit can silently alter selection behavior.

## Operate it like production infrastructure

Log every call with the tool name, caller identity, arguments with sensitive fields redacted, outcome, latency, and cost. Without this, diagnosing a bad agent decision is guesswork.

Version the tool surface and deprecate deliberately. Removing or renaming a tool breaks agents that learned to use it.

Set timeouts, concurrency limits, and budgets, and fail safely when they are hit.

## Frequently asked questions

### How many tools should one server expose?

Fewer than instinct suggests. Large surfaces degrade selection accuracy. Split by domain across multiple servers rather than building one exhaustive server.

### Can we reuse our existing REST API directly?

Usually not well. The granularity, error style, and payload size that suit application code work poorly for agent consumption.

### Where should authorization live?

Server-side, bound to the requesting user's identity, enforced in the data access layer. Never in the prompt.

### How do we prevent prompt injection through tool results?

Treat all returned content as untrusted, keep authorization outside the model, require approval for consequential actions, and test with adversarial payloads.

Explore [our software and web capabilities](/services) or [discuss your AI workflow](/contact).
