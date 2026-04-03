"""
train.py — Master Training Script
Run this once to train and save the model.

Usage:
    python train.py
    python train.py --samples 500   # more training data
    python train.py --cv             # also run cross-validation
"""

import argparse
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from generate_data import generate_full_dataset
from model import GrievanceClassifier
from evaluate import (
    print_confusion_matrix,
    print_metrics,
    feature_importance_report,
    generate_evaluation_report,
)


def main():
    parser = argparse.ArgumentParser(description="Train Grievance Severity Classifier")
    parser.add_argument("--samples", type=int, default=300, help="Samples per class (default 300)")
    parser.add_argument("--cv", action="store_true", help="Run 5-fold cross-validation")
    args = parser.parse_args()

    print("=" * 55)
    print("  GRIEVANCE SEVERITY CLASSIFIER — TRAINING")
    print("=" * 55)
    print(f"  Samples per class : {args.samples}")
    print(f"  Total samples     : {args.samples * 4}")
    print(f"  Classes           : low, medium, high, critical")
    print(f"  Text branch       : TF-IDF + SVD (BERT-style, 128-dim)")
    print(f"  Image branch      : CNN features (8-dim)")
    print(f"  Fusion            : Concatenation (141-dim)")
    print("=" * 55)

    # ── 1. Generate Data ──────────────────────────────────────────
    print("\n[1/4] Generating synthetic dataset...")
    df, img_feats = generate_full_dataset(n_per_class=args.samples)
    df.to_csv("data/grievances.csv", index=False)
    import numpy as np
    np.save("data/image_features.npy", img_feats)
    print(f"  Saved {len(df)} samples to data/")

    # ── 2. Train ──────────────────────────────────────────────────
    print("\n[2/4] Training multimodal classifier...")
    clf = GrievanceClassifier()
    results = clf.fit(df["text"].tolist(), img_feats, df["label"].tolist())

    # ── 3. Evaluate ───────────────────────────────────────────────
    print("\n[3/4] Evaluation Results")
    print_confusion_matrix(results["confusion_matrix"])
    print_metrics(
        results["classification_report"],
        results["test_accuracy"],
        results["test_f1_macro"]
    )
    generate_evaluation_report(results, "models/evaluation_report.json")

    # ── 4. Save Model ─────────────────────────────────────────────
    print("\n[4/4] Saving model...")
    clf.save("models")

    # ── Optional: Cross-Validation ────────────────────────────────
    if args.cv:
        print("\n[CV] Running 5-fold cross-validation (this takes a few minutes)...")
        from evaluate import cross_validate
        cv_results = cross_validate(
            GrievanceClassifier,
            df["text"].tolist(), img_feats, df["label"].tolist(),
            n_splits=5
        )
        results.update(cv_results)
        with open("models/evaluation_report.json", "w") as f:
            json.dump(results, f, indent=2)

    # ── Sample Predictions ────────────────────────────────────────
    print("\n" + "=" * 55)
    print("SAMPLE PREDICTIONS")
    print("=" * 55)

    test_cases = [
        ("Paint is peeling on the boundary wall near Aminabad.", img_feats[0]),
        ("Street lights on Gomti Nagar road have been off for 3 days.", img_feats[350]),
        ("Exposed live electrical wires are hanging near Hazratganj footpath.", img_feats[700]),
        ("Building collapse near Chowk! People trapped under debris. URGENT!", img_feats[950]),
    ]

    for text, img_f in test_cases:
        pred = clf.predict_single(text, img_f)
        level_icons = {"low": "🟢", "medium": "🟡", "high": "🟠", "critical": "🔴"}
        icon = level_icons.get(pred["severity"], "⚪")
        print(f"\n  {icon} [{pred['severity'].upper():8s}] {pred['confidence']}% confidence")
        print(f"     \"{text[:70]}\"")

    print("\n" + "=" * 55)
    print("Training complete!")
    print("Start API server: uvicorn api.app:app --port 8000")
    print("=" * 55)


if __name__ == "__main__":
    Path("data").mkdir(exist_ok=True)
    Path("models").mkdir(exist_ok=True)
    main()