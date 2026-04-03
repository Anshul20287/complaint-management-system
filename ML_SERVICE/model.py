"""
Multimodal Grievance Severity Classifier — v2
Architecture: Late Fusion (separate branches → probability fusion)

Instead of simple feature concatenation, each modality is trained independently
and produces class probabilities. A meta-classifier then fuses those probabilities.

Text Branch:   TF-IDF + SVD (128-dim) + keyword features (5-dim) → classifier → 4 probs
Image Branch:  CNN features (8-dim) → classifier → 4 probs
Meta Fusion:   [text_probs(4) + img_probs(4) + img_confidence(1)] → LogisticRegression
               img_confidence = max(img_probs) — tells fusion how much to trust the image

Benefits over early fusion (v1):
- Each branch is independently tunable
- Works gracefully when no image is provided (image branch outputs uniform probs)
- Confidence-weighted: if image is uncertain, text dominates automatically
- Easier to debug: you can inspect each branch's prediction separately
"""

import numpy as np
import pickle
import json
from pathlib import Path

from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score
import warnings
warnings.filterwarnings("ignore")

import sys
sys.path.insert(0, str(Path(__file__).parent))

LABEL_NAMES = ["low", "medium", "high", "critical"]
LABEL_MAP   = {l: i for i, l in enumerate(LABEL_NAMES)}


# ─── Text Branch ─────────────────────────────────────────────────────────────

class TextBranch:
    """
    Text → probability vector (4 classes)
    Uses TF-IDF + SVD embeddings + keyword features → GradientBoosting
    """

    def __init__(self):
        from nlp_preprocessing import BERTFeatureExtractor, build_keyword_features
        self.bert               = BERTFeatureExtractor(embedding_dim=128)
        self.build_keyword_features = build_keyword_features
        self.scaler             = StandardScaler()
        self.classifier         = GradientBoostingClassifier(
            n_estimators=200, learning_rate=0.08,
            max_depth=4, subsample=0.8, random_state=42
        )
        self.is_fitted = False

    def _featurize(self, texts: list) -> np.ndarray:
        text_emb  = self.bert.transform(texts)          # (n, 128)
        keyword_f = self.build_keyword_features(texts)  # (n, 5)
        return np.hstack([text_emb, keyword_f])         # (n, 133)

    def fit(self, texts: list, labels_int: np.ndarray):
        self.bert.fit(texts)
        X = self._featurize(texts)
        X_s = self.scaler.fit_transform(X)
        self.classifier.fit(X_s, labels_int)
        self.is_fitted = True
        return self

    def predict_proba(self, texts: list) -> np.ndarray:
        """Returns (n, 4) probability matrix."""
        X   = self._featurize(texts)
        X_s = self.scaler.transform(X)
        return self.classifier.predict_proba(X_s)

    def predict(self, texts: list) -> np.ndarray:
        return np.argmax(self.predict_proba(texts), axis=1)


# ─── Image Branch ─────────────────────────────────────────────────────────────

class ImageBranch:
    """
    Image features → probability vector (4 classes)
    Uses CNN-extracted 8-dim features → RandomForest
    When no image is provided, returns uniform probabilities (0.25 each).
    """
    NO_IMAGE_PROBA = np.array([[0.25, 0.25, 0.25, 0.25]], dtype=np.float32)

    def __init__(self):
        from image_features import SimulatedCNN
        self.cnn        = SimulatedCNN()
        self.scaler     = StandardScaler()
        self.classifier = RandomForestClassifier(
            n_estimators=200, max_depth=10,
            class_weight="balanced", random_state=42, n_jobs=-1
        )
        self.is_fitted = False

    def _featurize(self, img_features: np.ndarray) -> np.ndarray:
        return self.cnn.extract(img_features)  # (n, 8) normalized

    def fit(self, img_features: np.ndarray, labels_int: np.ndarray):
        X   = self._featurize(img_features)
        X_s = self.scaler.fit_transform(X)
        self.classifier.fit(X_s, labels_int)
        self.is_fitted = True
        return self

    def predict_proba(self, img_features: np.ndarray) -> np.ndarray:
        """
        Returns (n, 4) probability matrix.
        If img_features is None or all-0.5 (neutral fallback), returns uniform probs.
        """
        if img_features is None:
            return np.tile(self.NO_IMAGE_PROBA, (1, 1))

        if img_features.ndim == 1:
            img_features = img_features.reshape(1, -1)

        # Detect neutral fallback (no real image was provided)
        is_neutral = np.allclose(img_features, 0.5, atol=0.05)
        if is_neutral:
            return np.tile(self.NO_IMAGE_PROBA, (len(img_features), 1))

        X   = self._featurize(img_features)
        X_s = self.scaler.transform(X)
        return self.classifier.predict_proba(X_s)

    def predict(self, img_features: np.ndarray) -> np.ndarray:
        return np.argmax(self.predict_proba(img_features), axis=1)


