"""
Day 3 — Cohen's Kappa & Inter-Annotator Agreement Measurement
Build Your Own AI Router (Data: Real, Sanitized, Synthetic)

Computes observed agreement (po), expected chance agreement (pe),
and Cohen's kappa (κ) over the 20-row double-labelled slice using standard library.
"""

import os
import csv


def get_kappa_band(kappa: float) -> str:
    """Returns the plain-English agreement band for a given Cohen's kappa value."""
    if kappa < 0.20:
        return "Poor (barely better than chance)"
    elif kappa < 0.40:
        return "Fair (weak guideline, needs work)"
    elif kappa < 0.60:
        return "Moderate (usable but shaky)"
    elif kappa < 0.80:
        return "Substantial (solid, guideline mostly works)"
    else:
        return "Near-perfect (trustworthy benchmark quality)"


def cohen_kappa(a: list, b: list):
    """
    Computes Cohen's Kappa for two list of labels.
    
    Returns:
        agree_count (int): Number of exact matches
        po (float): Observed agreement ratio (agree_count / n)
        pe (float): Chance expected agreement sum(p_a(L) * p_b(L))
        kappa (float): Cohen's kappa (po - pe) / (1 - pe)
    """
    n = len(a)
    if n == 0 or n != len(b):
        raise ValueError("Input lists must be non-empty and of equal length.")

    # 1. Observed agreement po
    agree_count = sum(1 for i in range(n) if a[i] == b[i])
    po = agree_count / n

    # 2. Expected chance agreement pe
    all_labels = set(a) | set(b)
    pe = 0.0
    for label in all_labels:
        p_a = a.count(label) / n
        p_b = b.count(label) / n
        pe += p_a * p_b

    # 3. Cohen's Kappa
    if pe == 1.0:
        kappa = 1.0
    else:
        kappa = (po - pe) / (1.0 - pe)

    return agree_count, po, pe, kappa


def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    slice_path = os.path.join(current_dir, "double_labelled_slice.csv")

    if not os.path.exists(slice_path):
        print(f"[ERROR] Could not find {slice_path}")
        return

    rows = []
    with open(slice_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    labels_a = [r["pass1_label"] for r in rows]
    labels_b = [r["pass2_label"] for r in rows]

    agree_count, po, pe, kappa = cohen_kappa(labels_a, labels_b)
    band = get_kappa_band(kappa)

    print("=" * 65)
    print("      DAY 3: INTER-ANNOTATOR AGREEMENT REPORT")
    print("=" * 65)
    print(f" Total Rows Evaluated   : {len(rows)}")
    print(f" Exact Matches          : {agree_count} / {len(rows)}")
    print(f" Observed Agreement (po): {po:.3f} ({po * 100:.1f}%)")
    print(f" Chance Agreement   (pe): {pe:.3f} ({pe * 100:.1f}%)")
    print(f" Cohen's Kappa      (κ) : {kappa:.3f}")
    print(f" Agreement Band         : {band}")
    print("-" * 65)

    disagreements = [r for r in rows if r["pass1_label"] != r["pass2_label"]]
    print(f"\nDisagreements Found ({len(disagreements)} rows):")
    for r in disagreements:
        print(f" Row ID {r['id']}: \"{r['sanitised_text']}\"")
        print(f"   - Pass 1 (Annotator A): {r['pass1_label']}")
        print(f"   - Pass 2 (Annotator B): {r['pass2_label']}")

    print("=" * 65)


if __name__ == "__main__":
    main()
