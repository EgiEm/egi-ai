import csv
import os
import json

# Define thin target classes
ALLOWED_LABELS = {"save_memory", "set_timer"}

# JSON Schema for guided decoding
THE_SCHEMA = {
    "type": "object",
    "properties": {
        "rows": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "label": {"type": "string"}
                },
                "required": ["text", "label"]
            }
        }
    },
    "required": ["rows"]
}

# Prompt definitions
SYSTEM_PROMPT = (
    "You write diverse, realistic, single-intent voice requests for the target intent. "
    "Include paraphrases and at least 3 non-English examples with an inline English gloss "
    "(e.g., 'Ruf Mama an', 'place_call' # = call mom). Label every row strictly with the requested intent."
)

USER_PROMPT_SAVE_MEMORY = "Write 22 candidate rows for the intent 'save_memory'."
USER_PROMPT_SET_TIMER = "Write 22 candidate rows for the intent 'set_timer'."

# Candidate synthetic generations (44 total: 22 per class)
# Includes on-label, off-label, blanks, duplicates, and non-English rows with inline English glosses
CANDIDATE_ROWS = [
    # --- Class 1: save_memory (22 candidate rows) ---
    {"id": "syn-01", "text": "remember my locker code is 4417", "label": "save_memory", "lang": "en"},
    {"id": "syn-02", "text": "save that my passport expires in March", "label": "save_memory", "lang": "en"},
    {"id": "syn-03", "text": "note down that the wifi password is sunflower", "label": "save_memory", "lang": "en"},
    {"id": "syn-04", "text": "Remember my locker code is 4417", "label": "save_memory", "lang": "en"},  # near-dup of syn-01
    {"id": "syn-05", "text": "log that the garage entry code is 4492", "label": "save_memory", "lang": "en"},
    {"id": "syn-06", "text": "save my flight confirmation number AB123", "label": "save_memory", "lang": "en"},
    {"id": "syn-07", "text": "merk dir, ich parke auf Ebene 3 (= remember I parked on level 3)", "label": "save_memory", "lang": "de"},
    {"id": "syn-08", "text": "Erinnere mich an die PIN 9921 (= remember my PIN 9921)", "label": "save_memory", "lang": "de"},
    {"id": "syn-09", "text": "garde en mémoire que mon code est 1234 (= keep in memory that my code is 1234)", "label": "save_memory", "lang": "fr"},
    {"id": "syn-10", "text": "   ", "label": "save_memory", "lang": "en"},  # blank
    {"id": "syn-11", "text": "remind me to buy groceries at 5pm", "label": "create_task", "lang": "en"},  # off-label (task)
    {"id": "syn-12", "text": "remember that Dr Weber's office is on 4th floor", "label": "save_memory", "lang": "en"},
    {"id": "syn-13", "text": "store my passport in the drawer", "label": "save_memory", "lang": "en"},
    {"id": "syn-14", "text": "remember my dog's medication is 2 pills daily", "label": "save_memory", "lang": "en"},
    {"id": "syn-15", "text": "guarda en memoria que la clave es 8877 (= save in memory key is 8877)", "label": "save_memory", "lang": "es"},
    {"id": "syn-16", "text": "save that my license plate is ZH 49201", "label": "save_memory", "lang": "en"},
    {"id": "syn-17", "text": "note that the gate code is 9012", "label": "save_memory", "lang": "en"},
    {"id": "syn-18", "text": "Note that the gate code is 9012", "label": "save_memory", "lang": "en"},  # near-dup of syn-17
    {"id": "syn-19", "text": "save that my passport expires in March", "label": "save_memory", "lang": "en"},  # exact dup of syn-02
    {"id": "syn-20", "text": "remind me to save my file tomorrow", "label": "create_task", "lang": "en"},  # off-label (task)
    {"id": "syn-21", "text": "keep in mind my blood type is O positive", "label": "save_memory", "lang": "en"},
    {"id": "syn-22", "text": "save my doctor's phone number as +41442111111", "label": "save_memory", "lang": "en"},

    # --- Class 2: set_timer (22 candidate rows) ---
    {"id": "syn-23", "text": "set a timer for 15 minutes", "label": "set_timer", "lang": "en"},
    {"id": "syn-24", "text": "timer 10 minutes", "label": "set_timer", "lang": "en"},
    {"id": "syn-25", "text": "Set a timer for 15 minutes", "label": "set_timer", "lang": "en"},  # near-dup of syn-23
    {"id": "syn-26", "text": "set a 45 minute countdown for pizza", "label": "set_timer", "lang": "en"},
    {"id": "syn-27", "text": "stoppuhr auf 5 minuten stellen (= set stopwatch to 5 minutes)", "label": "set_timer", "lang": "de"},
    {"id": "syn-28", "text": "stelle einen timer für 20 minuten (= set a timer for 20 minutes)", "label": "set_timer", "lang": "de"},
    {"id": "syn-29", "text": "met un minuteur de 10 minutes (= set a 10 minute timer)", "label": "set_timer", "lang": "fr"},
    {"id": "syn-30", "text": "pon un temporizador de 30 minutos (= set a 30 minute timer)", "label": "set_timer", "lang": "es"},
    {"id": "syn-31", "text": "in 10 minutes remind me to stir soup", "label": "create_task", "lang": "en"},  # off-label (task tie-breaker Clause 2.8)
    {"id": "syn-32", "text": "\t  \n", "label": "set_timer", "lang": "en"},  # blank
    {"id": "syn-33", "text": "timer 25 minutes for baking", "label": "set_timer", "lang": "en"},
    {"id": "syn-34", "text": "start a 5 minute timer", "label": "set_timer", "lang": "en"},
    {"id": "syn-35", "text": "set timer for 1 hour", "label": "set_timer", "lang": "en"},
    {"id": "syn-36", "text": "Start a 5 minute timer", "label": "set_timer", "lang": "en"},  # near-dup of syn-34
    {"id": "syn-37", "text": "remind me to check oven in 20 minutes", "label": "create_task", "lang": "en"},  # off-label (task)
    {"id": "syn-38", "text": "set a timer for 8 minutes for eggs", "label": "set_timer", "lang": "en"},
    {"id": "syn-39", "text": "countdown 12 minutes", "label": "set_timer", "lang": "en"},
    {"id": "syn-40", "text": "what's the weather like tomorrow", "label": "answer_question", "lang": "en"},  # off-label (answer_question)
    {"id": "syn-41", "text": "set a 30 minute timer", "label": "set_timer", "lang": "en"},
    {"id": "syn-42", "text": "", "label": "set_timer", "lang": "en"},  # blank
    {"id": "syn-43", "text": "timer for 15 minutes", "label": "set_timer", "lang": "en"},
    {"id": "syn-44", "text": "start a countdown of 3 minutes", "label": "set_timer", "lang": "en"},
]


