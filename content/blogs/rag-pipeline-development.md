---
title: "RAG Pipeline Development: Updates, Permissions and Recovery"
slug: "rag-pipeline-development"
description: "Build a RAG pipeline that tracks source revisions, preserves permissions, handles partial ingestion, removes stale chunks and supports tested index changes."
category: "AI Infrastructure"
targetKeyword: "RAG pipeline development"
secondaryKeywords: "RAG ingestion pipeline, retrieval index updates, RAG source deletion"
readTime: "5 min read"
publishedAt: "2026-08-18"
modifiedAt: "2026-10-14"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

**A production RAG pipeline must keep searchable evidence synchronized with source content and permissions, including after edits, deletions and failed ingestion.** Treat the pipeline as a versioned data-processing system. Successful embedding generation is only one intermediate step, not proof that users will retrieve the correct current evidence.

Suppose a product manual changes one installation requirement and removes an obsolete appendix. The next index update must replace the affected content, remove stale chunks and preserve the correct access policy. Simply inserting newly generated vectors can leave both versions searchable and allow the model to choose the wrong one.

## Define document identity independently of file names

Assign a stable source identifier and record each observed revision. A renamed file may still be the same document, while two files named “manual.pdf” can represent different products. Avoid relying on display names as the only identity.

Keep a source manifest that links the current revision to its derived chunks and processing status. Record the content hash or source version provided by the connector, along with permission metadata and relevant effective dates.

The manifest gives the pipeline a way to answer a basic operational question: which indexed records should exist for this source revision? Without that relationship, cleanup after a partial update becomes guesswork.

## Make ingestion stages explicit

Separate discovery, fetch, parsing, chunk construction, embedding and index publication. Persist enough state to retry a failed stage without restarting unrelated work or duplicating output.

For each document revision, track:

- Stable source and revision identifiers.
- Fetch outcome and content type.
- Parser and extraction configuration version.
- Chunking strategy and generated chunk identifiers.
- Embedding model and vector dimensions.
- Permission and tenant metadata.
- Target index generation and publication status.
- Errors, retry counts and the last verified source state.

Microsoft's [Azure Blob indexer documentation](https://learn.microsoft.com/en-us/azure/search/search-how-to-index-azure-blob-storage) provides one example of a managed ingestion path. Managed connectors can reduce custom work, but the team still needs to understand their supported content, change detection and failure behavior.

## Inspect parsing before tuning embeddings

Run extraction on representative documents and compare it with the originals. Check page order, tables, units, footnotes and headings. A vector database cannot restore a qualification lost when a table was flattened incorrectly.

Build chunks around meaning where practical and preserve enough local context to interpret the passage. Attach source references that let a reviewer inspect the original evidence. Keep the configuration reproducible so a later rebuild does not silently produce a different corpus.

Use the [data readiness checklist](/blog/ai-data-readiness-implementation-checklist-2026) before scaling ingestion. Resolve missing document ownership or contradictory source versions at the content layer rather than hoping a different embedding model will compensate.

## Publish complete revisions instead of mixed fragments

Decide how a new document revision becomes visible. One approach prepares all derived records, validates them and then marks the revision current. The retrieval path filters to the active revision, while old records remain temporarily available for controlled rollback or are removed according to policy.

The exact mechanism depends on the storage system. What matters is the observable guarantee: users should not unknowingly retrieve half of the old manual and half of the new one after an interrupted update.

Test a failure after some chunks are written. Re-running ingestion should converge to the intended revision without multiplying chunks. Use stable derivation identifiers or a clearly defined replacement strategy rather than generating unrelated random identifiers on every attempt.

## Preserve permissions through retrieval

Carry source access metadata through parsing and chunking. At query time, derive the user's identity from trusted application context and restrict candidate evidence before sending it to the model.

Permission updates may occur without text changes. A content hash alone therefore cannot decide whether an indexed record is current. Treat access revocation as an independently important event with a documented propagation target and failure response.

Include summaries and caches in the access model. A cached answer based on a formerly accessible document can remain a disclosure path even after the vector search filter is corrected.

## Make deletion a first-class event

Track removed source documents and the derived records that must disappear. If the connector cannot reliably signal deletion, design a reconciliation process rather than assuming absence from one fetch means permanent removal.

For the removed appendix example, verify that old chunks are no longer eligible for retrieval and that citations do not point to missing or obsolete content. Also consider precomputed summaries, alternate indexes and application caches.

Keep deletion and rollback policies consistent. Restoring an old index to recover service should not silently restore a document that was removed for an access or retention reason. Operational convenience cannot be the only criterion for choosing a rollback target.

## Plan index and embedding changes as migrations

Changing vector dimensions, chunk identifiers or schema can require more than an in-place configuration edit. Microsoft's [index update and rebuild guidance](https://learn.microsoft.com/en-us/azure/search/search-howto-reindex) documents how different changes affect an Azure AI Search index. Consult the equivalent constraints for your chosen store.

Build a candidate index generation when a change requires broad reprocessing. Compare it with the current generation using the same question set, permissions and source versions. Establish a controlled cutover and a rollback path that respects current deletion and access decisions.

Track ingestion cost and temporary storage during migration. A new embedding model may improve some queries while increasing maintenance work or weakening exact-identifier retrieval. Test the complete retrieval behavior before switching traffic.

## Operate the pipeline with meaningful checks

Monitor source-to-index delay, failed revisions, orphan chunks, permission-update lag and deletion completion. A green job scheduler can conceal documents that repeatedly fail parsing and never become current.

Use a small set of probe questions whose expected evidence changes when designated source records change. Update and delete those records in a test environment to verify the whole path, including caches and answer generation.

The [RAG evaluation framework](/blog/rag-evaluation-framework) covers answer and evidence quality. The [knowledge base development guide](/blog/ai-knowledge-base-development) covers who decides which sources are authoritative; this pipeline must implement those decisions faithfully.

### Does every change require rebuilding the entire index?

No. Incremental updates can be appropriate when the schema and derivation rules remain compatible. Maintain enough source-to-chunk lineage to replace only the affected records safely.

### What should a first production milestone prove?

It should ingest, update, revoke access to and delete a representative document, recover from an interrupted run and return the correct permitted evidence afterward. A one-time successful upload proves much less.
