import json
import math
import os
import sys

# Add Day 1 directory to path for contract evaluator
DAY1_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Day 1"))
if DAY1_DIR not in sys.path:
    sys.path.insert(0, DAY1_DIR)

from meets_contract import meets_contract


def percentile(latencies, p):
    """
    Nearest-rank percentile calculation from scratch.
    Sorts latencies ascending, computes 1-based rank = ceil((p/100) * n),
    clamps rank to >= 1, and returns the latency value at index rank - 1.
    """
    sorted_lats = sorted(latencies)
    n = len(sorted_lats)
    if n == 0:
        return 0.0
    rank = math.ceil((p / 100.0) * n)
    rank = max(1, min(rank, n))
    return sorted_lats[rank - 1]


def evaluate_qlora():
    current_dir = os.path.dirname(__file__)
    predictions_path = os.path.join(current_dir, "predictions.json")
    results_path = os.path.join(current_dir, "results.json")
    scorecard_path = os.path.join(DAY1_DIR, "scorecard.json")

    with open(predictions_path, "r", encoding="utf-8") as f:
        predictions = json.load(f)

    # 1. Latency & Percentile calculations
    latencies = [row["latency_ms"] for row in predictions]
    baseline_p50 = 3400.0  # Qwen3-14B-AWQ baseline latency in ms

    p50_latency = percentile(latencies, 50)
    p95_latency = percentile(latencies, 95)
    speedup = baseline_p50 / p50_latency if p50_latency > 0 else 0.0

    # 2. Golden Set Evaluation
    gold_labels = [row["golden_label"] for row in predictions]
    pred_labels = [row["predicted_label"] for row in predictions]

    total_rows = len(predictions)
    correct_count = sum(1 for g, p in zip(gold_labels, pred_labels) if g == p)
    overall_acc = round(correct_count / total_rows, 3)
    exact_match = overall_acc

    # Per-intent accuracy calculation
    all_labels = sorted(list(set(gold_labels)))
    per_intent_acc = {}
    for label in all_labels:
        label_total = sum(1 for g in gold_labels if g == label)
        label_correct = sum(1 for g, p in zip(gold_labels, pred_labels) if g == label and p == label)
        per_intent_acc[label] = round(label_correct / label_total, 3) if label_total > 0 else 0.0

    # Confusion matrix calculation
    matrix = [[0 for _ in range(len(all_labels))] for _ in range(len(all_labels))]
    label_to_idx = {lbl: idx for idx, lbl in enumerate(all_labels)}
    for g, p in zip(gold_labels, pred_labels):
        row = label_to_idx[g]
        col = label_to_idx[p]
        matrix[row][col] += 1

    # 3. Contract evaluation
    baseline_acc = 0.85
    passed, _, acc_drop, verdict_summary = meets_contract(
        baseline_ms=baseline_p50,
        candidate_ms=p50_latency,
        baseline_acc=baseline_acc,
        candidate_acc=overall_acc
    )

    verdict_str = "PASS" if passed else "FAIL"

    # Build local Day 4 results
    day4_results = {
        "model": "QLoRA fine-tune (Day 4)",
        "training_environment": "Colab T4 GPU (4-bit frozen Qwen base + LoRA rank-8 adapters)",
        "evaluation_environment": "Local deterministic eval script (golden split)",
        "latency_p50_ms": round(p50_latency, 2),
        "latency_p95_ms": round(p95_latency, 2),
        "speedup": f"{speedup:.1f}x",
        "overall_accuracy": overall_acc,
        "exact_match": exact_match,
        "per_intent_accuracy": per_intent_acc,
        "confusion_matrix": {
            "labels": all_labels,
            "matrix": matrix
        },
        "speedup_gate": "green" if speedup >= 10.0 else "red",
        "acc_margin_gate": "green" if acc_drop <= 2.0 else "red",
        "contract_verdict": verdict_str,
        "verdict_summary": verdict_summary
    }

    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(day4_results, f, indent=2)

    print(f"Saved Day 4 results to {results_path}")

    # 4. Update Day 1 Master Scorecard
    if os.path.exists(scorecard_path):
        with open(scorecard_path, "r", encoding="utf-8") as f:
            scorecard = json.load(f)

        for entry in scorecard:
            if entry.get("model") == "QLoRA fine-tune (Day 4)":
                entry["latency_ms"] = round(p50_latency, 2)
                entry["latency_p95_ms"] = round(p95_latency, 2)
                entry["speedup"] = f"{speedup:.1f}x"
                entry["overall_accuracy"] = overall_acc
                entry["exact_match"] = exact_match
                entry["per_intent_accuracy"] = per_intent_acc
                entry["speedup_gate"] = "green" if speedup >= 10.0 else "red"
                entry["acc_margin_gate"] = "green" if acc_drop <= 2.0 else "red"
                entry["contract_verdict"] = verdict_str
                entry["notes"] = f"QLoRA 4-bit fine-tune trained on Colab T4 GPU (209 examples). Evaluated on 12-row golden split. p50={p50_latency:.1f}ms, p95={p95_latency:.1f}ms."

        with open(scorecard_path, "w", encoding="utf-8") as f:
            json.dump(scorecard, f, indent=2)

        print(f"Updated master scorecard at {scorecard_path}")

    # Print summary output to console
    print("\n==========================================")
    print("      DAY 4 QLORA EVALUATION RESULTS      ")
    print("==========================================")
    print(f"Candidate p50 Latency : {p50_latency:.2f} ms")
    print(f"Candidate p95 Latency : {p95_latency:.2f} ms")
    print(f"Baseline 14B Latency  : {baseline_p50:.2f} ms")
    print(f"Speedup Factor        : {speedup:.1f}x")
    print(f"Overall Accuracy      : {overall_acc * 100:.1f}%")
    print(f"Contract Verdict      : {verdict_str}")
    print("------------------------------------------")
    print("Per-Intent Accuracy:")
    for intent, acc in per_intent_acc.items():
        print(f"  {intent:16s}: {acc * 100:.1f}%")
    print("==========================================")


if __name__ == "__main__":
    evaluate_qlora()
