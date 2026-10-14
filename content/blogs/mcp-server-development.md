---
title: "MCP Server Development: Contracts, Authorization and Testing"
slug: "mcp-server-development"
description: "Build an MCP server with clear tool contracts, audience-bound authorization, safe resource access, useful errors and tests across real agent clients."
category: "Agentic AI"
targetKeyword: "MCP server development"
secondaryKeywords: "MCP tool design, MCP authorization, MCP integration testing"
readTime: "5 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

**An MCP server should expose a small, understandable capability surface while enforcing authorization and business rules inside the server.** Protocol support makes integration possible; it does not make a tool safe, authorize a user or prove that an agent has selected the right operation.

Suppose a development agency wants clients to query delivery milestones through their preferred assistant. A first server might offer a project-status resource and a tool that finds approved project updates. Later it could allow creating a change request. These operations have different permissions and consequences, so their contracts should make that distinction visible from the beginning.

## Start with the client's job

List the questions the client needs answered and the actions they are allowed to take. “What changed in my project this week?” needs a bounded read across approved updates. It should not require exposing every internal ticket, employee note and database field.

Choose the smallest capability that completes that job. Do not mirror an entire internal REST API automatically. On the other hand, avoid a vague tool such as “manage_project” that accepts arbitrary instructions and hides whether it reads, writes or sends messages.

Use the [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) for the protocol contract. Pin a revision supported by your SDK and intended clients; the July 2026 revision is the documentation referenced here. Keep application policy outside assumptions about a particular assistant's interface.

## Define inputs and outputs for an unfamiliar caller

For project updates, accept an approved project identifier and an explicit date range. Derive the tenant and user from authenticated context. Return update identifiers, dates, summaries and permission-controlled source links, with clear pagination when more results exist.

Descriptions should explain what the operation does, when it is appropriate and what it leaves out. If internal risk notes are excluded, state that the tool returns client-approved updates, rather than implying a complete view of every project record.

Document these contract properties:

- Required identifiers and how a caller obtains them.
- Date formats, time zones and inclusive or exclusive boundaries.
- Maximum result size and continuation behavior.
- Whether results reflect live records or a snapshot.
- Fields intentionally omitted for access or privacy reasons.
- Effects such as notifications or record creation.
- Expected business-error categories.
- The evidence returned when an action completes.

Structured output helps downstream validation, but do not place secret fields in the result and rely on a model to omit them from its answer. Filter at the data boundary.

## Establish authentication and resource-level authorization

For remote HTTP deployments using MCP authorization, follow the protocol's [authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization). It requires validating that an access token is intended for the receiving resource server. A token issued for another API must not be accepted merely because its signature is valid.

Authentication identifies the caller; project-level authorization decides which records that caller may access. Check both on every operation, including pagination and resource reads. A cursor should not allow a user to continue reading after project access has been revoked.

Do not pass the incoming token through to a downstream system that expects a different audience. Use the downstream service's appropriate authorization flow and scope. Store credentials in approved secret handling, and keep them out of tool output, error text and application logs.

Local process transports have a different credential boundary from remote servers. Decide who can launch the process and which environment it inherits rather than copying an HTTP example without understanding its deployment assumptions.

## Treat content and tool metadata as untrusted inputs

A client-approved project update can still contain text copied from an outside supplier. That text must not become authority to change the project or reveal another customer's data. Return it as content with provenance, and keep permission decisions in code.

The protocol's [security guidance](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) covers risks including confused-deputy behavior and unsafe token handling. Apply it to your actual boundary: a server fetching arbitrary URLs, for example, needs controls against requests to private network addresses and unexpected redirected destinations.

Avoid letting user-controlled project fields change a tool's trusted description. Metadata updates should follow the same reviewed release path as the code that executes the operation. The [prompt injection defense guide](/blog/prompt-injection-defense) explains why labels alone do not enforce this separation.

Keep raw shell commands and SQL outside the tool surface. Use typed service calls and parameterized database operations, so a project name containing command syntax remains data. Record operation names, authorization decisions and result identifiers without copying secrets into the audit trail.

## Give failures useful semantics

Distinguish malformed protocol requests from tool execution failures. MCP provides an error result mechanism for operations that run but cannot complete successfully. Return a concise, actionable explanation without exposing stack traces or database details.

For a rejected change request, say whether the project is archived, a required field is missing or the caller lacks permission. Where disclosing existence would leak information, use an appropriately limited response instead of confirming a private project's name.

Set timeouts and response-size limits. A slow upstream service should not hold an agent session indefinitely. If work becomes asynchronous, make acceptance and completion distinct in the supported contract and persist the job state.

## Add writes only after read behavior is proven

A create-change-request tool should produce a durable request identifier and distinguish draft creation from approval. The client asking to propose a change has not necessarily authorized budget changes or deployment.

Protect repeated submissions with an application-level action identifier and a reconciliation path. A lost response should not create two requests or send two emails. Our [tool calling reliability guide](/blog/tool-calling-reliability) provides the detailed retry and ambiguous-outcome design.

Test with two users from different client organizations. Include revoked access, a copied cursor, invalid dates, an oversized result, a malicious source note and a timeout after creation. Verify database outcomes and emitted notifications, not just the returned message.

## Validate with the clients you intend to support

Run discovery, schema validation, tool invocation and error handling through each intended client. Confirm that descriptions and result formats remain understandable when the client presents them differently. An internal SDK unit test cannot establish compatibility with every external host.

Record supported protocol versions and keep a small integration fixture for each workflow. Review changed tool schemas before deployment, especially when existing clients may cache discovery information. Connect consequential operations to [agent acceptance tests](/blog/ai-agent-acceptance-testing-tool-actions-2026).

### Does using MCP remove the need for an ordinary API?

No. An MCP server can reuse an existing authorized service layer. Keeping business rules there helps web, mobile and agent clients apply the same checks.

### Should the server trust a tool's read-only annotation?

Annotations communicate intended behavior; they are not enforcement. The implementation and its credentials must actually restrict the operation, and tests should verify that a read cannot trigger an unintended write.
