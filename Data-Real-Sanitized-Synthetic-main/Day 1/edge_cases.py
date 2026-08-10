"""
v7 Day 1 — Edge Case Demonstrations (Naive Miss vs Naive Over-Redact)
===================================================================
Surface two edge cases where naive scrubbing fails:
1. NAIVE MISS: Unconventional delimiter phone formatting bypasses basic regex.
2. NAIVE OVER-REDACT: Product code SKU accidentally matches naive IBAN prefix.
"""

import re
from scrubber import scrub, verify

EDGE_CASE_1_SENTENCE = "Please call +41 (0)79 555-12.34 to confirm the reservation."
EDGE_CASE_1_WHY = (
    "Why Naive Misses: Standard naive regex looking for plain whitespace delimiters "
    "('+41 79 555 12 34') fails to match the internal zero '(0)' and mixed dot/dash "
    "separators, allowing raw phone PII to leak."
)

EDGE_CASE_2_SENTENCE = "Order product model CH9300 from catalog page 8001 today."
EDGE_CASE_2_WHY = (
    "Why Naive Over-Redacts: A naive IBAN pattern matching any country code 'CH' "
    "followed by numbers ('CH9300') mistakes a harmless product SKU for a Swiss IBAN, "
    "destroying safe domain vocabulary."
)


def run_edge_case_demo():
    print("=" * 70)
    print("  Day 1 — Edge Case Analysis: Naive Scrubber Pitfalls")
    print("=" * 70)

    print("\n[Edge Case 1: Naive Scrub MISSES PII]")
    print(f"  Sentence: \"{EDGE_CASE_1_SENTENCE}\"")
    print(f"  {EDGE_CASE_1_WHY}")
    scrubbed_1, n1 = scrub(EDGE_CASE_1_SENTENCE)
    v1 = verify(scrubbed_1)
    print(f"  Robust Scrub Output: \"{scrubbed_1}\"")
    print(f"  Redactions: {n1} | Verify Clean: {v1}")

    print("\n[Edge Case 2: Naive Scrub OVER-REDACTS Safe Word]")
    print(f"  Sentence: \"{EDGE_CASE_2_SENTENCE}\"")
    print(f"  {EDGE_CASE_2_WHY}")
    scrubbed_2, n2 = scrub(EDGE_CASE_2_SENTENCE)
    v2 = verify(scrubbed_2)
    print(f"  Robust Scrub Output: \"{scrubbed_2}\"")
    print(f"  Redactions: {n2} | Verify Clean: {v2}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    run_edge_case_demo()
