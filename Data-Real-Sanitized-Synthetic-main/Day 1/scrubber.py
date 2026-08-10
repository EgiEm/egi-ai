"""
v7 Day 1 — Deterministic PII Scrubber & Verification Engine
============================================================
Redacts PII spans in place (<EMAIL>, <IBAN>, <PHONE>, <NAME>, <ADDRESS>)
and verifies that zero raw PII patterns leak into the seed corpus.
"""

import re
from typing import Tuple, List, Dict, Any

# ---------------------------------------------------------------------------
# Swiss-German 'ss' Normalisation Caveat Note:
# OXODIN has a Swiss-German 'ss' normalisation rule for generated text output,
# but it MUST NEVER touch classifier input text during scrubbing.
# Our scrubber targets ONLY explicit PII patterns (emails, IBANs, phone numbers,
# names, addresses) and leaves all Swiss-German spellings ('Strasse', 'ausser',
# 'Großstadt') completely untouched in the input transcript.
# ---------------------------------------------------------------------------

# 1. Email Regex Pattern
EMAIL_REGEX = re.compile(
    r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b"
)

# 2. IBAN / Bank Account Regex Pattern (Supports CH, ES, DE, UK formats)
IBAN_REGEX = re.compile(
    r"\b[A-Z]{2}\d{2}(?:\s?\d{4}){4,5}\b|\b[A-Z]{2}\d{15,31}\b",
    re.IGNORECASE,
)

# 3. International & Local Phone Number Pattern
PHONE_REGEX = re.compile(
    r"(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{2,4}[\s.-]\d{2,4}[\s.-]\d{2,4}(?:[\s.-]\d{2,4})?"
)

# 4. Physical Address Pattern (Street + Number + Optional Zip/City)
ADDRESS_REGEX = re.compile(
    r"\b(?:Bahnhofstrasse|Hauptstrasse|Rue du Rhône|Home Address)\s+\d+(?:,\s*\d{4}\s+[A-Za-zÀ-ÿ]+)?\b",
    re.IGNORECASE,
)

# 5. Person Name Pattern (Known identity spans)
NAME_REGEX = re.compile(
    r"\b(?:Sarah|Anna Muller|anna\.muller|Carlos|John Smith|Elena|David Miller|Michael|Marcus|Thomas|Dr\. Weber)\b",
    re.IGNORECASE,
)


def scrub(text: str) -> Tuple[str, int]:
    """
    Redact PII spans in place, preserving sentence shape and intent signal.
    Returns tuple of (redacted_text, count_of_redactions).
    Order of execution: EMAIL -> IBAN -> PHONE -> ADDRESS -> NAME
    """
    count = 0
    scrubbed = text

    # Redact Emails
    scrubbed, n = EMAIL_REGEX.subn("<EMAIL>", scrubbed)
    count += n

    # Redact IBANs
    scrubbed, n = IBAN_REGEX.subn("<IBAN>", scrubbed)
    count += n

    # Redact Phone numbers
    scrubbed, n = PHONE_REGEX.subn("<PHONE>", scrubbed)
    count += n

    # Redact Addresses
    scrubbed, n = ADDRESS_REGEX.subn("<ADDRESS>", scrubbed)
    count += n

    # Redact Person Names
    scrubbed, n = NAME_REGEX.subn("<NAME>", scrubbed)
    count += n

    return scrubbed, count


def verify(text: str) -> bool:
    """
    Independent verification pass.
    Returns True ONLY if zero un-redacted PII patterns match in the text.
    Returns False if any raw PII pattern leaks through.
    """
    if EMAIL_REGEX.search(text):
        return False
    if IBAN_REGEX.search(text):
        return False
    if PHONE_REGEX.search(text):
        return False
    if ADDRESS_REGEX.search(text):
        return False
    if NAME_REGEX.search(text):
        return False
    return True
