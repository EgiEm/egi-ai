# Day 2 Deliverable: Train and Honestly Read Your First SetFit Model

> **Capstone Week 8 · Day 2**  
> SetFit architecture (sentence-transformer body + logistic regression head) trained on 48 samples and evaluated on the frozen 12-row golden test set.

---

## Benchmark Results

### Scorecard Comparison

| Model | Latency | Speedup vs 14B | Overall Acc | Exact-Match | Speedup Gate | Acc Margin Gate | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Qwen3-14B-AWQ (baseline)** | 3,400.00 ms | 1.0x | 85.0% | 80.0% | — | — | **BASELINE** |
| **SetFit (Day 2)** | 265.14 ms | 12.8x | 83.3% | 83.3% | GREEN | GREEN | **PASS** |
| **Distilled Student (Day 3)** | — | — | — | — | 🔘 | 🔘 | PENDING |
| **QLoRA Fine-tune (Day 4)** | — | — | — | — | 🔘 | 🔘 | PENDING |

> **Contract Status:** PASS. SetFit hit a **12.8x speedup** (threshold $\ge 10.0\times$) and **83.33% golden accuracy** (drop of $1.67\%$, threshold $\le 2.0\%$).

---

## Part A: Training & Golden Evaluation

### Training Setup
- **Train Set:** 48 verified zero-leakage examples (`Day 1/train_set.csv`) across 6 intents.
- **Golden Set:** 12 frozen held-out examples (`Day 1/golden_set.csv`).
- **Body:** `SentenceTransformer('all-MiniLM-L6-v2')` (384D embedding space).
- **Head:** Scikit-Learn `LogisticRegression` ($C=1.0$, `max_iter=1000`).

### Per-Intent Accuracy Breakdown

| Intent Class | Golden Samples | Correct | Accuracy |
| :--- | :---: | :---: | :---: |
| `answer_question` | 2 | 2 | 100.0% |
| `out_of_scope` | 2 | 2 | 100.0% |
| `place_call` | 2 | 2 | 100.0% |
| `set_timer` | 2 | 2 | 100.0% |
| `create_task` | 2 | 1 | 50.0% |
| `save_memory` | 2 | 1 | 50.0% |
| **Overall** | **12** | **10** | **83.3%** |

---

## Part B: Confusion Matrix & Error Analysis

### Golden Set Confusion Matrix

```text
True \ Predicted   | answer_q | create_t | out_of_s | place_ca | save_mem | set_time
------------------------------------------------------------------------------------
answer_question    |    2     |    0     |    0     |    0     |    0     |    0    
create_task        |    0     |    1     |    0     |    0     |    0     |    1    
out_of_scope       |    0     |    0     |    2     |    0     |    0     |    0    
place_call         |    0     |    0     |    0     |    2     |    0     |    0    
save_memory        |    0     |    0     |    0     |    1     |    1     |    0    
set_timer          |    0     |    0     |    0     |    0     |    0     |    2    
```

### Errors & Hypotheses

1. **`create_task` $\rightarrow$ `set_timer` (1 failure)**
   - *Failed text:* "make sure I water the plants before noon"
   - *Hypothesis:* The temporal phrase "before noon" pulls the sentence embedding toward timer and alarm clusters in embedding space. Without contrastive fine-tuning on task deadlines, the linear head predicts `set_timer`.

2. **`save_memory` $\rightarrow$ `place_call` (1 failure)**
   - *Failed text:* "keep a note that the meeting room code is 7788"
   - *Hypothesis:* The word "meeting" co-occurs heavily with scheduling calls in generic sentence-transformer pretraining. The linear head favored `place_call` due to the strong "meeting" embedding signal.

---

## Part C: TF-IDF vs. SetFit vs. 14B Teacher

| Metric | TF-IDF Baseline | SetFit (Day 2) | Qwen3-14B-AWQ Teacher |
| :--- | :---: | :---: | :---: |
| **Golden Accuracy** | ~58.3% | **83.3%** | **85.0%** |
| **Inference Latency** | ~0.8 ms | **265.14 ms** | 3,400.0 ms |
| **Speedup vs 14B** | >4000x | **12.8x** | 1.0x |
| **Training Effort** | Instant CPU sparse matrix fit | 2-stage SentenceTransformer + LogReg head | 14B parameters (GPU vLLM AWQ) |
| **Semantic Paraphrasing** | Fails on synonyms | **Handles semantic paraphrases** | State-of-the-art reasoning |
| **Output Type** | Single-label | **Single-label** | Multi-intent JSON |