# ─── Meta Fusion Layer ────────────────────────────────────────────────────────

class LateFusionMeta:
    """
    Combines text_probs + image_probs + image_confidence → final prediction.

    Input features (9-dim):
      [text_p_low, text_p_med, text_p_high, text_p_crit,   ← text branch probs
       img_p_low,  img_p_med,  img_p_high,  img_p_crit,    ← image branch probs
       img_confidence]                                       ← max(img_probs): how sure image is

    The img_confidence feature tells the meta-classifier:
    - 0.25 = image branch is maximally uncertain (no image / random)
    - 1.00 = image branch is completely sure
    So when no image is provided, the meta-layer automatically down-weights image probs.
    """

    def __init__(self):
        self.classifier = LogisticRegression(
    C=1.0,
    max_iter=500,
    class_weight="balanced",
    random_state=42,
    solver="lbfgs"
)
        self.scaler    = StandardScaler()
        self.is_fitted = False

    def _build_meta_features(self, text_proba: np.ndarray, img_proba: np.ndarray) -> np.ndarray:
        img_conf = np.max(img_proba, axis=1, keepdims=True)  # (n, 1)
        return np.hstack([text_proba, img_proba, img_conf])  # (n, 9)

    def fit(self, text_proba: np.ndarray, img_proba: np.ndarray, labels_int: np.ndarray):
        X   = self._build_meta_features(text_proba, img_proba)
        X_s = self.scaler.fit_transform(X)
        self.classifier.fit(X_s, labels_int)
        self.is_fitted = True
        return self

    def predict_proba(self, text_proba: np.ndarray, img_proba: np.ndarray) -> np.ndarray:
        X   = self._build_meta_features(text_proba, img_proba)
        X_s = self.scaler.transform(X)
        return self.classifier.predict_proba(X_s)

    def predict(self, text_proba: np.ndarray, img_proba: np.ndarray) -> np.ndarray:
        return np.argmax(self.predict_proba(text_proba, img_proba), axis=1)


# ─── Full Classifier ──────────────────────────────────────────────────────────

