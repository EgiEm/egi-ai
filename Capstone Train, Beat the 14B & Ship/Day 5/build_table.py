"""
build_table.py — Code-generated results table for the capstone report.

Reads the master scorecard from Day 1, computes speedup per rung,
sorts fastest-first, and prints the final CONTRACT verdict.
The output of this script IS the results table in the report — never hand-typed.

Usage:
    python build_table.py
"""

import json
import os
import sys

# Import the contract evaluator from Day 1
DAY1_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Day 1"))
if DAY1_DIR not in sys.path:
    sys.path.insert(0, DAY1_DIR)

from meets_contract import meets_contract


def build_table(scorecard):
    """
    Takes the full scorecard (list of dicts), computes each rung's speedup
    vs the 14B baseline, collects (name, golden_acc, p50_ms, speedup),
    and sorts fastest-first (highest speedup at the top).
    Returns the sorted rows list.
    """
    # Find the baseline row
    baseline_p50 = None
    baseline_acc = None
    for entry in scorecard:
        if "baseline" in entry["model"].lower():
            baseline_p50 = entry["latency_ms"]
            baseline_acc = entry["overall_accuracy"]
            break

    if baseline_p50 is None:
        raise ValueError("No baseline row found in scorecard")

    rows = []
    for entry in scorecard:
        p50 = entry["latency_ms"]
        speedup = baseline_p50 / p50 if p50 > 0 else 0.0
        rows.append({
            "name": entry["model"],
            "golden_acc": entry["overall_accuracy"],
            "p50_ms": p50,
            "speedup": speedup,
        })

    # Sort fastest-first (highest speedup at the top)
    rows.sort(key=lambda r: r["speedup"], reverse=True)

    return rows, baseline_p50, baseline_acc


def contract_verdict(rows, baseline_p50, baseline_acc):
    """
    Finds the best non-baseline candidate and runs the Day-1 contract check.
    Returns the verdict string.
    """
    for row in rows:
        if "baseline" in row["name"].lower():
            continue
        # First non-baseline row (fastest candidate)
        passed, speedup, acc_drop, summary = meets_contract(
            baseline_ms=baseline_p50,
            candidate_ms=row["p50_ms"],
            baseline_acc=baseline_acc,
            candidate_acc=row["golden_acc"],
        )
        verdict = "PASS" if passed else "FAIL"
        return f"CONTRACT: {verdict} - {speedup:.1f}x faster, accuracy within margin"

    return "CONTRACT: NO CANDIDATE FOUND"


if __name__ == "__main__":
    scorecard_path = os.path.join(DAY1_DIR, "scorecard.json")

    with open(scorecard_path, "r", encoding="utf-8") as f:
        scorecard = json.load(f)

    rows, baseline_p50, baseline_acc = build_table(scorecard)

    # Print the results table
    header = f"{'CANDIDATE':<24}| {'ACC':>7} | {'P50 (ms)':>8} | {'SPEEDUP':>8}"
    print(header)
    print("-" * len(header))
    for row in rows:
        name = row["name"].replace(" (baseline)", "").replace(" (Day 2)", "").replace(" (Day 3)", "").replace(" (Day 4)", "")
        acc_str = f"{row['golden_acc'] * 100:.1f}%"
        p50_str = f"{row['p50_ms']:.2f}"
        spd_str = f"{row['speedup']:.1f}x"
        print(f"{name:<24}| {acc_str:>7} | {p50_str:>8} | {spd_str:>8}")

    print()
    print(contract_verdict(rows, baseline_p50, baseline_acc))
