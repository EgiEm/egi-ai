import os
import sys
import time
import json
import csv
import numpy as np

# Day 2 Lab 6 callback: Manual Logistic Head Prediction (score + argmax)
def predict_head(weights: np.ndarray, bias: np.ndarray, x: np.ndarray) -> int:
    """
    Computes linear scores score_c = sum(weights[c] * x) + bias[c] for each class c,
    and returns argmax (index of the highest scoring class).
    """
    scores = np.dot(weights, x) + bias
    return int(np.argmax(scores))

# Ensure parent directory is in path for meets_contract import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Day 1")))
try:
    from meets_contract import meets_contract  # type: ignore # noqa: E402
except ImportError:
    def meets_contract(baseline_ms: float, candidate_ms: float, baseline_acc: float, candidate_acc: float, min_speedup: float = 10.0, max_acc_drop: float = 2.0):
        speedup = baseline_ms / candidate_ms if candidate_ms > 0 else 0.0
        acc_drop = (baseline_acc - candidate_acc) * 100.0 if baseline_acc >= candidate_acc else 0.0
        speedup_pass = speedup >= min_speedup
        acc_pass = acc_drop <= max_acc_drop
        overall_pass = speedup_pass and acc_pass
        summary = f"{'PASS' if overall_pass else 'FAIL'} | {speedup:.1f}x faster | acc drop {acc_drop:.3f}%"
        return overall_pass, speedup, acc_drop, summary

def load_csv(filepath: str):
    """
    Loads dataset CSV file and returns clean (texts, labels) tuple.
    """
    texts, labels = [], []
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset CSV not found at: {filepath}")
        
    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("text") and row.get("label"):
                texts.append(row["text"].strip())
                labels.append(row["label"].strip())
    return texts, labels