def filter_generations(candidates, allowed_labels):
    """
    Deterministic gate that drops off-label, blank, and duplicate rows.
    """
    seen = set()
    kept_rows = []
    dropped_rows = []
    tally = {
        "kept": 0,
        "dropped_off_label": 0,
        "dropped_blank": 0,
        "dropped_dup": 0,
    }
    per_class_kept = {}

    for row in candidates:
        label = row["label"]
        raw_text = row["text"]
        normalized_text = raw_text.strip()

        # 1. Off-label check
        if label not in allowed_labels:
            tally["dropped_off_label"] += 1
            dropped_rows.append({**row, "verdict": "dropped_off_label"})
            continue

        # 2. Blank check
        if not normalized_text:
            tally["dropped_blank"] += 1
            dropped_rows.append({**row, "verdict": "dropped_blank"})
            continue

        # 3. Duplicate check (case-insensitive)
        dedup_key = (normalized_text.lower(), label)
        if dedup_key in seen:
            tally["dropped_dup"] += 1
            dropped_rows.append({**row, "verdict": "dropped_dup"})
            continue

        # 4. Pass gate
        seen.add(dedup_key)
        tally["kept"] += 1
        per_class_kept[label] = per_class_kept.get(label, 0) + 1
        kept_rows.append({**row, "verdict": "kept"})

    return kept_rows, dropped_rows, tally, per_class_kept


def main():
    day4_dir = os.path.dirname(os.path.abspath(__file__))
    candidates_csv = os.path.join(day4_dir, "synthetic_candidates.csv")
    survivors_csv = os.path.join(day4_dir, "filtered_survivors.csv")

    # Save raw candidates
    with open(candidates_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "text", "label", "lang"])
        writer.writeheader()
        for r in CANDIDATE_ROWS:
            writer.writerow(r)

    # Run filter
    kept_rows, dropped_rows, tally, per_class_kept = filter_generations(CANDIDATE_ROWS, ALLOWED_LABELS)

    # Save filtered survivors
    with open(survivors_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "text", "label", "lang", "verdict"])
        writer.writeheader()
        for r in kept_rows:
            writer.writerow(r)

    print("=== Day 4 Synthetic Generation & Filtering Scoreboard ===")
    print(f"Total Candidate Rows Generated: {len(CANDIDATE_ROWS)}")
    print(f"Kept Survivors: {tally['kept']}")
    print(f"Dropped Off-Label: {tally['dropped_off_label']}")
    print(f"Dropped Blank: {tally['dropped_blank']}")
    print(f"Dropped Duplicates: {tally['dropped_dup']}")
    print("\nPer-Class Kept Counts:")
    for label, count in sorted(per_class_kept.items()):
        print(f"  - {label}: {count} rows")


if __name__ == "__main__":
    main()
