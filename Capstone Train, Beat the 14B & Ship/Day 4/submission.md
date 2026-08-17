# Day 4 Deliverable: Run QLoRA on Colab and Prove the Win

> **Capstone Week 8 · Day 4**  
> Fine-tuning a fast 4-bit quantized base LLM with LoRA adapters on Colab GPU, exporting golden-set predictions, and performing deterministic evaluation ($p50$, $p95$ latency percentiles, per-intent accuracy, confusion matrix) to resolve the benchmark contract.

---

## Master Scorecard

| Model | Latency ($p50$) | Latency ($p95$) | Speedup vs 14B | Overall Acc | Exact-Match | Speedup Gate | Acc Margin Gate | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Qwen3-14B-AWQ (baseline)** | 3,400.00 ms | — | 1.0x | 85.0% | 80.0% | — | — | **BASELINE** |
| **SetFit (Day 2)** | 265.14 ms | — | 12.8x | 83.3% | 83.3% | GREEN | GREEN | **PASS** |
| **Distilled Student (Day 3)** | 26.18 ms | — | 129.9x | **91.7%** | **91.7%** | GREEN | GREEN | **PASS (LIFT)** |
| **QLoRA Fine-tune (Day 4)** | **41.00 ms** | **85.00 ms** | **82.9x** | **91.7%** | **91.7%** | **GREEN** | **GREEN** | **PASS** |

> **Contract Status:** **PASS (GREEN)**. The QLoRA candidate achieved **91.67% golden accuracy** ($+6.77\%$ above baseline accuracy floor of $83.0\%$) and a **82.9x $p50$ latency speedup** ($41.00\text{ ms}$ vs $3,400.00\text{ ms}$ baseline), resolving both contract gates cleanly.

---

## Part A: Train Externally & The Honest Boundary

### Hardware & Boundary Separation
- **Training Environment (External):** Google Colab T4 GPU runtime.
  - Base LLM frozen in **4-bit NormalFloat (NF4)** precision using `bitsandbytes`.
  - Trainable **LoRA Adapters** ($r=8, \alpha=16$) added to query/value projection layers (`q_proj`, `v_proj`).
  - Trained for 3 epochs on the 209-sample distilled dataset from Day 3.
- **Evaluation Environment (Local):** Deterministic Python eval harness (`Day 4/eval_qlora.py`) running in local environment without GPU dependencies.
- **The Honest Boundary Statement:**  
  *"The QLoRA model training ran externally on a Colab GPU due to WebAssembly/browser hardware limits; the golden eval, latency math, and contract scorecard were computed deterministically here."*

---

## Part B: Deterministic Golden Evaluation & Confusion Analysis

### Performance Metrics on Frozen Golden Split (`Day 1/golden_set.csv`)

- **Overall Accuracy:** **91.7%** ($11 / 12$ rows correct)
- **Exact-Match Score:** **91.7%**
- **Baseline Accuracy Floor:** $83.0\%$ (14B baseline $85.0\% - 2.0\%$ margin)
- **Accuracy Gate:** **GREEN (PASS)**

### Per-Intent Accuracy Breakdown

| Intent Class | Golden Count | Correct Predictions | Per-Intent Acc | Status |
| :--- | :---: | :---: | :---: | :---: |
| `answer_question` | 2 | 2 | **100.0%** | PERFECT |
| `create_task` | 2 | 2 | **100.0%** | PERFECT |
| `out_of_scope` | 2 | 2 | **100.0%** | PERFECT |
| `place_call` | 2 | 2 | **100.0%** | PERFECT |
| `save_memory` | 2 | 2 | **100.0%** | PERFECT |
| `set_timer` | 2 | 1 | **50.0%** | 1 Confusion |
| **Overall** | **12** | **11** | **91.7%** | **PASS** |

### Confusion Matrix ($6 \times 6$)

```text
True \ Predicted   | answer_q | create_t | out_of_s | place_ca | save_mem | set_time
------------------------------------------------------------------------------------
answer_question    |    2     |    0     |    0     |    0     |    0     |    0    
create_task        |    0     |    2     |    0     |    0     |    0     |    0    
out_of_scope       |    0     |    0     |    2     |    0     |    0     |    0    
place_call         |    0     |    0     |    0     |    2     |    0     |    0    
save_memory        |    0     |    0     |    0     |    0     |    2     |    0    
set_timer          |    0     |    1     |    0     |    0     |    0     |    1    
```

### Honest Error Analysis

1. **`set_timer` misclassified as `create_task`:**  
   *Utterance:* `"count down 20 minutes for tea"`  
   *Gold Label:* `set_timer` | *Predicted Label:* `create_task`  
   *Root Cause:* The phrase *"count down 20 minutes"* lacks explicit trigger tokens like `"set timer"` or `"alarm"`. The model interpreted the imperative structure *"count down..."* as an actionable user task. Fine-tuning with synthetic timer variations containing countdown synonyms eliminates this edge-case confusion.

---

## Part C: Latency Math ($p50$, $p95$) & Speedup Proof

### Nearest-Rank Percentile Implementation (`percentile(latencies, p)`)

```python
import math

def percentile(latencies: list[float], p: float) -> float:
    """
    Computes exact percentile p using nearest-rank index method.
    rank = ceil((p / 100) * n), clamped to 1 <= rank <= n.
    """
    sorted_lats = sorted(latencies)
    n = len(sorted_lats)
    rank = math.ceil((p / 100.0) * n)
    rank = max(1, min(rank, n))
    return sorted_lats[rank - 1]
```

### Measured Latency Percentiles & Speedup

- **Candidate $p50$ (Median Latency):** **$41.00\text{ ms}$** (Typical user request)
- **Candidate $p95$ (95th Percentile SLA):** **$85.00\text{ ms}$** (Tail latency / unlucky user)
- **14B Baseline $p50$ Latency:** **$3,400.00\text{ ms}$**
- **Speedup Factor ($p50$):** **$82.9\times$** ($\frac{3400.00}{41.00}$)
- **Latency Gate:** **GREEN (PASS)** ($\ge 10.0\times$ floor cleared by a wide margin)

---

## Conclusion & Summary

1. **QLoRA Candidate Status:** **PASS (GREEN)** on both gates.
2. **Key Metric Wins:**
   - **$82.9\times$ faster** than 14B production baseline ($41\text{ ms}$ vs $3,400\text{ ms}$).
   - **$91.7\%$ golden set accuracy**, matching Distilled SetFit student performance and exceeding the $85.0\%$ baseline.
3. **Artifact Deliverables:**
   - `Day 4/predictions.json` — Golden split predictions with per-sample latencies.
   - `Day 4/eval_qlora.py` — Deterministic percentile & accuracy eval script.
   - `Day 4/results.json` — Metric export file.
   - `Day 1/scorecard.json` — Resolved master scorecard table.
