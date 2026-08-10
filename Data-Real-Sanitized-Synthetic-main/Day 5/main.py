import csv
import os
import re
import random

def normalise_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def load_real_gold(filepath: str):
    rows = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({
                'id': r['id'].strip(),
                'utterance': r['sanitised_text'].strip(),
                'normalised_key': r['normalised_key'].strip() if r.get('normalised_key') else normalise_text(r['sanitised_text']),
                'intent': r['guideline_label'].strip(),
                'source': 'real_sanitized',
                'language': r.get('language', 'en').strip()
            })
    return rows

def load_synthetic_survivors(filepath: str):
    rows = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            if r.get('verdict', '').strip() == 'kept' or not r.get('verdict'):
                utt = r['text'].strip()
                rows.append({
                    'id': r['id'].strip(),
                    'utterance': utt,
                    'normalised_key': normalise_text(utt),
                    'intent': r['label'].strip(),
                    'source': 'synthetic_filtered',
                    'language': r.get('lang', 'en').strip()
                })
    return rows

def merge_and_deduplicate(real_rows, synthetic_rows):
    seen_keys = set()
    merged = []
    dropped_dupes = []

    # Priority 1: Real gold rows
    for r in real_rows:
        key = r['normalised_key']
        if key not in seen_keys:
            seen_keys.add(key)
            merged.append(r)
        else:
            dropped_dupes.append((r, 'duplicate_in_real'))

    # Priority 2: Synthetic rows
    for r in synthetic_rows:
        key = r['normalised_key']
        if key not in seen_keys:
            seen_keys.add(key)
            merged.append(r)
        else:
            dropped_dupes.append((r, 'duplicate_synthetic_with_real_or_prior'))

    return merged, dropped_dupes

def train_test_split(dataset, test_ratio=0.2, seed=0):
    shuffled = list(dataset)
    rng = random.Random(seed)
    rng.shuffle(shuffled)

    test_size = int(len(shuffled) * test_ratio)
    test_set = shuffled[:test_size]
    train_set = shuffled[test_size:]

    # Integrity check: Ensure zero key overlap across train and test
    train_keys = {r['normalised_key'] for r in train_set}
    test_keys = {r['normalised_key'] for r in test_set}
    leakage = train_keys.intersection(test_keys)
    if leakage:
        raise ValueError(f"CRITICAL ERROR: Data leakage detected across split! Overlapping keys: {leakage}")

    return train_set, test_set

def rank_confusions(rows):
    correct = 0
    pairs = {}
    for true_label, pred_label in rows:
        if true_label == pred_label:
            correct += 1
        else:
            pair = (true_label, pred_label)
            pairs[pair] = pairs.get(pair, 0) + 1
    
    total = len(rows)
    accuracy = round(correct / total, 3) if total > 0 else 0.0
    ranked = sorted(pairs.items(), key=lambda kv: (-kv[1], kv[0][0], kv[0][1]))
    return accuracy, ranked

def write_csv(filepath, rows, fieldnames):
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    day2_path = os.path.join(base_dir, '..', 'Day 2', 'clean_gold.csv')
    day4_path = os.path.join(base_dir, '..', 'Day 4', 'filtered_survivors.csv')

    real_rows = load_real_gold(day2_path)
    synthetic_rows = load_synthetic_survivors(day4_path)

    merged, dropped = merge_and_deduplicate(real_rows, synthetic_rows)

    print(f"Loaded Real Rows: {len(real_rows)}")
    print(f"Loaded Synthetic Rows: {len(synthetic_rows)}")
    print(f"Total Merged & Deduplicated Rows: {len(merged)}")
    print(f"Dropped Duplicate Rows: {len(dropped)}")
    for d, reason in dropped:
        print(f"  - Dropped ID {d['id']}: '{d['utterance']}' ({reason})")

    train_set, test_set = train_test_split(merged, test_ratio=0.2, seed=0)
    print(f"\nTrain/Test Split (random_state=0):")
    print(f"  - Train Set: {len(train_set)} rows")
    print(f"  - Test Set: {len(test_set)} rows")

    fieldnames = ['id', 'utterance', 'normalised_key', 'intent', 'source', 'language']
    
    write_csv(os.path.join(base_dir, 'dataset_v1.csv'), merged, fieldnames)
    write_csv(os.path.join(base_dir, 'train_v1.csv'), train_set, fieldnames)
    write_csv(os.path.join(base_dir, 'test_v1.csv'), test_set, fieldnames)

    # Class distribution statistics
    class_counts = {}
    source_counts = {'real_sanitized': 0, 'synthetic_filtered': 0}
    for r in merged:
        intent = r['intent']
        class_counts[intent] = class_counts.get(intent, 0) + 1
        source_counts[r['source']] += 1

    print("\nPer-Class Counts:")
    for intent, count in sorted(class_counts.items(), key=lambda x: -x[1]):
        print(f"  - {intent}: {count}")

    print("\nReal vs Synthetic Split:")
    print(f"  - Real Sanitized: {source_counts['real_sanitized']}")
    print(f"  - Synthetic Filtered: {source_counts['synthetic_filtered']}")

    # Error Analysis simulation on held-out test predictions
    test_eval_predictions = [
        ('place_call', 'place_call'),
        ('place_call', 'place_call'),
        ('place_call', 'place_call'),
        ('set_timer', 'set_timer'),
        ('set_timer', 'create_task'),     # Error 1
        ('set_timer', 'create_task'),     # Error 2
        ('save_memory', 'save_memory'),
        ('save_memory', 'save_memory'),
        ('save_memory', 'save_memory'),
        ('create_task', 'create_task'),
        ('create_task', 'create_task'),
        ('create_task', 'set_timer'),     # Error 3
        ('out_of_scope', 'out_of_scope'),
        ('out_of_scope', 'out_of_scope'),
        ('answer_question', 'answer_question'),
        ('answer_question', 'out_of_scope'), # Error 4
    ]

    acc, confusions = rank_confusions(test_eval_predictions)
    print(f"\n--- Error Analysis Results ---")
    print(f"Accuracy: {acc}")
    print("Ranked Confusion Pairs (true -> predicted):")
    for (true_intent, pred_intent), count in confusions:
        print(f"  - {true_intent} -> {pred_intent}: {count}")

if __name__ == '__main__':
    main()
