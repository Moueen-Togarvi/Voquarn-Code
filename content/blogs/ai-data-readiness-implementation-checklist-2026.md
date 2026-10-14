---
title: "AI Data Readiness Checklist: Sources, Access and Quality"
slug: "ai-data-readiness-implementation-checklist-2026"
description: "Assess AI data readiness through source ownership, parsing checks, permission tests, current records, deletion handling and a representative evaluation set."
category: "AI & Automation"
targetKeyword: "AI data readiness checklist"
secondaryKeywords: "AI source data quality, RAG data preparation, data readiness assessment"
readTime: "5 min read"
publishedAt: "2026-08-20"
modifiedAt: "2026-10-14"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

**Data is ready for an AI workflow when the team can identify its owner, use it for the intended purpose, retrieve the correct current records and verify answers against representative examples.** A large document collection or a successful upload is not enough. Readiness depends on the task the system must perform.

Consider a service assistant answering equipment-maintenance questions. Its inputs include manuals, product identifiers, service bulletins and customer-specific contracts. A wrong manual version can produce an incorrect answer even when text extraction and vector search work perfectly. The assessment must inspect those relationships before selecting a model.

## Define questions and decisions before inventorying everything

Choose a bounded question family, such as identifying the maintenance schedule for an exact equipment model. Write examples of answerable, ambiguous and out-of-scope questions. Specify whether the assistant provides information or also initiates a service action.

This task definition determines which fields matter. Model number, serial range, bulletin date and region may be essential; a marketing description may be irrelevant. Avoid spending the first phase ingesting every shared drive without a way to judge whether the result supports the intended question.

Document the required source evidence for an acceptable answer. If the team cannot find a trusted answer manually, the model should not be expected to create one reliably from the same incomplete records.

## Build a source register with accountable owners

For each source, record its authority and lifecycle. A useful register contains:

- System and stable source identifier.
- Business owner who can resolve factual disputes.
- Intended use and approved audience.
- Data classification and applicable access policy.
- Format, language and known extraction limitations.
- Effective date and expected update frequency.
- Replacement, correction and deletion process.
- Links to downstream indexes or derived records.

Distinguish an authoritative manual from an informal support note. Both may be useful, but the answer should not promote an unreviewed workaround into the manufacturer's official procedure. Mark unresolved source conflicts for human review.

## Profile the fields that determine correctness

Measure completeness and validity on critical fields. For the equipment example, check how often a document lacks a model identifier, contains an obsolete part number or refers to a serial range in a scanned image.

Report the denominator and sample method. “Most records look fine” is not a readiness result. Inspect common formats and deliberately difficult examples: multi-column PDFs, low-quality scans, bilingual manuals, spreadsheets with merged headings and documents containing superseded pages.

Handle duplicate identity separately from duplicate text. Two manuals may share many instructions while applying to different models. Removing repeated paragraphs indiscriminately could remove the very qualification that distinguishes them.

## Inspect extracted content and retrieval boundaries

Compare parsed output with the source document. Check whether headings, tables, units, warning notes and page references remain associated. A parser that separates a maintenance interval from its condition can create a misleading chunk without producing an obvious error.

Microsoft's [document chunking guidance](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents) explains approaches for preparing content for retrieval. Treat chunk size as an experiment tied to your questions, not a universal number. Preserve enough context to interpret the retrieved passage accurately.

Store source references and version information with each derived segment. If an answer cites a page, a reviewer should be able to open that page and verify the statement. Our [retrieval metrics guide](/blog/retrieval-evaluation-metrics) helps test the evidence path independently of response generation.

## Prove permissions survive ingestion

Reading a document into a search index creates another access boundary. Preserve the source's relevant access metadata and enforce the intended user restrictions before content enters the model context.

The [Azure AI Search access-control overview](https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview) describes different document-level approaches, including security filters and features with preview limitations. Choose an approach supported by your source and deployment; do not assume an ingestion connector automatically reproduces every permission relationship.

Test a user with access and another without it using the same question. Check snippets, citations, titles, counts and generated summaries for leakage. Then revoke access and repeat the test after the expected synchronization process.

An application should derive identity from authenticated context. A caller-controlled “allowed groups” field is not a trustworthy permission source merely because it produces a syntactically valid search filter.

## Establish freshness and deletion behavior

Define how quickly a new bulletin must affect answers. Track source modification, ingestion completion and query visibility separately. A connector reporting success does not prove that an updated passage is the one being retrieved.

Correct one deliberately outdated maintenance interval and test the corresponding question. Verify that old chunks, cached summaries and duplicate copies no longer provide the superseded answer. Keep a recovery plan for partial ingestion failures.

Delete a test document and follow it through every derived store. Decide what happens to logs and evaluation examples containing its text according to the organization's retention policy. A source deletion is incomplete if an unrestricted copy survives in a feedback export.

## Build a small evaluation set before expansion

Have a domain owner select questions and expected evidence. Include exact lookups, ambiguous identifiers, conflicting versions, missing information and questions a restricted user should not be able to answer.

Separate training or tuning examples from the held-out assessment set. Repeatedly optimizing against the same handful of questions can make the demonstration look better without improving unfamiliar cases. Record the source versions used to produce expected answers.

The [RAG evaluation framework](/blog/rag-evaluation-framework) covers evidence and answer checks. For relationship-heavy questions involving equipment, components and contracts, the [knowledge graph RAG guide](/blog/knowledge-graph-rag) explains when explicit entity relationships may help.

## Turn findings into release conditions

Create a repair list with an owner, affected question type and a verification step for each issue. Examples include correcting model identifiers, replacing unreadable scans, implementing a permission filter or adding a source-deletion event.

Classify the workflow as ready for a bounded pilot, ready with specified exclusions, or blocked by a critical source problem. A missing authoritative maintenance instruction should block that answer category even if the rest of the dataset passes.

### Must every source be perfectly clean before a pilot?

No. A pilot can use a clearly defined, validated subset. Make exclusions visible and test that the assistant does not answer from excluded material.

### Does a larger model fix poor data readiness?

It may interpret difficult inputs differently, but it cannot establish missing authority, restore lost permissions or make an obsolete source current. Fix those conditions in the data workflow.
