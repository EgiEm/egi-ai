# 🧊 Day 5 — Dataset Card: Merged & Frozen Capstone Corpus (`v1.0.0`)

> **Deliverable for Week 8 Capstone Model Training**

---

## 📌 1. Dataset Metadata & Versioning

* **Dataset Version:** `v1.0.0`
* **Release Date:** August 10, 2026
* **Pipeline Stage:** Leakage-Safe Merge, Deduplication, and Freeze
* **Labelling Agreement ($\kappa$):** **0.815** (Measured on Day 3 golden slice, near-perfect agreement)
* **Guideline Link:** [Day 2 Annotation Guideline](../Day%202/guideline.md)

---

## 📊 2. Corpus Statistics & Composition

### Total Rows
* **Total Merged & Deduplicated Rows:** **64**
* **Train Set (80%):** 52 rows
* **Test Set (20%):** 12 rows (Held-out slice, reproducible via `random_state=0`)

### Real vs Synthetic Split
| Source | Row Count | Percentage | Description |
| :--- | :--- | :--- | :--- |
| **Real Sanitized** | **34** | 53.1% | Human utterances with PII redacted in-place (Day 1–3) |
| **Synthetic Filtered** | **30** | 46.9% | Schema-locked Qwen3-14B synthetic survivors (Day 4) |
| **Total** | **64** | **100.0%** | Full deduplicated corpus |

### Per-Class Intent Distribution
| Intent Class | Total Rows | Real Rows | Synthetic Rows | Balance % |
| :--- | :--- | :--- | :--- | :--- |
| `save_memory` | 18 | 3 | 15 | 28.1% |
| `set_timer` | 16 | 1 | 15 | 25.0% |
| `create_task` | 11 | 11 | 0 | 17.2% |
| `out_of_scope` | 10 | 10 | 0 | 15.6% |
| `place_call` | 6 | 6 | 0 | 9.4% |
| `answer_question` | 3 | 3 | 0 | 4.7% |

---

## 🔒 3. Leakage Prevention & Deduplication Protocol

* **Ordering Protocol:** `Merge (Real + Synthetic) -> Global Dedup -> Train/Test Split`
* **Deduplication Key:** `normalise(t) = strip_punct(lowercase(collapse_spaces(t)))`
* **Duplicate Prevention Result:** 1 exact duplicate (`syn-05`: `"log that the garage entry code is 4492"`) was detected between synthetic generation and real gold row ID 28. It was dropped prior to splitting.
* **Split Integrity Check:** 0 key overlaps detected between train set (52 rows) and test set (12 rows).

---

## 🔍 4. Error Analysis & Targeted Fix Plan

Evaluation on the held-out slice revealed an accuracy of **75.0%** with the following ranked off-diagonal confusion pairs:

### Top 3 Confusion Pairs (True $\rightarrow$ Predicted)
1. **`set_timer -> create_task`** (Count: **2**) — Relative time phrases (e.g. "in 10 minutes") cause model to misclassify timers as reminders/tasks.
2. **`answer_question -> out_of_scope`** (Count: **1**) — Unsupported domain queries get confused with general out-of-scope requests.
3. **`create_task -> set_timer`** (Count: **1**) — Task directives containing duration phrases get misidentified as countdown timers.

### Targeted Synthetic Prompt (Fix for Worst Confusion Pair)
To resolve the primary ambiguity between `set_timer` and `create_task`, the next synthetic batch prompt is defined as:

```text
Generate 20 concise voice assistant requests for the 'set_timer' intent across English, German, and French.
CRITICAL CONSTRAINT: Each request MUST specify a explicit duration (e.g., '15 minutes', '45 mins', '1 hour') 
and MUST NOT contain action/reminder keywords such as 'remind', 'alert me', 'call', 'do', or 'buy'.
Ensure strict boundary separation from 'create_task'.
```

---

## ⚠️ 5. Known Weaknesses & Recommendations for Capstone

1. **Timer vs Task Boundary:** `set_timer` and `create_task` share temporal vocabulary ("minutes", "countdown"). Ensure prompt features emphasize action verbs vs passive durations.
2. **Thin `answer_question` Class:** Contains only 3 real rows; consider targeted expansion prior to fine-tuning.
3. **Multi-lingual Distribution:** Corpus contains EN, DE, FR, ES rows. Ensure tokenizers handle non-English punctuation cleanly.
