"""
v7 Day 1 — Main Runner: Sanitize the Real Sample & Verify Seed Corpus
======================================================================
1. Loads raw OXODIN requests with PII (~30 rows, including multilingual DE, FR, ES).
2. Redacts PII spans in place via scrub().
3. Proves zero raw PII leakage via independent verify() pass.
4. Saves sanitized seed corpus to sanitised_sample.csv.
"""

import csv
import os
from scrubber import scrub, verify
from edge_cases import run_edge_case_demo

RAW_CSV_PATH = os.path.join(os.path.dirname(__file__), "raw_sample.csv")
SANITISED_CSV_PATH = os.path.join(os.path.dirname(__file__), "sanitised_sample.csv")


def main():
    print("=" * 80)
    print("  Week 7 Day 1 — Sanitize the Real Sample & Verify Seed Corpus")
    print("=" * 80)

    if not os.path.exists(RAW_CSV_PATH):
        raise FileNotFoundError(f"raw_sample.csv not found at {RAW_CSV_PATH}")

    raw_rows = []
    with open(RAW_CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_rows.append(row)

    print(f"\nLoaded {len(raw_rows)} raw OXODIN request transcripts.")
    print("-" * 80)

    sanitised_rows = []
    total_redactions = 0
    all_clean = True
    non_english_count = 0

    print(f"{'#':<3} {'Original Text':<45} {'Sanitized Text':<45} {'Redactions':<10} {'Clean?'}")
    print("-" * 110)

    for i, row in enumerate(raw_rows, 1):
        raw_text = row["text"]
        intent = row["intent"]
        lang = row.get("language", "en")
        comment = row.get("comment", "")

        if lang != "en":
            non_english_count += 1

        clean_text, count = scrub(raw_text)
        total_redactions += count

        is_clean = verify(clean_text)
        if not is_clean:
            all_clean = False

        sanitised_rows.append({
            "id": i,
            "raw_text": raw_text,
            "sanitised_text": clean_text,
            "intent": intent,
            "language": lang,
            "redactions_count": count,
            "verify_clean": is_clean,
            "comment": comment
        })

        disp_raw = (raw_text[:42] + "...") if len(raw_text) > 42 else raw_text
        disp_clean = (clean_text[:42] + "...") if len(clean_text) > 42 else clean_text
        clean_str = "YES" if is_clean else "NO (LEAK)"

        print(f"{i:<3} {disp_raw:<45} {disp_clean:<45} {count:<10} {clean_str}")

    # Write output CSV: sanitised_sample.csv
    with open(SANITISED_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["id", "sanitised_text", "intent", "language", "redactions_count", "verify_clean", "comment"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in sanitised_rows:
            writer.writerow({
                "id": row["id"],
                "sanitised_text": row["sanitised_text"],
                "intent": row["intent"],
                "language": row["language"],
                "redactions_count": row["redactions_count"],
                "verify_clean": row["verify_clean"],
                "comment": row["comment"]
            })

    print("-" * 110)
    print(f"\nSanitisation Summary:")
    print(f"  Total Processed Rows:   {len(sanitised_rows)}")
    print(f"  Non-English Rows:       {non_english_count} (Includes inline English glosses)")
    print(f"  Total Redacted Spans:   {total_redactions}")
    print(f"  All Rows Verify-Clean:  {all_clean} (Proof: Zero raw PII leaked)")
    print(f"  Sanitized Seed Corpus:  {SANITISED_CSV_PATH}")

    # Execute Edge Case Analysis
    print("\n")
    run_edge_case_demo()


if __name__ == "__main__":
    main()
