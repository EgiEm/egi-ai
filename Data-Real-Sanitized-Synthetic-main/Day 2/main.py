import os
import csv
from collections import Counter
from normaliser import normalise, near_dedup

# Intent Mapping & Re-labelling rules based strictly on guideline.md
# Map Day 1 intents to the 6 core Day 2 intents:
# create_task, place_call, answer_question, save_memory, set_timer, out_of_scope

def relabel_row(raw_text: str, original_intent: str) -> tuple[str, bool, str]:
    """
    Applies guideline clauses to re-label utterances into the 6 core intents.
    Returns: (new_intent, is_ambiguous, clause_ref)
    """
    text_lower = raw_text.lower()
    
    # Boundary / Ambiguous check
    if "remind me to call" in text_lower:
        return "create_task", False, "Clause 2.1 Tie-Breaker (Task vs Call)"
    if "in 10 minutes remind me" in text_lower or "in 10 mins remind" in text_lower:
        return "create_task", False, "Clause 2.5 Tie-Breaker (Task vs Timer)"
    if "text mom" in text_lower or "send a text message" in text_lower:
        return "out_of_scope", False, "Clause 2.6 Tie-Breaker (Unsupported channel)"
    
    # Legacy intent remapping per guideline
    if original_intent in ["create_task", "place_call", "answer_question", "save_memory", "set_timer"]:
        # Handle specific edge cases in legacy intents
        if original_intent == "place_call" and ("schedule" in text_lower or "remind" in text_lower):
            return "create_task", False, "Clause 2.1 (Scheduled Call -> Task)"
        return original_intent, False, f"Direct match ({original_intent})"
    
    if original_intent in ["deliver_message", "finance_summary"]:
        # Financial tasks & external messaging are outside the 6 core voice intents
        return "out_of_scope", False, f"Clause 2.6 ({original_intent} -> out_of_scope)"
    
    # Flag as ambiguous if unknown
    return "out_of_scope", True, "Flagged for Day 3 Adjudication"


def run_pipeline():
    day1_csv_path = os.path.join("..", "Day 1", "sanitised_sample.csv")
    output_gold_csv = "clean_gold.csv"
    output_ambiguous_csv = "ambiguous_rows.csv"
    
    raw_rows = []
    
    # 1. Load Day 1 Sanitised Dataset
    if os.path.exists(day1_csv_path):
        with open(day1_csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_rows.append({
                    "id": row["id"],
                    "sanitised_text": row["sanitised_text"],
                    "original_intent": row["intent"],
                    "language": row.get("language", "en")
                })
    
    # 2. Inject text-drift variants & boundary cases to simulate raw transcript noise
    drift_variants = [
        {"id": "31", "sanitised_text": "Call <NAME> at <PHONE>.", "original_intent": "place_call", "language": "en"},
        {"id": "32", "sanitised_text": "call <NAME> at <PHONE>!!", "original_intent": "place_call", "language": "en"},
        {"id": "33", "sanitised_text": "CALL <NAME> AT <PHONE>", "original_intent": "place_call", "language": "en"},
        {"id": "34", "sanitised_text": "remind me to call the dentist", "original_intent": "place_call", "language": "en"},  # Boundary 1
        {"id": "35", "sanitised_text": "text mom I'm running late", "original_intent": "deliver_message", "language": "en"}, # Boundary 2
        {"id": "36", "sanitised_text": "in 10 minutes remind me to stir the soup", "original_intent": "set_timer", "language": "en"}, # Boundary 3
        {"id": "37", "sanitised_text": "log that the garage entry code is 4492", "original_intent": "save_memory", "language": "en"}, # Boundary 4
        {"id": "38", "sanitised_text": "call doctor Office on +<PHONE>567 to reschedule", "original_intent": "place_call", "language": "de"}, # Boundary 5
        {"id": "39", "sanitised_text": "remind me to call <NAME> at <EMAIL> tomorrow.", "original_intent": "create_task", "language": "en"}, # Drift of row 9
        {"id": "40", "sanitised_text": "what is the current temperature in zurich?", "original_intent": "answer_question", "language": "en"}, # Drift of row 30
        # Genuinely ambiguous row for Day 3 adjudication
        {"id": "41", "sanitised_text": "maybe schedule or call <NAME> depending on status", "original_intent": "ambiguous", "language": "en"},
    ]
    
    all_raw = raw_rows + drift_variants
    
    processed_rows = []
    ambiguous_rows = []
    
    # 3. Apply Labelling Discipline (Re-labeling strictly by guideline clauses)
    for item in all_raw:
        new_intent, is_ambiguous, clause_ref = relabel_row(item["sanitised_text"], item["original_intent"])
        
        row_dict = {
            "id": item["id"],
            "sanitised_text": item["sanitised_text"],
            "guideline_label": new_intent,
            "clause_applied": clause_ref,
            "language": item["language"]
        }
        
        if is_ambiguous or item["original_intent"] == "ambiguous":
            ambiguous_rows.append(row_dict)
        else:
            processed_rows.append(row_dict)
            
    # 4. Run Normalisation + Near-Deduplication Funnel
    kept_rows, dropped_rows = near_dedup(processed_rows)
    
    # 5. Export Clean Gold CSV
    fieldnames = ["id", "sanitised_text", "normalised_key", "guideline_label", "clause_applied", "language"]
    with open(output_gold_csv, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in kept_rows:
            writer.writerow({
                "id": r["id"],
                "sanitised_text": r["sanitised_text"],
                "normalised_key": r["normalised_key"],
                "guideline_label": r["guideline_label"],
                "clause_applied": r["clause_applied"],
                "language": r["language"]
            })

    # 6. Export Ambiguous Rows CSV
    with open(output_ambiguous_csv, mode="w", encoding="utf-8", newline="") as f:
        amb_fieldnames = ["id", "sanitised_text", "guideline_label", "clause_applied", "language"]
        writer = csv.DictWriter(f, fieldnames=amb_fieldnames)
        writer.writeheader()
        for r in ambiguous_rows:
            writer.writerow(r)
            
    # 7. Calculate & Print Audit Statistics
    per_class_counts = Counter(r["guideline_label"] for r in kept_rows)
    
    print("=" * 65)
    print(" DAY 2 · LABELLING DISCIPLINE & DEDUP FUNNEL AUDIT REPORT")
    print("=" * 65)
    print(f"Total Raw Rows Processed    : {len(all_raw)}")
    print(f"Near-Duplicates Dropped     : {len(dropped_rows)}")
    print(f"Flagged Ambiguous Rows      : {len(ambiguous_rows)}")
    print(f"Clean Labelled Gold Rows    : {len(kept_rows)}")
    print("-" * 65)
    print("Per-Class Counts (Clean Gold Corpus):")
    for intent, count in sorted(per_class_counts.items()):
        print(f"  - {intent:<18}: {count}")
    print("-" * 65)
    print(f"[*] Saved clean gold dataset to: {output_gold_csv}")
    print(f"[*] Saved ambiguous cases to  : {output_ambiguous_csv}")
    print("=" * 65)

if __name__ == "__main__":
    run_pipeline()
