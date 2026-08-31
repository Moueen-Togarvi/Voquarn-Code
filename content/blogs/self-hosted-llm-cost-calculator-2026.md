---
title: "Self-Hosted LLM: The Real Cost Compared to API Pricing"
slug: "self-hosted-llm-cost-calculator-2026"
description: "Work out whether self-hosting an LLM beats API pricing: GPU economics, the utilisation break-even, and the operating costs teams leave out."
category: "AI Infrastructure"
targetKeyword: "self hosted llm"
secondaryKeywords: "self hosted llm cost, self hosting llm vs api, open source llm hosting cost, run llm on own server"
readTime: "8 min read"
publishedAt: "2026-08-31"
status: "published"
cornerstone: true
---

Most teams that ask about **self hosted LLM** deployments have already decided they want one. The reasons are usually some mix of cost, data residency, and a dislike of per-token billing. What they want from an engineer is confirmation.

The honest answer is that self-hosting wins on cost only above a utilisation threshold most teams never reach, and wins on data control almost immediately. Those are two different decisions, and conflating them is how organisations end up with an idle A100 and a bill nobody can defend.

This piece works through the arithmetic.

## The number that decides it: utilisation

A GPU costs the same whether it serves one request an hour or saturates. API pricing is strictly variable. So the comparison reduces to a single question — what fraction of the hour is your hardware actually busy?

Take a concrete setup. One NVIDIA L40S on a major cloud runs roughly $1.00–1.30/hour on demand, call it $1.10. That is about **$800/month** if you leave it running, which you must if you want response times measured in milliseconds rather than cold-start minutes.

An L40S serving a quantised 8B-class model with continuous batching handles somewhere around 800–2,500 output tokens/second depending on batch depth, sequence length, and how aggressively you quantise. Take 1,200 tok/s as a defensible mid-point.

Fully saturated for a month, that is:

```
1,200 tok/s x 3,600 s x 730 h = ~3.15 billion output tokens/month
```

At $800/month, saturated, your cost is roughly **$0.25 per million output tokens**. That is dramatically cheaper than any hosted frontier model, and cheaper than most hosted open-weight endpoints too.

Now apply reality. Few internal workloads run at anything close to saturation. A typical internal tool with business-hours traffic and bursty usage lands at 3–8% utilisation. At 5%:

```
3.15B x 0.05 = ~157 million output tokens/month
$800 / 157M = ~$5.10 per million output tokens
```

That is no longer cheap. It is worse than most hosted open-weight APIs, and competitive only with premium frontier pricing.

**The break-even is utilisation, not volume in the abstract.** Against a hosted endpoint at roughly $0.20 per million output tokens, a single $800 L40S needs about 4 billion tokens/month to break even — more than one card can produce. Against a frontier model at $10 per million, break-even arrives at around 80 million tokens/month, which is roughly 2.5% utilisation and very achievable.

So the real question is not "should we self-host" but "what are we replacing?" Self-hosting displaces expensive frontier calls easily. It displaces cheap open-weight APIs almost never.

## Sizing without guessing

Estimate your monthly output tokens directly rather than reasoning from request counts:

```
monthly output tokens
  = requests/day x avg output tokens/request x 30
```

A support-triage tool handling 4,000 requests/day at 400 output tokens each produces 48 million tokens/month. Against frontier pricing that is $480/month, below the $800 hardware floor. Against a cheap hosted endpoint it is under $10. Self-hosting loses both times.

An internal documentation assistant serving 40,000 requests/day at 700 tokens produces 840 million/month — $8,400 at frontier pricing. Here self-hosting is straightforwardly correct, and one card handles it at ~27% utilisation.

Between those two poles is where careful work pays off. Below roughly 100 million output tokens/month, self-hosting is a data-control decision that you should expect to cost more, and you should say so out loud when you propose it.

## Memory: the constraint that actually bites

VRAM decides which models you can run at all. The working approximation:

```
VRAM ≈ (params x bytes_per_param) + KV cache + activation overhead
```

At FP16, a 7B model needs ~14 GB before context. At 4-bit quantisation the same model needs ~4 GB. The KV cache is the part that surprises people, because it scales with concurrency *and* context length:

```
KV bytes ≈ 2 x layers x kv_heads x head_dim x seq_len x batch x bytes
```

For a 7B-class model at 8k context with 32 concurrent requests, the KV cache alone can exceed 8 GB. Teams size for weights, deploy, and discover their effective concurrency is four.

Practical guidance:

- **24 GB (L4, A10G, RTX 4090)** — 7–8B at FP16, or 13B quantised. Fine for classification, extraction, routing.
- **48 GB (L40S, A6000)** — 13B comfortably, 34B quantised, or 8B with genuinely deep context and high batch.
- **80 GB (A100, H100)** — 70B quantised, or 34B at FP16 with real headroom.

Multi-GPU introduces tensor parallelism, interconnect sensitivity, and a meaningful jump in operational complexity. If your plan requires two cards on day one, price a hosted endpoint again before committing.

