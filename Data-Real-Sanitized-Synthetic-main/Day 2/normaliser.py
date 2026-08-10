import string
from typing import List, Tuple, Dict, Set

def normalise(text: str) -> str:
    """
    Reduces text to its canonical string representation:
    1. Collapse runs of whitespace via split() and join().
    2. Lowercase all characters.
    3. Strip outer punctuation and trailing/leading whitespace.
    """
    if not text:
        return ""
    
    # Step 1: Collapse multiple spaces
    collapsed = " ".join(text.split())
    
    # Step 2: Lowercase
    lowered = collapsed.lower()
    
    # Step 3: Strip leading and trailing punctuation & spaces
    canonical = lowered.strip(string.punctuation + " ")
    
    return canonical

def near_dedup(rows: List[Dict[str, str]]) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
    """
    Deduplicates a dataset based on the canonical normalised key.
    Returns a tuple of (kept_rows, dropped_near_duplicates).
    """
    seen_keys: Set[str] = set()
    kept: List[Dict[str, str]] = []
    dropped: List[Dict[str, str]] = []
    
    for row in rows:
        raw_text = row.get("sanitised_text", "")
        norm_key = normalise(raw_text)
        
        if norm_key in seen_keys:
            dropped.append(row)
        else:
            seen_keys.add(norm_key)
            row["normalised_key"] = norm_key
            kept.append(row)
            
    return kept, dropped
