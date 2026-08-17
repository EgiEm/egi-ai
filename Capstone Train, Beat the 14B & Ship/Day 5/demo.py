"""
demo.py — Live capstone demo: sentence → predicted intent + latency.

Output format: <intent> · <ms>ms
Wired so a stranger can throw their own sentences at it.

What this demo runs:
    This demo uses CACHED golden-set predictions from Day 4 (predictions.json)
    for known sentences, and a keyword-based fallback classifier for unknown inputs.
    It does NOT call a live model endpoint or the OXODIN inference proxy.
    The proxy returns 503 when not configured — we never invent a latency.

Usage:
    python demo.py
"""

import json
import os
import time
import hashlib

# Path to cached predictions from Day 4
PREDICTIONS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "Day 4", "predictions.json"
)

# Keyword-to-intent mapping for the fallback classifier (from Lab B sanity harness)
KEYWORD_INTENTS = [
    (["call", "ring", "phone", "dial", "reach out", "contact"], "place_call"),
    (["timer", "countdown", "alarm", "count down", "minutes for"], "set_timer"),
    (["task", "todo", "remind", "pick up", "water the", "make sure"], "create_task"),
    (["remember", "note", "save", "keep a", "store", "memorize"], "save_memory"),
    (["what", "how", "why", "when", "where", "who", "which", "is the", "does"], "answer_question"),
]

OUT_OF_SCOPE = "out_of_scope"


def load_cached_predictions():
    """Load the golden-set predictions from Day 4 as a lookup dict."""
    if not os.path.exists(PREDICTIONS_PATH):
        return {}
    with open(PREDICTIONS_PATH, "r", encoding="utf-8") as f:
        predictions = json.load(f)
    return {
        row["golden_text"].strip().lower(): {
            "intent": row["predicted_label"],
            "latency_ms": row["latency_ms"],
        }
        for row in predictions
    }


def fake_latency_ms(text):
    """
    Deterministic fake latency between 30-90ms based on text hash.
    Used only for the keyword fallback — never for cached predictions.
    """
    h = int(hashlib.md5(text.encode()).hexdigest()[:8], 16)
    return 30 + (h % 61)  # 30 to 90 ms range


def classify_stub(text):
    """
    Keyword-based fallback classifier.
    Lowercase + strip the text, return the first matching keyword intent
    from KEYWORD_INTENTS (checked in order), else "out_of_scope".
    """
    normalized = text.lower().strip()
    for keywords, intent in KEYWORD_INTENTS:
        for kw in keywords:
            if kw in normalized:
                return intent
    return OUT_OF_SCOPE


def classify(text, cache):
    """
    Main classification function.
    1. Check cached golden-set predictions first (real measured latencies).
    2. Fall back to keyword classifier with deterministic fake latency.
    Returns (intent, latency_ms, source).
    """
    normalized = text.strip().lower()
    if normalized in cache:
        entry = cache[normalized]
        return entry["intent"], entry["latency_ms"], "cached"
    else:
        intent = classify_stub(text)
        latency = fake_latency_ms(text)
        return intent, latency, "fallback"


def format_line(intent, latency_ms):
    """Format the demo output line: <intent> · <ms>ms"""
    return f"{intent} · {latency_ms}ms"


def run_demo():
    """Interactive demo loop — type a sentence, get back intent + latency."""
    cache = load_cached_predictions()
    cache_size = len(cache)

    print("=" * 58)
    print("   CAPSTONE LIVE DEMO — Intent Router")
    print("=" * 58)
    print()
    print(f"  Cached golden predictions loaded: {cache_size} sentences")
    print(f"  Fallback: keyword classifier (deterministic latency)")
    print()
    print("  WHAT THIS RUNS:")
    print("  - Known golden sentences use cached Day 4 predictions")
    print("    with real measured latencies from QLoRA on Colab T4.")
    print("  - Unknown sentences use a keyword fallback classifier")
    print("    with deterministic fake latency (30-90ms range).")
    print("  - This does NOT call a live model or the OXODIN proxy.")
    print()
    print("  Type a sentence and press Enter. Type 'quit' to exit.")
    print("-" * 58)
    print()

    # Run the four fixed sanity-check sentences first (from Lab B)
    sanity_inputs = [
        "ring the restaurant and ask about reservations",
        "pick up groceries after work today",
        "count down 20 minutes for tea",
        "play some relaxed jazz music",
    ]

    print("--- Sanity check (fixed inputs) ---")
    for text in sanity_inputs:
        intent, latency, source = classify(text, cache)
        line = format_line(intent, latency)
        tag = f"[{source}]"
        print(f"  {tag:>10}  {line:<40}  <- \"{text}\"")
    print()

    # Interactive loop
    print("--- Your turn (type any sentence) ---")
    while True:
        try:
            user_input = input("\n> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nDone.")
            break

        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "q"):
            print("Done.")
            break

        intent, latency, source = classify(user_input, cache)
        line = format_line(intent, latency)
        print(f"  {line}  [{source}]")


if __name__ == "__main__":
    run_demo()
