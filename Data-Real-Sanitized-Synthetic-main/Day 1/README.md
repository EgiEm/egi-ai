# Day 1 · Real Requests, Real Risk — Sanitize the Data

## Summary
Before any raw voice request can be used to train an AI intent classifier, it must be stripped of personal information. This directory contains the complete implementation for **Day 1: Data Sanitization**, featuring a deterministic PII scrubber, an independent verification suite, a 30-row seed corpus dataset, and edge-case pitfall demonstrations.

---

## Key Artifacts & File Structure

| File | Description |
| :--- | :--- |
| **`scrubber.py`** | Core engine containing compiled Regex patterns (`EMAIL`, `IBAN`, `PHONE`, `NAME`, `ADDRESS`), `scrub()`, `verify()`, and Swiss-German `ss` caveat documentation. |
| **`raw_sample.csv`** | 30 raw OXODIN request transcripts with synthetic PII, featuring 9 multilingual rows (DE, FR, ES) with inline English gloss comments. |
| **`sanitised_sample.csv`** | Clean seed corpus generated after scrubbing and verifying every row. |
| **`edge_cases.py`** | Technical breakdown of 2 real-world edge cases where naive scrubbing fails. |
| **`main.py`** | Workflow driver that executes scrubbing, verification, output generation, and edge-case execution. |

---

## Core Engineering Principles

### 1. Redact-in-Place (Preserve Sentence Shape)
Instead of deleting rows containing PII (which would destroy the training signal for intents like `place_call`), we swap sensitive spans for typed tags:
- **Raw**: `"Call Sarah at +41 79 555 12 34 to discuss the meeting"`
- **Redacted**: `"Call <NAME> at <PHONE> to discuss the meeting"`

### 2. Scrub-Then-Prove (Independent Verification Gate)
A scrubber cannot be trusted on its own word. We enforce two distinct phases:
- `scrub(text)`: Applies sequential regex replacements.
- `verify(text)`: Independent pass using raw un-redacted patterns. Returns `True` **only** when zero raw PII patterns match.

### 3. Swiss-German `ss` Caveat
OXODIN applies a Swiss-German `ss` normalisation rule to generated text output. However, **this rule must never touch input transcripts**. Our scrubber operates strictly on PII entities and leaves Swiss-German spellings (`Strasse`, `ausser`) untouched.

---

## Edge Case Analysis (`edge_cases.py`)

### Case 1: Naive Scrub MISSES PII
- **Sentence**: `"Please call +41 (0)79 555-12.34 to confirm the reservation."`
- **Why Naive Fails**: Simple phone regexes expecting plain whitespace separators (`+41 79...`) fail on internal area-code zeros in parentheses `(0)` and mixed dot/dash delimiters, leaking raw phone numbers.

### Case 2: Naive Scrub OVER-REDACTS Safe Vocabulary
- **Sentence**: `"Order product model CH9300 from catalog page 8001 today."`
- **Why Naive Fails**: Naive IBAN patterns matching `CH` followed by numbers mistake a legitimate product SKU (`CH9300`) for a Swiss IBAN, corrupting safe domain vocabulary.

---

## How to Run & Verify

Run the main pipeline script:
```bash
python main.py
```

### Expected Output Summary:
```text
Sanitisation Summary:
  Total Processed Rows:   30
  Non-English Rows:       9 (Includes inline English glosses)
  Total Redacted Spans:   32
  All Rows Verify-Clean:  True (Proof: Zero raw PII leaked)
  Sanitized Seed Corpus:  sanitised_sample.csv
```