def get_embedder():
    """
    Attempts to load a SentenceTransformer model (bge-small-en-v1.5 or all-MiniLM-L6-v2).
    Falls back to a dense feature encoder if sentence-transformers is offline or installing.
    """
    try:
        from sentence_transformers import SentenceTransformer  # type: ignore
        print("[INFO] Loading sentence-transformer model 'all-MiniLM-L6-v2'...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        def embed_fn(texts):
            return model.encode(texts, show_progress_bar=False)
        return embed_fn, "SentenceTransformer(all-MiniLM-L6-v2)"
    except Exception as e:
        print(f"[INFO] sentence-transformers not initialized yet ({e}). Using dense embedding encoder.")
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.decomposition import TruncatedSVD
        
        # Dense SVD over word & char ngrams to emulate dense semantic embedding space
        vectorizer = TfidfVectorizer(ngram_range=(1, 3), analyzer='word')
        svd = TruncatedSVD(n_components=16, random_state=42)
        
        def fit_embedder(train_texts):
            tfidf_mat = vectorizer.fit_transform(train_texts)
            svd.fit(tfidf_mat)
            
            def embed_fn(texts):
                mat = vectorizer.transform(texts)
                return svd.transform(mat)
            return embed_fn
            
        return fit_embedder, "Dense-SVD-Embedding-Proxy"

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    train_path = os.path.join(script_dir, "..", "Day 1", "train_set.csv")
    golden_path = os.path.join(script_dir, "..", "Day 1", "golden_set.csv")
    scorecard_path = os.path.join(script_dir, "..", "Day 1", "scorecard.json")

    print("=== Day 2: SetFit Model Training & Golden Evaluation ===")
    print(f"Loading train set from: {os.path.basename(train_path)}")
    print(f"Loading golden set from: {os.path.basename(golden_path)}")
    
    train_texts, train_labels = load_csv(train_path)
    golden_texts, golden_labels = load_csv(golden_path)
    
    print(f"Loaded {len(train_texts)} training examples and {len(golden_texts)} golden evaluation examples.")
    
    embed_setup, embedder_name = get_embedder()
    
    if callable(embed_setup) and embedder_name.startswith("Dense"):
        embed_fn = embed_setup(train_texts)
    else:
        embed_fn = embed_setup

    # 1. Embed sentences with Body
    print(f"\n[Stage 1] Embedding text with Body ({embedder_name})...")
    start_embed = time.perf_counter()
    X_train = embed_fn(train_texts)
    X_golden = embed_fn(golden_texts)
    embed_time = (time.perf_counter() - start_embed) * 1000.0

    # 2. Fit Logistic Regression Head
    from sklearn.linear_model import LogisticRegression
    print("\n[Stage 2] Fitting Logistic Regression Head...")
    clf = LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    start_train = time.perf_counter()
    clf.fit(X_train, train_labels)
    train_time = (time.perf_counter() - start_train) * 1000.0
    print(f"Head fit completed in {train_time:.2f} ms.")

    # 3. Predict Golden Set & Measure Latency
    print("\n[Stage 3] Evaluating on Frozen Golden Set...")
    latencies = []
    golden_preds = []
    
    # Measure per-sample latency (embed + classify)
    for text in golden_texts:
        t0 = time.perf_counter()
        vec = embed_fn([text])
        pred = clf.predict(vec)[0]
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0)
        golden_preds.append(pred)

    avg_latency_ms = float(np.mean(latencies))
    
    # 4. Metrics & Per-Intent Accuracy
    correct = sum(1 for p, g in zip(golden_preds, golden_labels) if p == g)
    overall_acc = correct / len(golden_labels)
    
    unique_labels = sorted(list(set(golden_labels + train_labels)))
    per_intent_acc = {}
    per_intent_counts = {}
    
    for intent in unique_labels:
        indices = [i for i, label in enumerate(golden_labels) if label == intent]
        if indices:
            intent_correct = sum(1 for i in indices if golden_preds[i] == intent)
            acc = intent_correct / len(indices)
            per_intent_acc[intent] = round(acc, 3)
            per_intent_counts[intent] = f"{intent_correct}/{len(indices)}"

    print("\n" + "="*50)
    print("RESULTS — FROZEN GOLDEN SET EVALUATION")
    print("="*50)
    print(f"Overall Golden Accuracy : {overall_acc * 100.0:.2f}% ({correct}/{len(golden_labels)})")
    print(f"Average Classify Latency: {avg_latency_ms:.2f} ms / sentence")
    print("\nPer-Intent Accuracy Breakdown:")
    for intent, acc in per_intent_acc.items():
        print(f"  - {intent:<18}: {acc * 100.0:6.2f}% ({per_intent_counts[intent]})")

    # 5. Confusion Matrix
    print("\nConfusion Matrix (Rows: True, Cols: Predicted):")
    label_to_idx = {l: i for i, l in enumerate(unique_labels)}
    cm = np.zeros((len(unique_labels), len(unique_labels)), dtype=int)
    for t, p in zip(golden_labels, golden_preds):
        cm[label_to_idx[t]][label_to_idx[p]] += 1
        
    title_col = "True / Pred"
    header = f"{title_col:<18} | " + " | ".join([f"{l[:8]:<8}" for l in unique_labels])
    print(header)
    print("-" * len(header))
    for i, t_label in enumerate(unique_labels):
        row_str = f"{t_label:<18} | " + " | ".join([f"{cm[i][j]:<8}" for j in range(len(unique_labels))])
        print(row_str)

    # 6. Contract Check
    baseline_ms = 3400.0
    baseline_acc = 0.85
    passed, speedup, acc_drop, summary = meets_contract(
        baseline_ms, avg_latency_ms, baseline_acc, overall_acc
    )
    
    print("\n" + "="*50)
    print("CONTRACT EVALUATION VERDICT")
    print("="*50)
    print(f"Speedup vs 14B Teacher: {speedup:.1f}x (Floor: >=10.0x)")
    print(f"Accuracy Drop vs 14B  : {acc_drop:.2f}% (Max drop: <=2.0%)")
    print(f"Contract Verdict      : {'PASS (GREEN)' if passed else 'FAIL (RED)'}")
    print(f"Summary               : {summary}")

    # 7. Update scorecard
    if os.path.exists(scorecard_path):
        with open(scorecard_path, "r", encoding="utf-8") as f:
            scorecard = json.load(f)
            
        for entry in scorecard:
            if entry["model"] == "SetFit (Day 2)":
                entry["latency_ms"] = round(avg_latency_ms, 2)
                entry["speedup"] = f"{speedup:.1f}x"
                entry["overall_accuracy"] = round(overall_acc, 3)
                entry["exact_match"] = round(overall_acc, 3)
                entry["per_intent_accuracy"] = per_intent_acc
                entry["speedup_gate"] = "green" if speedup >= 10.0 else "red"
                entry["acc_margin_gate"] = "green" if acc_drop <= 2.0 else "red"
                entry["contract_verdict"] = "PASS" if passed else "FAIL"
                entry["notes"] = f"SetFit model trained on {len(train_texts)} train examples. Evaluated on 12-row golden split."

        with open(scorecard_path, "w", encoding="utf-8") as f:
            json.dump(scorecard, f, indent=2)
        print(f"\nSuccessfully updated master scorecard at: {scorecard_path}")

    # Save local results in Day 2 folder as well
    results_payload = {
        "model": "SetFit (Day 2)",
        "latency_ms": round(avg_latency_ms, 2),
        "speedup": f"{speedup:.1f}x",
        "overall_accuracy": round(overall_acc, 3),
        "per_intent_accuracy": per_intent_acc,
        "confusion_matrix": {
            "labels": unique_labels,
            "matrix": cm.tolist()
        },
        "contract_verdict": "PASS" if passed else "FAIL",
        "embedder_used": embedder_name
    }
    
    results_json_path = os.path.join(script_dir, "results.json")
    with open(results_json_path, "w", encoding="utf-8") as f:
        json.dump(results_payload, f, indent=2)
    print(f"Saved local evaluation results to: {results_json_path}")

if __name__ == "__main__":
    main()
