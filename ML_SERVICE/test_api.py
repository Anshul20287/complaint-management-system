"""
test_api.py — Quick local test script (no server needed)
Tests the classifier directly: text-only and text+image

Run from ML_SERVICE directory:
    python test_api.py
"""

import sys
import base64
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from model import GrievanceClassifier
from image_features import SimulatedCNN, extract_features_from_array, preprocess_image_from_bytes

MODEL_DIR = Path(__file__).parent / "models"
_cnn = SimulatedCNN()

def load_model():
    print("Loading model...")
    clf = GrievanceClassifier.load(str(MODEL_DIR))
    print("Model loaded.\n")
    return clf

def decode_image(image_base64: str) -> np.ndarray:
    NEUTRAL = np.full(8, 0.5, dtype=np.float32)
    if not image_base64:
        return NEUTRAL
    try:
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]
        image_bytes = base64.b64decode(image_base64)
        img_array   = preprocess_image_from_bytes(image_bytes)
        raw_feats   = extract_features_from_array(img_array)
        norm_feats  = _cnn.extract(raw_feats)
        return norm_feats[0]
    except Exception as e:
        print(f"[warn] Image failed: {e}. Using text-only.")
        return NEUTRAL

def predict(clf, text: str, image_path: str = None):
    if image_path:
        with open(image_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        img_feats = decode_image(b64)
        image_label = Path(image_path).name
    else:
        img_feats   = np.full(8, 0.5, dtype=np.float32)
        image_label = "none"

    result = clf.predict_single(text, img_feats)
    icons  = {"low": "🟢", "medium": "🟡", "high": "🟠", "critical": "🔴"}
    icon   = icons[result["severity"]]

    print("─" * 60)
    print(f"Text  : {text[:80]}")
    print(f"Image : {image_label}")
    print(f"Result: {icon} {result['severity'].upper()}  ({result['confidence']}% confidence)")
    print(f"  Probs : low={result['probabilities']['low']}%  medium={result['probabilities']['medium']}%  "
          f"high={result['probabilities']['high']}%  critical={result['probabilities']['critical']}%")
    print(f"  Text branch : {result['text_prediction']['severity']}  ({result['text_prediction']['confidence']}%)")
    print(f"  Image branch: {result['image_prediction']['severity']}  "
          f"({result['image_prediction']['confidence']}%)  used={result['image_prediction']['image_used']}")
    print()

if __name__ == "__main__":
    clf = load_model()

    print("=" * 60)
    print("TEXT-ONLY TESTS")
    print("=" * 60)

    cases = [
        "Paint peeling on boundary wall near Aminabad. Not urgent.",
        "Street light near Gomti Nagar has been off for 3 days.",
        "Large pothole near Hazratganj has caused 2 accidents this week.",
        "Building collapsed near Chowk! People trapped under debris. URGENT!",
        "Sadak mein bada gaddha hai Alambagh ke paas. Kai accidents ho chuke hain.",
        "Live wire hanging near footpath after storm. Very dangerous.",
    ]
    for text in cases:
        predict(clf, text)

    # Test with a real image if one is passed as CLI argument
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        text       = sys.argv[2] if len(sys.argv) > 2 else "Issue reported at this location."
        print("=" * 60)
        print("IMAGE + TEXT TEST")
        print("=" * 60)
        predict(clf, text, image_path)