## Quantisation: where the free lunch stops

4-bit quantisation cuts memory roughly 4x against FP16 and usually costs a few percent on standard benchmarks. That trade is excellent for summarisation, classification, extraction, and routing.

It is *not* uniformly cheap. Quantisation degrades unevenly: long-chain arithmetic, strict format adherence, and low-resource languages suffer disproportionately compared to what aggregate benchmark deltas suggest. If your workload is JSON extraction with a rigid schema, test format-compliance rates specifically — a model that scores 2% lower on MMLU can produce materially more malformed JSON.

Test on *your* data before deciding. Benchmark deltas do not transfer.

## The costs that never make the slide

Hardware is the line everyone models. These are the ones that arrive later:

**Engineering time.** Someone must own the serving stack — vLLM, TGI, SGLang, whichever. Model updates, CUDA and driver compatibility, OOM debugging under concurrency, tuning batch parameters. Budget 0.2–0.4 FTE ongoing for a production deployment. At any realistic loaded engineering cost, that dwarfs the GPU bill and is routinely omitted.

**Redundancy.** One GPU is one failure domain. Real availability means two, which doubles hardware and halves your effective utilisation — pushing you back down the cost curve.

**Idle time.** Reserved capacity bills continuously. Autoscaling GPUs is possible but cold starts run tens of seconds to minutes for large weights, which is usually unacceptable for interactive use.

**Evaluation.** Hosted providers absorb regression testing across model updates. Self-hosting makes that yours. You need an eval suite before you need a GPU.

A defensible total cost looks closer to:

```
GPU (x2 for HA)        $1,600/mo
Storage + egress          $150/mo
Engineering (0.3 FTE)   $2,500-5,000/mo
                        ----------------
                        ~$4,250-6,750/mo
```

Against that, the frontier-API spend you are displacing needs to be substantial before this reads as savings.

## When self-hosting is right regardless of cost

Cost is not the only axis, and for many organisations it is not the deciding one:

- **Regulatory data residency.** When inference over regulated data cannot leave your boundary, self-hosting is the requirement, not the optimisation. Price it as compliance spend.
- **Latency floors.** Co-locating the model with your application removes network round-trip. For sub-100ms budgets this can be decisive.
- **Rate-limit independence.** No provider throttling, no queue during demand spikes.
- **Model permanence.** Hosted models get deprecated on the provider's schedule. Self-hosted weights stay exactly as validated, which matters enormously in regulated or contractual contexts.
- **Fine-tuning economics.** Serving many task-specific adapters over a shared base is far cheaper self-hosted than as separate hosted deployments.

If one of these applies, the cost analysis becomes a budget question rather than a decision question — and you should frame it that way to stakeholders instead of overselling savings that will not appear.

## A staged approach that avoids the trap

The failure mode is buying hardware, then discovering utilisation is 4%.

1. **Start hosted.** Use an open-weight endpoint with the exact model you intend to self-host. Same weights, no infrastructure.
2. **Instrument for a month.** Log tokens in and out per request, p50/p95/p99 latency, peak concurrency, and hourly distribution. This produces your real utilisation curve.
3. **Compute break-even from measurements**, not from the traffic you hope to have.
4. **Move only if the numbers hold** with the fully-loaded cost above, including engineering and redundancy.

The migration is genuinely low-friction — same weights, an OpenAI-compatible endpoint either way — which is exactly why there is no reason to skip the measurement phase.

## Frequently asked questions

**Is self-hosting cheaper than API pricing?**
Above roughly 25–30% GPU utilisation, yes, and often by a wide margin. Below about 10%, no — you pay for idle silicon. Most internal tools sit under 10% until deliberately consolidated across several workloads onto shared hardware.

**What hardware should we start with?**
A single 48 GB card such as an L40S handles most 7–13B production workloads with room for real concurrency. It is the smallest configuration that does not immediately constrain you on context length or batch depth.

**Does quantisation hurt quality?**
4-bit costs a few percent on aggregate benchmarks but degrades unevenly — structured output, long arithmetic chains, and low-resource languages suffer more than the averages imply. Always evaluate on your own task.

**Can we autoscale GPUs to fix utilisation?**
Partly. Cold starts run tens of seconds to minutes for large weights, so it suits batch and asynchronous work. Interactive workloads generally need warm capacity, which is what creates the idle cost.

**What is the single most-missed cost?**
Engineering ownership. A production serving stack needs a named owner for updates, driver compatibility, and incident response. At 0.2–0.4 FTE it typically exceeds the hardware line, and it is absent from nearly every initial estimate.

## Further reading

- [vLLM continuous batching documentation](https://docs.vllm.ai/en/latest/)
- [NVIDIA L40S product specifications](https://www.nvidia.com/en-us/data-center/l40s/)

## Related

- [SaaS application development](/services/saas-apps)
- [Talk to us](/contact)
- [Our services](/services)
