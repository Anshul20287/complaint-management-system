"""
Model Evaluation Module
Generates: confusion matrix, classification report, F1 per class, feature importance
"""

import numpy as np
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))


LABEL_NAMES = ["low", "medium", "high", "critical"]
SEVERITY_COLORS = {
    "low": "#639922", "medium": "#BA7517",
    "high": "#D85A30", "critical": "#E24B4A"
}


def print_confusion_matrix(cm: list, label_names: list = LABEL_NAMES):
    """Pretty print confusion matrix to console."""
    width = 10
    print("\n" + "=" * 55)
    print("CONFUSION MATRIX")
    print("=" * 55)
    header = "Actual \\ Pred"
    print(f"{header:<16}", end="")
    for name in label_names:
        print(f"{name:>{width}}", end="")
    print()
    print("-" * (16 + width * len(label_names)))
    for i, row in enumerate(cm):
        print(f"{label_names[i]:<16}", end="")
        for j, val in enumerate(row):
            marker = "**" if i == j else "  "
            print(f"{marker}{val:>{width-2}}", end="")
        print()
    print("=" * 55)


def print_metrics(report: dict, test_acc: float, test_f1: float):
    """Print per-class and overall metrics."""
    print("\n" + "=" * 55)
    print("CLASSIFICATION REPORT")
    print("=" * 55)
    print(f"{'Class':<12} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'Support':>10}")
    print("-" * 55)
    for label in LABEL_NAMES:
        m = report[label]
        print(f"{label:<12} {m['precision']:>10.4f} {m['recall']:>10.4f} {m['f1-score']:>10.4f} {int(m['support']):>10}")
    print("-" * 55)
    print(f"{'Accuracy':<12} {'':>10} {'':>10} {test_acc:>10.4f}")
    print(f"{'Macro F1':<12} {'':>10} {'':>10} {test_f1:>10.4f}")
    print("=" * 55)


def analyze_errors(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Analyze common misclassification patterns."""
    errors = {}
    for true_i, pred_i in zip(y_true, y_pred):
        if true_i != pred_i:
            key = f"{LABEL_NAMES[true_i]} → {LABEL_NAMES[pred_i]}"
            errors[key] = errors.get(key, 0) + 1
    return dict(sorted(errors.items(), key=lambda x: -x[1]))


def cross_validate(clf_class, texts: list, img_features: np.ndarray,
                   labels: list, n_splits: int = 5) -> dict:
    """
    5-fold stratified cross-validation.
    Returns mean ± std of accuracy and F1.
    """
    from sklearn.model_selection import StratifiedKFold
    from generate_data import generate_full_dataset

    LABEL_MAP = {l: i for i, l in enumerate(LABEL_NAMES)}
    y = np.array([LABEL_MAP[l] for l in labels])

    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    acc_scores, f1_scores = [], []

    print(f"\n{n_splits}-Fold Cross Validation")
    print("─" * 40)

    for fold, (train_idx, val_idx) in enumerate(skf.split(np.zeros(len(y)), y)):
        texts_arr = np.array(texts)
        t_texts = texts_arr[train_idx].tolist()
        v_texts = texts_arr[val_idx].tolist()
        t_img   = img_features[train_idx]
        v_img   = img_features[val_idx]
        t_labels = [labels[i] for i in train_idx]
        v_labels = [labels[i] for i in val_idx]

        clf = clf_class()
        clf.fit(t_texts, t_img, t_labels)
        preds = clf.predict(v_texts, v_img)

        true_ids = [LABEL_MAP[l] for l in v_labels]
        pred_ids = [LABEL_MAP[l] for l in preds]

        acc = np.mean(np.array(pred_ids) == np.array(true_ids))
        f1  = sum(
            (np.array(pred_ids) == i).sum() / max((np.array(true_ids) == i).sum(), 1)
            for i in range(4)
        ) / 4

        acc_scores.append(acc)
        f1_scores.append(f1)
        print(f"  Fold {fold+1}: Acc={acc:.4f}  F1={f1:.4f}")

    results = {
        "cv_accuracy_mean": round(np.mean(acc_scores), 4),
        "cv_accuracy_std":  round(np.std(acc_scores),  4),
        "cv_f1_mean":       round(np.mean(f1_scores),  4),
        "cv_f1_std":        round(np.std(f1_scores),   4),
    }
    print(f"\n  CV Accuracy: {results['cv_accuracy_mean']:.4f} ± {results['cv_accuracy_std']:.4f}")
    print(f"  CV F1 Macro: {results['cv_f1_mean']:.4f} ± {results['cv_f1_std']:.4f}")
    return results


def generate_evaluation_report(results: dict, output_path: str = "models/evaluation_report.json"):
    """Save full evaluation report to JSON."""
    Path(output_path).parent.mkdir(exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nEvaluation report saved to {output_path}")


def feature_importance_report(clf) -> dict:
    """Extract feature importance from Random Forest if available."""
    model = clf.best_model
    if not hasattr(model, "feature_importances_"):
        return {}

    importances = model.feature_importances_
    n_text = 128
    n_kw   = 5
    n_img  = 8

    groups = {
        "bert_text_embeddings": float(importances[:n_text].sum()),
        "keyword_features":     float(importances[n_text:n_text+n_kw].sum()),
        "image_cnn_features":   float(importances[n_text+n_kw:].sum()),
    }
    total = sum(groups.values())
    groups = {k: round(v/total*100, 2) for k, v in groups.items()}

    print("\n=== Feature Group Importance ===")
    for g, pct in groups.items():
        bar = "█" * int(pct / 2)
        print(f"  {g:<28} {pct:5.1f}%  {bar}")

    return groups


if __name__ == "__main__":
    # Load saved results and print report
    results_path = Path("../models/results.json")
    if results_path.exists():
        with open(results_path) as f:
            results = json.load(f)

        print_confusion_matrix(results["confusion_matrix"])
        print_metrics(
            results["classification_report"],
            results["test_accuracy"],
            results["test_f1_macro"]
        )
        print(f"\nBest Model  : {results['best_model']}")
        print(f"Feature Dim : {results['feature_dim']}")
        print(f"Train Size  : {results['train_size']}")
        print(f"Test Size   : {results['test_size']}")
    else:
        print("No results.json found. Train the model first: python src/model.py")