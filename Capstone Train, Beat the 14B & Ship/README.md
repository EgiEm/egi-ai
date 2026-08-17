# Capstone: Train, Beat the 14B & Ship

> **Week 8 Capstone Project — Build Your Own AI Router**  
> Fine-tuning and evaluating a fast intent router to replace OXODIN's production `Qwen3-14B-AWQ` teacher model by targeting ≥10x lower latency while staying within a 2.0% accuracy margin.

---

## Final Verdict

```
CONTRACT: PASS — 82.9x faster, accuracy within margin
```

The QLoRA fine-tuned router achieved **91.7% golden accuracy** and **41.0ms p50 latency** versus the 14B baseline's 3,400ms — clearing both contract gates with massive headroom.

---

## Benchmark Contract

All candidate models are evaluated against two locked rules:

1. **Speedup Floor**: ≥10x faster classify latency (≤340ms vs 14B teacher's 3,400ms).
2. **Accuracy Margin**: Golden set accuracy within 2.0% of the teacher (≥83.0% vs 85.0% baseline).

> Note: Both gates must pass (`GREEN`). A model that is fast but inaccurate fails, and vice versa.

---

## Master Scorecard

| Model | Latency (p50) | Speedup | Overall Acc | Exact-Match | Speedup Gate | Acc Margin Gate | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Qwen3-14B-AWQ (baseline)** | 3,400.00 ms | 1.0x | 85.0% | 80.0% | — | — | **BASELINE** |
| **SetFit (Day 2)** | 265.14 ms | 12.8x | 83.3% | 83.3% | GREEN | GREEN | **PASS** |
| **Distilled Student (Day 3)** | 26.18 ms | **129.9x** | **91.7%** | **91.7%** | GREEN | GREEN | **PASS (LIFT)** |
| **QLoRA Fine-tune (Day 4)** | **41.00 ms** | **82.9x** | **91.7%** | **91.7%** | **GREEN** | **GREEN** | **PASS** |

---

## Codebase Overview

```text
Capstone Train, Beat the 14B & Ship/
├── README.md                      # Main benchmark documentation
├── Day 1/                         # Day 1: Baseline & Data Splits
│   ├── split_and_check.py         # Deterministic split & zero-leakage check
│   ├── meets_contract.py          # Contract evaluator (2-gate check)
│   ├── golden_set.csv             # Frozen 12-row held-out test split
│   ├── train_set.csv              # 48-row training split
│   ├── scorecard.json             # Master JSON benchmark tracking file
│   └── submission.md              # Day 1 benchmark notes
├── Day 2/                         # Day 2: SetFit Baseline
│   ├── train_and_eval_setfit.py   # Sentence Transformer + LogReg head trainer & eval
│   ├── test_head_by_hand.py       # Manual head score & argmax verifier
│   ├── results.json               # Local metrics & confusion matrix
│   └── submission.md              # Day 2 lab report & error analysis
├── Day 3/                         # Day 3: Teacher Distillation & Hygiene Pipeline
│   ├── distill_and_eval.py        # Confidence filtering, zero-leakage check & student trainer
│   ├── results.json               # Local distillation metrics & confusion matrix
│   └── submission.md              # Day 3 lab report & accuracy lift breakdown
├── Day 4/                         # Day 4: QLoRA Fine-tuning & Deterministic Proof
│   ├── eval_qlora.py              # Percentile latency math (p50/p95), accuracy & scorecard updater
│   ├── predictions.json           # Exported golden set predictions with per-request latencies
│   ├── results.json               # Day 4 QLoRA evaluation metrics & confusion matrix
│   └── submission.md              # Day 4 lab report & honest boundary analysis
└── Day 5/                         # Day 5: Ship the Capstone Bundle
    ├── report.md                  # Full 10-section eval report (the deliverable)
    ├── scorecard.json             # Final frozen model card (machine-readable)
    ├── build_table.py             # Code-generated results table & contract verdict
    ├── demo.py                    # Live interactive demo: sentence → intent · latency
    └── presentation.md            # Six-beat presentation deck outline
```

---

## What the Code Does

### Day 1: Benchmark Setup & Contract Verifier (`Day 1/`)

* **`split_and_check.py`**  
  Splits the raw dataset 80/20 into `train_set.csv` (48 rows) and `golden_set.csv` (12 rows) using a fixed SHA-256 seed. Verifies zero exact text overlap, substring leakage, or duplicate entries between splits.

* **`meets_contract.py`**  
  Contains `meets_contract(baseline_ms, candidate_ms, baseline_acc, candidate_acc)` to mechanically test whether a candidate model passes both speedup (≥10x) and accuracy margin (≤2.0%) thresholds.

* **`scorecard.json`**  
  Central JSON tracking file updated by evaluation scripts to log latencies, accuracy, gate colors, and overall pass/fail status.

---

### Day 2: SetFit Classifier & Manual Head (`Day 2/`)

* **`test_head_by_hand.py`**  
  Manual implementation of the logistic regression head prediction (`predict_head`). Calculates class linear scores and returns the argmax index, verifying how the decision boundary operates on 2D embeddings without external ML libraries.

* **`train_and_eval_setfit.py`**  
  1. **Body**: Encodes sentences into 384-dimensional dense vectors using `SentenceTransformer('all-MiniLM-L6-v2')`.
  2. **Head**: Trains a Scikit-Learn `LogisticRegression` classifier on the training set embeddings.
  3. **Evaluation**: Scores predictions against the frozen `golden_set.csv`, tracks latency (265.14 ms avg), computes per-intent accuracy, and prints a 6x6 confusion matrix.
  4. **Contract check**: Feeds metrics into `meets_contract()` and updates `scorecard.json` and `results.json`.

---

### Day 3: Knowledge Distillation & Confidence Filtering (`Day 3/`)

* **`distill_and_eval.py`**  
  1. **Teacher Pool Generation**: Generates 167 unlabelled sentences across all 6 intents labelled by `Qwen3-14B-AWQ` proxy with confidence scores.
  2. **Human Spot-Check Audit**: Runs a 20-sample manual check to measure teacher label accuracy and establish label noise baselines.
  3. **Lab A Confidence Gate (`keep_high_confidence`)**: Filters out low-confidence teacher rows (conf < 0.70), dropping 6 noisy rows and retaining 161 clean training rows.
  4. **Zero-Leakage Guarantee (`check_golden_leakage`)**: Asserts 0 overlapping rows between teacher pool and `golden_set.csv`.
  5. **Student Retraining & Evaluation**: Retrains student model on 209 total samples (48 seed + 161 clean teacher rows) and evaluates on the frozen golden set, hitting **91.67% golden accuracy** (+8.4% lift over Day 2) at **26.18 ms latency** (**129.9x speedup** vs 14B baseline).

---

### Day 4: QLoRA Fine-tuning & Percentile Proof (`Day 4/`)

* **`eval_qlora.py`**  
  1. **Nearest-Rank Percentile Math (`percentile`)**: Implements p50 (median) and p95 (95th percentile SLA) latency calculations from scratch.
  2. **Deterministic Golden Eval**: Evaluates exported Colab predictions (`predictions.json`) against `golden_set.csv`, reaching **91.67% accuracy** (11/12) and **82.9x speedup** (p50 = 41.00ms).
  3. **Confusion Analysis**: Computes per-intent accuracy and 6x6 confusion matrix, isolating `set_timer` vs `create_task` edge-case ambiguity.
  4. **Master Scorecard Update**: Updates `Day 1/scorecard.json` and writes `Day 4/results.json`, resolving both contract gates to **GREEN (PASS)**.

---

### Day 5: Ship the Capstone Bundle (`Day 5/`)

* **`report.md`**  
  The full 10-section structured eval report: problem, contract, baseline, model ladder, code-generated results table, confusion matrix, latency/speedup, failure analysis (3 worst confusions, multilingual gaps, where the 14B wins), honest caveats, and next steps. This is the document a stranger reads to understand and trust the result.

* **`scorecard.json`**  
  The final frozen machine-readable model card. Contains all four candidates with golden accuracy, p50/p95 latency, speedup, per-intent accuracy, gate status, caveats, and honest limits. A reader can parse this without trusting prose.

* **`build_table.py`**  
  Code-generated results table: reads the master scorecard, computes speedup per rung, sorts fastest-first, and prints the CONTRACT verdict. The report's numbers are re-derivable by running this script.

* **`demo.py`**  
  Interactive live demo: type a sentence, get back `<intent> · <ms>ms`. Uses cached Day 4 predictions for golden sentences (real measured latencies) and a keyword fallback for unknown inputs. Plainly states it does not call a live model or the OXODIN proxy.

* **`presentation.md`**  
  Six-beat presentation outline: problem → bar → climb → proof → honest limits → next step. Each beat maps to sections in the eval report. Designed to be delivered as a talk or converted to slides.

---

## Running the Scripts

### Day 1
```bash
cd "Day 1"
python split_and_check.py
python meets_contract.py
```

### Day 2
```bash
cd "Day 2"
python test_head_by_hand.py
python train_and_eval_setfit.py
```

### Day 3
```bash
cd "Day 3"
python distill_and_eval.py
```

### Day 4
```bash
cd "Day 4"
python eval_qlora.py
```

### Day 5
```bash
cd "Day 5"
python build_table.py       # Print the code-generated results table + verdict
python demo.py              # Run the interactive live demo
```
