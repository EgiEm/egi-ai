# 🚀 Week 7 — Data Engineering Pipeline for AI Router
> **Real, Sanitized, & Synthetic Data Engineering**

This repository contains the end-to-end data pipeline for building, cleaning, auditing, and measuring high-performance AI intent routers.

---

## 📌 Days Overview & Pipeline Architecture

[ Day 1: Sanitization ]  --->  [ Day 2: Labelling Discipline ]  --->  [ Day 3: Trust & Agreement ]  --->  [ Day 4: LLM Teacher Synthesis ]  --->  [ Day 5: Merge, Analyse, Freeze ]
Raw Utterances + PII            Annotation Spec + Tie-Breakers         Double-Labelled Slice + Kappa (κ)       Schema-Locked Decoding + Generator     Leakage-Free Dedup + Dataset Card
Redact-in-Place PII             Deduplication + Clean Gold             Adjudication Log & Guideline Fixes      Deterministic Gate + Filtered Gold     Error Analysis + Capstone Corpus (v1)
```

| Day | Focus Title | Core Action / What It Does | Key Outputs |
| :--- | :--- | :--- | :--- |
| **Day 1** | **Real Requests, Real Risk — Sanitize the Data** | Redacts sensitive Personally Identifiable Information (PII) in-place (`<NAME>`, `<PHONE>`, `<EMAIL>`, `<IBAN>`, `<ADDRESS>`) and verifies zero leaks. | `sanitised_intents.csv`, `main.py` scrubber |
| **Day 2** | **Labelling Discipline — Guidelines That Matter** | Establishes written annotation specs, 4-part intent definitions, sibling tie-breakers, string normalisation, and near-deduplication. | `guideline.md`, `clean_gold.csv`, `ambiguous_rows.csv` |
| **Day 3** | **Do You Trust This Label? — Measuring Agreement** | Double-labels a 20-row golden slice, computes Cohen's Kappa ($\kappa$), adjudicates every human disagreement, and fixes intent boundaries. | `double_labelled_slice.csv`, `cohen_kappa.py`, `submission.md` |
| **Day 4** | **The LLM Teacher — Generate, Then Filter** | Expands thin intent classes (`save_memory`, `set_timer`) using Qwen3-14B-AWQ schema-guided decoding and a 4-step deterministic filter. | `generator.py`, `generator.js`, `synthetic_candidates.csv`, `filtered_survivors.csv` |
| **Day 5** | **Merge, Analyse, Freeze — Capstone Dataset** | Merges real + synthetic data with leakage-free dedup before split, runs confusion pair analysis, and freezes versioned dataset card. | `dataset_v1.csv`, `submission.md`, `main.py` |

---

## 🛡️ Day 1: Data Sanitization & Seed Corpus

### 1. The Purpose
Production voice assistant logs contain real user data. Directly training or logging raw text violates privacy regulations (GDPR, FADP). Day 1 builds a deterministic, fail-closed PII scrubbing engine that anonymizes data while preserving sentence meaning for the AI model.

### 2. PII Taxonomy & Replacement Tags
- **`<NAME>`**: Individual names (*Sarah, Carlos, Dr. Weber*)
- **`<PHONE>`**: Telephone numbers (*+41 79 555 12 34, +34 612 345 678*)
- **`<EMAIL>`**: Email addresses (*anna.muller@oxodin.ch*)
- **`<IBAN>`**: Bank account numbers (*CH93 0076 2011 6238 5295 7*)
- **`<ADDRESS>`**: Physical locations (*Bahnhofstrasse 12, 8001 Zürich*)

### 3. Redact-in-Place Discipline
Instead of deleting rows containing PII (which would destroy high-frequency intents like `place_call` or `finance_summary`), we replace sensitive spans in-place (e.g. `"Call Sarah at 0795551234"` $\rightarrow$ `"Call <NAME> at <PHONE>"`).

### 4. The Scrub-Then-Prove Flow
Data passes through two separate mechanisms:
1. `scrub(text)`: Performs regex substitution passes in exact priority order (`EMAIL` $\rightarrow$ `IBAN` $\rightarrow$ `PHONE` $\rightarrow$ `ADDRESS` $\rightarrow$ `NAME`).
2. `verify(text)`: An independent, fail-closed verification pass that re-scans output text. Returns `True` only if zero raw PII patterns remain.

---

## 📐 Day 2: Labelling Discipline & Clean Gold Corpus

### 1. The Purpose
Sanitized data is not automatically trustworthy. Without strict rules, different labellers guess labels based on "vibes", making dataset benchmarks noisy and unreliable. Day 2 creates a written annotation specification to standardize intent classification.

### 2. Anatomy of an Intent Specification
Every intent (`create_task`, `place_call`, `answer_question`, `save_memory`, `set_timer`, `out_of_scope`) defines:
1. **One-Line Definition**: Precise scope statement.
2. **Positive Trigger Phrases**: Concrete examples.
3. **Explicit Exclusions (`NOT this when...`)**: Non-examples.
4. **Tie-Breaker Clause**: Mandatory decision rule when two intents overlap.

### 3. Key Tie-Breakers Summary
* **`create_task` vs `place_call`**: Scheduled or delayed requests (*"remind me to call mom"*) are `create_task`. Only immediate live dial directives belong to `place_call`.
* **`create_task` vs `set_timer`**: Relative countdowns with a named action (*"in 10 minutes remind me to check oven"*) are `create_task`. Pure duration timers are `set_timer`.
* **`save_memory` vs `create_task`**: Static facts with no time or action trigger (*"log garage code 4492"*) are `save_memory`.

### 4. Normalisation & Near-Deduplication
Text drift (casing, spaces, punctuation) is eliminated via:
$$\text{normalise}(t) = \text{strip\_punct}(\text{lowercase}(\text{collapse\_spaces}(t)))$$
Duplicates are merged, producing a clean, 34-row golden benchmark set (`clean_gold.csv`).

---

## 📊 Day 3: Measuring Agreement & Trusting Your Golden Set

### 1. The Purpose
Before trusting an evaluation benchmark, you must measure whether humans agree with each other. Raw percentage agreement flattery hides chance agreement. Day 3 measures agreement using **Cohen's Kappa ($\kappa$)**, which subtracts chance luck:

$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

* **$p_o$ (Observed Agreement):** Percentage of matching rows between Annotator A and B ($85.0\%$).
* **$p_e$ (Chance Agreement):** Expected baseline luck based on label frequency ($19.0\%$).
* **Cohen’s Kappa ($\kappa$):** **0.815** $\rightarrow$ **Near-perfect Agreement** ($\kappa \ge 0.80$).

### 2. Disagreement Adjudication Log
Every human disagreement was resolved against `guideline.md`:
1. `"Remind me to call <NAME> at <EMAIL> tomorrow"` $\rightarrow$ **Adjudicated to `create_task`** *(Clause 2.1: Reminder syntax overrides call keyword)*.
2. `"Contact customer support at <EMAIL> regarding issue"` $\rightarrow$ **Adjudicated to `out_of_scope`** *(Clause 2.6: Email channel is unsupported)*.
3. `"Call doctor Office on +<PHONE>567 to reschedule"` $\rightarrow$ **Adjudicated to `place_call`** *(Clause 2.2: Immediate dial instruction overrides secondary purpose phrase)*.

---

## 🤖 Day 4: The LLM Teacher — Generate, Then Filter

### 1. The Purpose
Real datasets often have starving, "thin" classes (e.g., `save_memory` with 3 rows, `set_timer` with 1 row). Day 4 expands thin classes using the Qwen3-14B-AWQ model as an LLM Teacher, enforcing **schema-locked JSON decoding** and a deterministic **4-step filter gate** ("Generate, Then Filter").

### 2. The 4-Step Deterministic Filter Gate
1. **Off-Label Gate**: Rejects candidate rows labelled outside the requested target classes.
2. **Blank Gate**: Drops empty strings or whitespace-only lines (`.strip()`).
3. **Duplicate Gate**: Drops exact and case-insensitive near-duplicates `(normalized_text.lower(), label)`.
4. **Survivor Admission**: Retains clean, unique on-label synthetic utterances to expand the gold set.

### 3. Day 4 Filtering Scoreboard
- **Total Candidates Generated**: **44** (22 `save_memory` + 22 `set_timer`)
- **Kept Survivors**: **31** (16 `save_memory`, 15 `set_timer`)
- **Dropped Off-Label**: **5**
- **Dropped Blank**: **3**
- **Dropped Duplicates**: **5**
- **Net Growth**: `save_memory` (+533%), `set_timer` (+1500%)

---

## 🧊 Day 5: Merge, Analyse, Freeze — The Capstone Deliverable

### 1. The Purpose
Eliminates data leakage risks by enforcing global deduplication across merged real and synthetic sets before splitting. Executes error analysis on held-out slices to drive targeted synthetic iterations and freezes a versioned dataset card for Week 8 capstone training.

### 2. Key Pipeline Actions
1. **Leakage-Safe Order**: Merges real (`clean_gold.csv`) and synthetic (`filtered_survivors.csv`), normalizes text, deduplicates globally, and performs an 80/20 train/test split with `random_state=0`.
2. **Error Analysis (`rank_confusions`)**: Ranks off-diagonal prediction error pairs by frequency to isolate intent overlap (e.g. `set_timer -> create_task`).
3. **Targeted Fix Loop**: Formulates precise synthetic prompts to fix top confusion boundaries.
4. **Dataset Card Freeze**: Locks version `v1.0.0` (64 total rows, 34 real / 30 synthetic split, $\kappa = 0.815$, guideline link).

---

## 🏃 How to Run the Code

### 1. Run Day 1 (PII Scrubbing):
```bash
cd "Day 1"
python main.py
```

### 2. Run Day 2 (Normalisation & Gold Generation):
```bash
cd "Day 2"
python main.py    # Or: node main.js
```

### 3. Run Day 3 (Cohen's Kappa & Agreement Audit):
```bash
cd "Day 3"
python cohen_kappa.py   # Or: node cohen_kappa.js
```

### 4. Run Day 4 (Synthetic LLM Generation & Filtering):
```bash
cd "Day 4"
python generator.py   # Or: node generator.js
```

### 5. Run Day 5 (Merge, Dedup, Error Analysis & Dataset Card):
```bash
cd "Day 5"
python main.py
```


