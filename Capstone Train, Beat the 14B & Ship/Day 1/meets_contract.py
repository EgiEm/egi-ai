def meets_contract(
    baseline_ms: float,
    candidate_ms: float,
    baseline_acc: float,
    candidate_acc: float,
    min_speedup: float = 10.0,
    max_acc_drop: float = 2.0
):
    """
    Evaluates a candidate model against the baseline teacher contract.
    Returns (passed, speedup, acc_drop, summary_string).
    
    Contract Rules:
    - Speedup floor: candidate latency must be at least min_speedup times faster than baseline.
    - Accuracy margin: candidate accuracy drop (baseline - candidate) must be <= max_acc_drop (in percentage points).
    - BOTH conditions are strictly required.
    """
    speedup = baseline_ms / candidate_ms if candidate_ms > 0 else 0.0
    
    # Calculate accuracy drop in percentage points (e.g. 0.85 - 0.84 = 0.01 -> 1.0 point drop)
    acc_drop = (baseline_acc - candidate_acc) * 100.0 if baseline_acc >= candidate_acc else 0.0

    speedup_pass = speedup >= min_speedup
    acc_pass = acc_drop <= max_acc_drop
    overall_pass = speedup_pass and acc_pass

    reason = []
    if not speedup_pass:
        reason.append(f"too slow ({speedup:.1f}x < {min_speedup:.1f}x)")
    if not acc_pass:
        reason.append(f"acc drop too big ({acc_drop:.1f}% > {max_acc_drop:.1f}%)")

    verdict_str = "PASS" if overall_pass else "FAIL"
    detail_str = f" | {', '.join(reason)}" if reason else ""

    summary = f"{verdict_str} | {speedup:.1f}x faster | acc drop {acc_drop:.3f}%{detail_str}"
    return overall_pass, speedup, acc_drop, summary


# Fixed test scenarios from Lab B
SCENARIOS = [
    {
        "name": "Scenario 1 (Fast & Accurate)",
        "baseline_ms": 3400.0,
        "candidate_ms": 40.0,
        "baseline_acc": 0.85,
        "candidate_acc": 0.84,
    },
    {
        "name": "Scenario 2 (Accurate but Slow)",
        "baseline_ms": 3400.0,
        "candidate_ms": 425.0,
        "baseline_acc": 0.85,
        "candidate_acc": 0.84,
    },
    {
        "name": "Scenario 3 (Fast but Inaccurate)",
        "baseline_ms": 3400.0,
        "candidate_ms": 40.0,
        "baseline_acc": 0.85,
        "candidate_acc": 0.79,
    },
]

if __name__ == "__main__":
    print("=== Contract Evaluator Test Scenarios ===")
    for idx, sc in enumerate(SCENARIOS, 1):
        _, _, _, verdict = meets_contract(
            sc["baseline_ms"],
            sc["candidate_ms"],
            sc["baseline_acc"],
            sc["candidate_acc"]
        )
        print(f"scenario {idx}: {verdict}")
