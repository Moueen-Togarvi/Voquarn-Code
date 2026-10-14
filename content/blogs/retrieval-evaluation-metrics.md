---
title: "Retrieval Evaluation Metrics for RAG Systems"
slug: "retrieval-evaluation-metrics"
description: "Choose and apply retrieval evaluation metrics: recall and precision at k, ranking measures, faithfulness, building a test set, and diagnosing whether retrieval or generation failed."
category: "AI Infrastructure"
targetKeyword: "retrieval evaluation metrics"
readTime: "5 min read"
publishedAt: "2026-08-19"
modifiedAt: "2026-10-14"
status: "published"
secondaryKeywords: "RAG recall at k, precision at k example, groundedness evaluation, retrieval test dataset"
---
**Retrieval evaluation metrics** help distinguish missing evidence from an answer that misuses available evidence. Evaluate the retrieval stage and the generated response separately so a change targets the measured failure rather than a guessed cause.

## Separate the two stages

Evaluate retrieval and generation independently before evaluating end to end.

Retrieval evaluation asks whether the documents needed to answer the question were returned. Generation evaluation asks whether the answer is correct and faithful given those documents.

An end-to-end score alone cannot reliably distinguish them. Microsoft's [RAG evaluator documentation](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators) separates document retrieval evaluation from response groundedness and relevance. Those are different questions: a response can repeat the supplied context faithfully even when that context is outdated or irrelevant.

## Retrieval metrics

The Stanford [information retrieval text](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html) explains ranked retrieval evaluation, including precision at a cutoff and graded-relevance measures. Choose a metric that matches the evidence your task actually needs.

- **Recall at k.** The fraction of labelled relevant items appearing in the top k results. Define whether an item is a document or a chunk before comparing runs; duplicate chunks from one document can otherwise inflate an apparent improvement.
- **Precision at k.** Of the returned documents, how many were relevant. Precision matters more than intuition suggests, since irrelevant passages act as distractors and degrade answer quality.
- **Mean reciprocal rank.** Where the first relevant document appeared. Useful when a single correct source exists.
- **Normalized discounted cumulative gain.** Accounts for graded relevance and position, appropriate when some documents are more useful than others.

Track recall at the k you actually pass to the model, not at a larger k that flatters the number. Recall at fifty is irrelevant if you send three passages.

## Generation metrics

- **Faithfulness.** Whether claims in the answer are supported by the supplied context. This does not establish that the source itself is accurate or that the answer contains every required fact.
- **Answer relevance.** Whether the answer addresses the question, independent of correctness.
- **Correctness** against a reference answer where one exists.
- **Appropriate refusal.** Whether the system declines when the answer is genuinely not in the corpus. Systems are frequently never tested on unanswerable questions, and then fabricate confidently in production.

## Building the test set

This is the work that determines whether evaluation is meaningful.

Source questions from real usage: support tickets, search logs, and user interviews. Synthetic questions generated from your documents test whether retrieval finds the document a question was generated from, which is an easier task than real queries.

For each question, record the answer and the specific documents or passages that support it. This annotation is the expensive part and the part that makes diagnosis possible.

Include categories deliberately: straightforward lookups, questions requiring multiple documents, questions with near-miss distractors in the corpus, ambiguous questions, and questions with no answer in the corpus.

Keep a held-out set for the final comparison and record annotation disagreements. There is no universal minimum sample size: rare but costly failures need deliberate coverage even if common questions dominate traffic.

## Worked example: recall improves while precision falls

Suppose a test question has three relevant document IDs: A, B, and C. A retriever returns A, D, B, E, and F as its top five. Two returned documents are relevant, so precision at five is `2 / 5 = 0.40` and recall at five is `2 / 3`, approximately `0.67`. The reciprocal rank for this query is `1`, because the first result is relevant. Mean reciprocal rank averages that value across the query set.

If the context budget permits only the first two documents, the generation step receives A and D: its effective recall is `1 / 3`, not the top-five score. Record both the retriever's candidate results and the passages actually supplied after reranking, deduplication, and truncation.

Now suppose C is a policy exception required for the correct answer. A system could earn a respectable average retrieval score while omitting that exception. Add a case-level check for the required evidence and evaluate the final answer against it. This example is a diagnostic calculation, not a benchmark result from a deployed client system.

## Diagnosing failures

When an answer is wrong, check whether an authorised, current supporting document exists and was returned. Missing evidence can arise from ingestion, access filters, chunking, embedding, ranking, or query construction. A prompt that controls query generation can also affect retrieval, so inspect the full request path.

If the document was returned and the answer is still wrong, examine position and context size. Evidence buried among many passages is often effectively ignored, and cutting to fewer, better-ranked results frequently resolves it.

If the document was returned, well-positioned, and the answer is still wrong, then it is a generation problem worth addressing through prompting or model choice.

Record retrieved document IDs, versions, ranks, and the final context selection with production request identifiers. Store raw personal content only where necessary and governed; identifiers and versioned test fixtures can often support diagnosis without copying every document into logs.

## Running it continuously

Run the suite on every change to chunking, embedding models, retrieval parameters, reranking, prompts, or generation models. Each of these changes behavior in ways that are not predictable.

Set thresholds that block deployment, and track metrics over time. Slow degradation as a corpus grows is common and invisible without trend data.

## Frequently asked questions

### Which single metric matters most?

For evidence-dependent answers, recall at the production context limit is a useful starting point. Pair it with answer correctness and appropriate refusal; no single metric establishes system quality.

### How large should the test set be?

Enough to cover your question categories with several examples each. Annotation quality matters more than volume.

### Can models evaluate the outputs?

Model-based grading is practical for faithfulness and relevance at scale, and should be validated against human judgment on a sample before being trusted.

### Why does retrieval degrade over time?

Corpus growth adds near-duplicates and distractors. Periodic re-evaluation and reranking adjustments are ongoing work.

For the surrounding architecture decision, read [RAG versus fine-tuning](/blog/rag-vs-fine-tuning). Explore [our software and web capabilities](/services) or [discuss an evaluation plan](/contact) using examples from your own corpus.
