"""
Computer Vision Module — CNN Image Feature Extractor
Demonstrates: image preprocessing, feature extraction, CNN simulation
In production: swap SimulatedCNN with MobileNetV2 / ResNet50 from torchvision or keras
"""

import numpy as np
import pickle
from pathlib import Path


# ─── Feature Names (what CNN extracts) ───────────────────────────────────────

IMAGE_FEATURE_NAMES = [
    "brightness",       # avg pixel brightness (dark scene = potential night/emergency)
    "contrast",         # RMS contrast (high = more visible damage)
    "edge_density",     # Canny edge density (cracks, breaks = high edges)
    "damage_area_ratio",# % of frame showing damage/anomaly
    "color_saturation", # low saturation = grey/dusty = structural damage
    "blur_score",       # low = motion blur or smoke
    "object_count",     # estimated distinct objects (debris = more objects)
    "anomaly_score",    # deviation from normal scene distribution
]


# ─── Real Image Preprocessing (PIL-based) ─────────────────────────────────────

def preprocess_image_from_path(image_path: str, target_size=(224, 224)) -> np.ndarray:
    """
    Load and preprocess a real image for CNN feature extraction.
    Returns normalized numpy array of shape (H, W, 3).
    """
    try:
        from PIL import Image
        img = Image.open(image_path).convert("RGB").resize(target_size)
        arr = np.array(img, dtype=np.float32) / 255.0
        return arr
    except ImportError:
        raise ImportError("Install Pillow: pip install Pillow")


def preprocess_image_from_bytes(image_bytes: bytes, target_size=(224, 224)) -> np.ndarray:
    """Load image from bytes (for API use)."""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize(target_size)
        return np.array(img, dtype=np.float32) / 255.0
    except ImportError:
        raise ImportError("Install Pillow: pip install Pillow")


# ─── Real Feature Extraction from Pixel Array ─────────────────────────────────

def extract_features_from_array(img_array: np.ndarray) -> np.ndarray:
    """
    Extract 8 interpretable image features from a (H, W, 3) numpy array.
    These mimic what a CNN final layer would encode.
    """
    # Brightness: mean of all pixels
    brightness = float(np.mean(img_array))

    # Contrast: standard deviation across pixels
    contrast = float(np.std(img_array))

    # Edge density: simplified gradient magnitude (Sobel-like)
    gray = np.mean(img_array, axis=2)
    gx = np.abs(np.diff(gray, axis=1)).mean()
    gy = np.abs(np.diff(gray, axis=0)).mean()
    edge_density = float((gx + gy) / 2)

    # Damage area: pixels deviating heavily from mean (proxy for damage regions)
    deviation = np.abs(gray - gray.mean())
    damage_area = float((deviation > deviation.mean() + deviation.std()).mean())

    # Color saturation: range across channels
    saturation = float(img_array.max(axis=2).mean() - img_array.min(axis=2).mean())

    # Blur score: inverse of Laplacian variance
    laplacian = np.abs(np.diff(np.diff(gray, axis=0), axis=0))
    blur_score = float(1.0 / (1.0 + laplacian.var() * 100))

    # Object count proxy: distinct high-contrast blobs
    high_contrast = (deviation > deviation.mean()).astype(float)
    # rough segment count via block variance
    h, w = high_contrast.shape
    blocks = high_contrast.reshape(h // 8, 8, w // 8, 8).mean(axis=(1, 3))
    object_count = float(np.sum(blocks > 0.5))

    # Anomaly score: Z-score based
    channel_means = img_array.reshape(-1, 3).mean(axis=0)
    # deviation from a "normal" balanced image [0.5, 0.5, 0.5]
    anomaly_score = float(np.linalg.norm(channel_means - 0.5))

    features = np.array([
        np.clip(brightness, 0, 1),
        np.clip(contrast * 3, 0, 1),
        np.clip(edge_density * 5, 0, 1),
        np.clip(damage_area, 0, 1),
        np.clip(saturation, 0, 1),
        np.clip(blur_score, 0, 1),
        np.clip(object_count / 30, 0, 1),
        np.clip(anomaly_score, 0, 1),
    ], dtype=np.float32)

    return features


# ─── Simulated CNN (for training without real images) ─────────────────────────

class SimulatedCNN:
    """
    Simulates a MobileNetV2 feature extractor trained on grievance images.
    Used when training with synthetic data (no real image dataset).
    In production: replace .extract() with real CNN forward pass.
    """

    def __init__(self, output_dim: int = 8):
        self.output_dim = output_dim
        self.feature_names = IMAGE_FEATURE_NAMES

    def extract(self, image_features: np.ndarray) -> np.ndarray:
        """
        Pass-through with noise augmentation (simulates CNN variation).
        Input: (n_samples, 8) raw features
        Output: (n_samples, 8) normalized features
        """
        if image_features.ndim == 1:
            image_features = image_features.reshape(1, -1)
        noise = np.random.normal(0, 0.01, image_features.shape)
        features = np.clip(image_features + noise, 0, 1)
        # L2 normalize per sample
        norms = np.linalg.norm(features, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1, norms)
        return (features / norms).astype(np.float32)

    def extract_from_image(self, image_path: str) -> np.ndarray:
        """Full pipeline: image path → CNN features."""
        arr = preprocess_image_from_path(image_path)
        raw_features = extract_features_from_array(arr)
        return self.extract(raw_features)

    def extract_from_bytes(self, image_bytes: bytes) -> np.ndarray:
        """Full pipeline: image bytes → CNN features."""
        arr = preprocess_image_from_bytes(image_bytes)
        raw_features = extract_features_from_array(arr)
        return self.extract(raw_features)

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @staticmethod
    def load(path: str) -> "SimulatedCNN":
        with open(path, "rb") as f:
            return pickle.load(f)


# ─── Feature Importance Analysis ──────────────────────────────────────────────

def analyze_image_features(features: np.ndarray, labels: list) -> dict:
    """Compute per-class mean of each image feature for interpretability."""
    unique_labels = sorted(set(labels))
    label_arr = np.array(labels)
    analysis = {}
    for label in unique_labels:
        mask = label_arr == label
        analysis[label] = {
            name: round(float(features[mask, i].mean()), 4)
            for i, name in enumerate(IMAGE_FEATURE_NAMES)
        }
    return analysis


if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from generate_data import generate_full_dataset

    _, img_feats = generate_full_dataset(n_per_class=50)
    labels = ["low"] * 50 + ["medium"] * 50 + ["high"] * 50 + ["critical"] * 50

    cnn = SimulatedCNN()
    extracted = cnn.extract(img_feats)
    print(f"CNN feature output shape: {extracted.shape}")

    analysis = analyze_image_features(img_feats, labels)
    print("\n=== Per-class Image Feature Means ===")
    for label, feats in analysis.items():
        print(f"\n[{label.upper()}]")
        for k, v in feats.items():
            print(f"  {k:25s}: {v:.4f}")