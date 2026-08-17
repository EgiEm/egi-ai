# Capstone Presentation — Six-Beat Deck Outline

> **Build Your Own AI Router · Week 8 Capstone**  
> Endri "Egi" Emini — Brigada Developer Internship

---

## Beat 1 — The Problem

**The 14B is accurate but slow.**

OXODIN's production intent classifier runs every user sentence through Qwen3-14B-AWQ — a 14-billion-parameter LLM on an L4 GPU. It takes **3.4 seconds** to classify a single sentence across six intents (`place_call`, `create_task`, `set_timer`, `answer_question`, `save_memory`, `out_of_scope`).

That's 3.4 seconds the user is waiting. At scale, that's 3.4 seconds × every request × every user. The voice pipeline is blocked, the GPU bill is burning, and the assistant feels sluggish.

**The question:** Can we build something 10× faster that's just as accurate?

---

## Beat 2 — The Bar

**The contract: two gates, both required.**

| Gate | Rule | Threshold |
| :--- | :--- | :---: |
| Speedup | p50 latency ≥ 10× faster than 14B | ≤ 340 ms |
| Accuracy | Golden accuracy within 2.0% of 14B | ≥ 83.0% |

Fast but inaccurate? Fail. Accurate but slow? Fail. Both gates GREEN on the same frozen 12-row golden set — that's the only way to pass.

---

## Beat 3 — The Climb

**Three rungs on the version ladder.**

```
v0  →  SetFit (Day 2)  →  Distilled Student (Day 3)  →  QLoRA (Day 4)  →  ★ Shipped
```

1. **SetFit** — Sentence-transformer body + logistic regression head. 48 training samples. First player on the field. 12.8× faster, 83.3% accuracy. Both gates GREEN, but barely.

2. **Distilled Student** — Same architecture, but retrained on 209 samples (48 seed + 161 confidence-filtered teacher labels). The teacher's knowledge, compressed. 129.9× faster, 91.7% accuracy. Massive lift.

3. **QLoRA Fine-tune** — 4-bit quantized LLM with LoRA adapters, trained on Colab T4. 82.9× faster, 91.7% accuracy. Proves the concept works with a real fine-tuned model, not just a linear head.

---

## Beat 4 — The Proof

**The results table and the contract verdict.**

```
CANDIDATE              | ACC     | P50 (ms) | SPEEDUP
---------------------------------------------------------
Distilled Student      |  91.7%  |    26.18 |  129.9x
QLoRA Fine-tune        |  91.7%  |    41.00 |   82.9x
SetFit                 |  83.3%  |   265.14 |   12.8x
Baseline 14B-AWQ       |  85.0%  |  3400.00 |    1.0x

CONTRACT: PASS — 82.9x faster, accuracy within margin
```

11 out of 12 golden sentences correct. Both gates GREEN. The QLoRA candidate clears the contract with massive headroom — **82.9× faster** at the same 91.7% accuracy.

---

## Beat 5 — The Honest Limits

**Where it isn't a win — named and specific.**

### Failure Analysis
- **1 confusion:** `set_timer` → `create_task` on `"count down 20 minutes for tea"` — the model has never seen countdown synonyms in training.
- **Multilingual:** German `"Ruf Mama an"` (= "call mom") and Albanian `"Vendos kohëmatësin"` (= "set timer") would likely misroute. Router is English-only; the 14B handles all languages.
- **Multi-intent:** `"Call the dentist and set a timer"` carries two intents — our single-label classifier picks one. The 14B returns both.

### Caveats
- Single-label only — OXODIN production is multi-label
- k-NN semantic router is in-dev / NO-GO
- Qwen3-4B classifier is a plan, not shipped
- Colab-trained, not production-deployed
- Demo runs cached predictions, not the live proxy

---

## Beat 6 — The Next Step

**What I'd do with a real GPU and more time.**

1. **Scale the data** — 209 → 2,000+ examples with countdown synonyms, multilingual utterances, and multi-intent edge cases.
2. **Multi-label head** — Switch from argmax to sigmoid so the router can return multiple intents per sentence.
3. **Multilingual embedder** — Swap to `paraphrase-multilingual-MiniLM-L12-v2` and include German/Albanian/French training data.
4. **Production deployment** — FastAPI endpoint, health checks, shadow mode traffic ramp.
5. **CI regression** — Automated golden-set test on every model update.

---

> **The bottom line:** We proved a small, fast router can beat the 14B's speed by 82.9× while matching its accuracy on a frozen golden set. The biggest win came from data — distillation lifted accuracy by +8.4 points. The model is honest about its limits, and the bundle is shipped.
