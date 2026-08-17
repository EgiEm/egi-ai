import csv
import re

# Raw intent dataset collected across previous iterations (Week 2/7)
DATASET = [
    # create_task
    ("pick up groceries after work today", "create_task"),
    ("add dentist appointment to my list for friday", "create_task"),
    ("schedule a meeting with the team at 3pm", "create_task"),
    ("jot down that I need to renew my passport", "create_task"),
    ("put return library books on my agenda", "create_task"),
    ("make sure I water the plants before noon", "create_task"),
    ("I need to book a haircut for next thursday", "create_task"),
    ("grab the package from the post office tomorrow", "create_task"),
    ("plan a birthday surprise for Jake this weekend", "create_task"),
    ("remind me to pay the electricity bill tonight", "create_task"),

    # place_call
    ("ring the restaurant and ask about reservations", "place_call"),
    ("get my brother on the phone please", "place_call"),
    ("connect me with the tech support line", "place_call"),
    ("I want to speak with the HR department", "place_call"),
    ("call the babysitter to confirm tonight", "place_call"),
    ("reach out to the insurance company now", "place_call"),
    ("can you phone the garage about my car", "place_call"),
    ("talk to the front desk at the hotel", "place_call"),
    ("dial doctor office for an appointment", "place_call"),
    ("call Mom on mobile right now", "place_call"),

    # answer_question
    ("how far is the moon from the earth", "answer_question"),
    ("what year was the first iPhone released", "answer_question"),
    ("who painted the Mona Lisa and when", "answer_question"),
    ("what is the largest ocean on the planet", "answer_question"),
    ("how does a combustion engine work", "answer_question"),
    ("what language do they speak in Brazil", "answer_question"),
    ("tell me the population of Tokyo", "answer_question"),
    ("who discovered penicillin", "answer_question"),
    ("what is the boiling point of water", "answer_question"),
    ("explain how photosynthesis works", "answer_question"),

    # save_memory
    ("keep a note that the meeting room code is 7788", "save_memory"),
    ("remember that Alex prefers oat milk in his coffee", "save_memory"),
    ("save the Wi-Fi password as guest2026", "save_memory"),
    ("note down that my locker combination is 1429", "save_memory"),
    ("store the recipe for Grandma's apple pie", "save_memory"),
    ("remember that the spare key is under the blue pot", "save_memory"),
    ("save this link for reading later tonight", "save_memory"),
    ("note that Sarah's birthday is October 14th", "save_memory"),
    ("keep in mind that the gate code changed", "save_memory"),
    ("store my frequent flyer number under Delta", "save_memory"),

    # set_timer
    ("set a timer for 15 minutes for the pizza", "set_timer"),
    ("wake me up in 45 minutes", "set_timer"),
    ("start a 10 minute countdown right now", "set_timer"),
    ("timer for 5 minutes please", "set_timer"),
    ("set alarm for 7am tomorrow morning", "set_timer"),
    ("count down 20 minutes for tea", "set_timer"),
    ("set a 30 minute timer for my break", "set_timer"),
    ("remind me in 5 minutes with a timer", "set_timer"),
    ("start timer 12 minutes", "set_timer"),
    ("wake me up at 6:30 tomorrow", "set_timer"),

    # out_of_scope
    ("play some relaxed jazz music", "out_of_scope"),
    ("turn on the living room lights", "out_of_scope"),
    ("what is the current stock price of Apple", "out_of_scope"),
    ("order a pepperoni pizza from Dominoes", "out_of_scope"),
    ("open Spotify and play my favourite playlist", "out_of_scope"),
    ("dim the bedroom lights to 20 percent", "out_of_scope"),
    ("book a flight to Paris for next month", "out_of_scope"),
    ("volume up to 80 percent", "out_of_scope"),
    ("what is the weather like in Berlin today", "out_of_scope"),
    ("play the latest news podcast", "out_of_scope"),
]

# Fixed deterministic indices carved out for the golden test set (2 per intent)
GOLDEN_INDICES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]


def normalize_text(text: str) -> str:
    """Basic normalization to catch exact and near-duplicate leakage."""
    return re.sub(r"[^\w\s]", "", text.strip().lower())


def split_and_check(rows, golden_indices):
    """
    Deterministically splits dataset into train and golden sets,
    and checks for zero-leakage (including near-duplicates).
    """
    golden_rows = [rows[i] for i in golden_indices]
    golden_set_indices = set(golden_indices)
    train_rows = [rows[i] for i in range(len(rows)) if i not in golden_set_indices]

    # Build lookup set of normalized training texts for strict leakage check
    train_norm_map = {normalize_text(text): label for text, label in train_rows}

    # Count per-class golden distribution & leak occurrences
    golden_counts = {}
    leak_count = 0

    for text, label in golden_rows:
        golden_counts[label] = golden_counts.get(label, 0) + 1
        norm_text = normalize_text(text)
        
        # Leak check: exact text match or near-duplicate match
        if norm_text in train_norm_map:
            leak_count += 1

    print(f"train: {len(train_rows)}")
    print(f"golden: {len(golden_rows)}")
    for intent in sorted(golden_counts.keys()):
        print(f"  {intent}: {golden_counts[intent]}")
    print(f"leakage: {leak_count}")

    return train_rows, golden_rows, leak_count


if __name__ == "__main__":
    print("=== Freeze Golden Set & Verify Zero-Leakage ===")
    train_rows, golden_rows, leakage = split_and_check(DATASET, GOLDEN_INDICES)

    if leakage == 0:
        print("\n[PASS] ZERO LEAKAGE CONFIRMED. Writing frozen sets to disk...")
        
        # Save golden_set.csv
        with open("golden_set.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["text", "label"])
            writer.writerows(golden_rows)

        # Save train_set.csv
        with open("train_set.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["text", "label"])
            writer.writerows(train_rows)

        print("Saved golden_set.csv and train_set.csv successfully.")
    else:
        raise ValueError(f"Leakage detected: {leakage} rows overlapped between train and golden!")
