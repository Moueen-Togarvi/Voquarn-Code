---
title: "Retrieval Evaluation Metrics for RAG Systems"
slug: "retrieval-evaluation-metrics"
description: "Choose and apply retrieval evaluation metrics: recall and precision at k, ranking measures, faithfulness, building a test set, and diagnosing whether retrieval or generation failed."
category: "AI Infrastructure"
targetKeyword: "retrieval evaluation metrics"
readTime: "6 min read"
publishedAt: "2026-08-19"
status: "published"
---
**Retrieval evaluation metrics** tell you whether a RAG system fails because it did not find the right information or because it mishandled information it did find. Without separating these, teams tune prompts to fix retrieval problems and change models to fix ranking problems, neither of which works.

## Separate the two stages

Evaluate retrieval and generation independently before evaluating end to end.

Retrieval evaluation asks whether the documents needed to answer the question were returned. Generation evaluation asks whether the answer is correct and faithful given those documents.

An end-to-end score alone cannot distinguish them, which is why systems with only an end-to-end metric plateau. Most quality problems in practice are retrieval problems.

## Retrieval metrics

- **Recall at k.** Of the documents needed to answer, how many appeared in the top k results. This is the most important retrieval metric, because generation cannot recover from missing evidence.
- **Precision at k.** Of the returned documents, how many were relevant. Precision matters more than intuition suggests, since irrelevant passages act as distractors and degrade answer quality.
- **Mean reciprocal rank.** Where the first relevant document appeared. Useful when a single correct source exists.
- **Normalized discounted cumulative gain.** Accounts for graded relevance and position, appropriate when some documents are more useful than others.

Track recall at the k you actually pass to the model, not at a larger k that flatters the number. Recall at fifty is irrelevant if you send three passages.

## Generation metrics

- **Faithfulness.** Whether every claim in the answer is supported by the retrieved context. This catches fabrication, which is the failure users find least acceptable.
- **Answer relevance.** Whether the answer addresses the question, independent of correctness.
- **Correctness** against a reference answer where one exists.
- **Appropriate refusal.** Whether the system declines when the answer is genuinely not in the corpus. Systems are frequently never tested on unanswerable questions, and then fabricate confidently in production.

## Building the test set

This is the work that determines whether evaluation is meaningful.

Source questions from real usage: support tickets, search logs, and user interviews. Synthetic questions generated from your documents test whether retrieval finds the document a question was generated from, which is an easier task than real queries.

For each question, record the answer and the specific documents or passages that support it. This annotation is the expensive part and the part that makes diagnosis possible.

Include categories deliberately: straightforward lookups, questions requiring multiple documents, questions with near-miss distractors in the corpus, ambiguous questions, and questions with no answer in the corpus.

A hundred well-annotated cases covering these categories is more useful than a thousand generated ones.

## Diagnosing failures

When an answer is wrong, check retrieval first. If the supporting document was not returned, the fix is in chunking, embedding, ranking, or the query, not in the prompt.

If the document was returned and the answer is still wrong, examine position and context size. Evidence buried among many passages is often effectively ignored, and cutting to fewer, better-ranked results frequently resolves it.

If the document was returned, well-positioned, and the answer is still wrong, then it is a generation problem worth addressing through prompting or model choice.

Log retrieved documents with every production answer so this diagnosis is possible after the fact rather than only in testing.

## Running it continuously

Run the suite on every change to chunking, embedding models, retrieval parameters, reranking, prompts, or generation models. Each of these changes behavior in ways that are not predictable.

Set thresholds that block deployment, and track metrics over time. Slow degradation as a corpus grows is common and invisible without trend data.

## Frequently asked questions

### Which single metric matters most?

Recall at your production k. Missing evidence is unrecoverable downstream.

### How large should the test set be?

Enough to cover your question categories with several examples each. Annotation quality matters more than volume.

### Can models evaluate the outputs?

Model-based grading is practical for faithfulness and relevance at scale, and should be validated against human judgment on a sample before being trusted.

### Why does retrieval degrade over time?

Corpus growth adds near-duplicates and distractors. Periodic re-evaluation and reranking adjustments are ongoing work.

Explore [our software and web capabilities](/services) or [discuss your AI workflow](/contact).