class GrievanceClassifier:
    """
    Full late-fusion multimodal classifier.
    Train flow:
      1. Fit TextBranch on training texts
      2. Fit ImageBranch on training image features
      3. Get branch probability outputs on a held-out fusion set
      4. Fit LateFusionMeta on those probabilities
    """

    def __init__(self):
        self.text_branch  = TextBranch()
        self.image_branch = ImageBranch()
        self.meta         = LateFusionMeta()
        self.all_results  = {}

    def fit(self, texts: list, img_features: np.ndarray, labels: list) -> dict:
        y = np.array([LABEL_MAP[l] for l in labels])

        print("─" * 55)
        print("Step 1: Train/Val/Test Split  (60 / 20 / 20)")
        X_idx = np.arange(len(texts))
        idx_tmp, idx_test = train_test_split(X_idx, test_size=0.20, stratify=y, random_state=42)
        idx_train, idx_fusion = train_test_split(idx_tmp, test_size=0.25, stratify=y[idx_tmp], random_state=42)

        texts_arr = np.array(texts)
        t_texts   = texts_arr[idx_train].tolist()
        f_texts   = texts_arr[idx_fusion].tolist()
        test_texts= texts_arr[idx_test].tolist()

        t_img, f_img, test_img = img_features[idx_train], img_features[idx_fusion], img_features[idx_test]
        t_y,   f_y,   test_y  = y[idx_train], y[idx_fusion], y[idx_test]

        print(f"  Train: {len(t_texts)} | Fusion: {len(f_texts)} | Test: {len(test_texts)}")

        # ── Branch training ───────────────────────────────────────────────────
        print("\nStep 2: Training Text Branch  (TF-IDF + SVD → GradientBoosting)")
        self.text_branch.fit(t_texts, t_y)
        t_text_acc = accuracy_score(t_y, self.text_branch.predict(t_texts))
        print(f"  Text branch train acc: {t_text_acc:.4f}")

        print("\nStep 3: Training Image Branch  (CNN features → RandomForest)")
        self.image_branch.fit(t_img, t_y)
        t_img_acc = accuracy_score(t_y, self.image_branch.predict(t_img))
        print(f"  Image branch train acc: {t_img_acc:.4f}")

        # ── Meta fusion training ───────────────────────────────────────────────
        print("\nStep 4: Training Meta Fusion Layer  (branch probs → LogisticRegression)")
        f_text_proba = self.text_branch.predict_proba(f_texts)
        f_img_proba  = self.image_branch.predict_proba(f_img)
        self.meta.fit(f_text_proba, f_img_proba, f_y)
        fusion_acc = accuracy_score(f_y, self.meta.predict(f_text_proba, f_img_proba))
        print(f"  Meta fusion train acc: {fusion_acc:.4f}")

        # ── Final evaluation ──────────────────────────────────────────────────
        print("\nStep 5: Final Evaluation on Test Set")
        test_text_proba = self.text_branch.predict_proba(test_texts)
        test_img_proba  = self.image_branch.predict_proba(test_img)
        test_preds      = self.meta.predict(test_text_proba, test_img_proba)
        test_proba      = self.meta.predict_proba(test_text_proba, test_img_proba)

        # Branch-only baselines for comparison
        text_only_acc = accuracy_score(test_y, np.argmax(test_text_proba, axis=1))
        img_only_acc  = accuracy_score(test_y, np.argmax(test_img_proba,  axis=1))
        fusion_test_acc = accuracy_score(test_y, test_preds)

        print(f"\n  Text-only accuracy  : {text_only_acc:.4f}")
        print(f"  Image-only accuracy : {img_only_acc:.4f}")
        print(f"  Late fusion accuracy: {fusion_test_acc:.4f}  ← combined")

        report = classification_report(test_y, test_preds, target_names=LABEL_NAMES, output_dict=True)
        cm      = confusion_matrix(test_y, test_preds)

        print("\n" + classification_report(test_y, test_preds, target_names=LABEL_NAMES))
        print("Confusion matrix:")
        print(cm)

        self.all_results = {
            "best_model": "LateFusion(GBM_text + RF_image + LR_meta)",
            "test_accuracy": round(fusion_test_acc, 4),
            "test_f1_macro": round(f1_score(test_y, test_preds, average="macro"), 4),
            "test_f1_weighted": round(f1_score(test_y, test_preds, average="weighted"), 4),
            "text_only_accuracy": round(text_only_acc, 4),
            "image_only_accuracy": round(img_only_acc, 4),
            "classification_report": report,
            "confusion_matrix": cm.tolist(),
            "feature_dim": {"text": 133, "image": 8, "meta_input": 9},
            "train_size": len(t_texts),
            "fusion_size": len(f_texts),
            "test_size": len(test_texts),
        }
        return self.all_results

    # ── Inference ─────────────────────────────────────────────────────────────

    def predict_single(self, text: str, img_features: np.ndarray) -> dict:
        """
        Predict one grievance. Returns full breakdown:
        - final severity + confidence
        - text branch prediction + confidence
        - image branch prediction + confidence
        - whether image actually influenced the result
        """
        text_proba = self.text_branch.predict_proba([text])        # (1, 4)
        img_proba  = self.image_branch.predict_proba(img_features.reshape(1, -1))  # (1, 4)
        final_proba= self.meta.predict_proba(text_proba, img_proba)[0]  # (4,)

        pred_i      = int(np.argmax(final_proba))
        text_pred_i = int(np.argmax(text_proba[0]))
        img_pred_i  = int(np.argmax(img_proba[0]))

        img_confidence = float(np.max(img_proba[0]))
        image_used     = img_confidence > 0.35  # above uniform = real image signal

        return {
            "severity":    LABEL_NAMES[pred_i],
            "confidence":  round(float(final_proba[pred_i]) * 100, 1),
            "probabilities": {
                name: round(float(p) * 100, 1)
                for name, p in zip(LABEL_NAMES, final_proba)
            },
            "text_prediction": {
                "severity":   LABEL_NAMES[text_pred_i],
                "confidence": round(float(text_proba[0][text_pred_i]) * 100, 1),
            },
            "image_prediction": {
                "severity":   LABEL_NAMES[img_pred_i],
                "confidence": round(img_confidence * 100, 1),
                "image_used": image_used,
            },
        }

    def predict(self, texts: list, img_features: np.ndarray) -> list:
        text_proba = self.text_branch.predict_proba(texts)
        img_proba  = self.image_branch.predict_proba(img_features)
        preds      = self.meta.predict(text_proba, img_proba)
        return [LABEL_NAMES[p] for p in preds]

    def predict_proba(self, texts: list, img_features: np.ndarray) -> np.ndarray:
        text_proba = self.text_branch.predict_proba(texts)
        img_proba  = self.image_branch.predict_proba(img_features)
        return self.meta.predict_proba(text_proba, img_proba)

    # ── Persistence ───────────────────────────────────────────────────────────

    def save(self, model_dir: str):
        path = Path(model_dir)
        path.mkdir(parents=True, exist_ok=True)
        with open(path / "classifier.pkl", "wb") as f:
            pickle.dump(self, f)
        with open(path / "results.json", "w") as f:
            json.dump(self.all_results, f, indent=2)
        print(f"\nModel saved to {path}/")

    @staticmethod
    def load(model_dir: str) -> "GrievanceClassifier":
        with open(Path(model_dir) / "classifier.pkl", "rb") as f:
            return pickle.load(f)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    from generate_data import generate_full_dataset

    print("Generating dataset...")
    df, img_feats = generate_full_dataset(n_per_class=300)

    clf = GrievanceClassifier()
    results = clf.fit(df["text"].tolist(), img_feats, df["label"].tolist())
    clf.save("models")

    print("\n=== Sample Predictions ===")
    test_cases = [
        ("Small crack on footpath near Hazratganj. Not affecting anyone.", img_feats[0]),
        ("Pothole on road near Gomti Nagar. Vehicles slowing down.", img_feats[400]),
        ("Live wires hanging near Chowk after storm. Very dangerous.", img_feats[700]),
        ("Building collapsed near Aminabad! People trapped! URGENT!", img_feats[950]),
    ]
    for text, img in test_cases:
        pred = clf.predict_single(text, img)
        icons = {"low": "🟢", "medium": "🟡", "high": "🟠", "critical": "🔴"}
        print(f"\n{icons[pred['severity']]} [{pred['severity'].upper():8s}] {pred['confidence']}% confidence")
        print(f"   Text branch : {pred['text_prediction']['severity']} ({pred['text_prediction']['confidence']}%)")
        print(f"   Image branch: {pred['image_prediction']['severity']} ({pred['image_prediction']['confidence']}%) | used={pred['image_prediction']['image_used']}")
        print(f"   Text: \"{text[:70]}\"")
