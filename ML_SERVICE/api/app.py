"""
FastAPI server for Grievance Severity Classifier
Endpoints:
  POST /predict          — single prediction (text + optional base64 image)
  POST /batch-predict    — up to 50 predictions at once
  GET  /model-info       — model architecture, accuracy, feature dims
  GET  /health           — liveness check for backend

Run:
  cd ML_SERVICE
  uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload

Swagger UI: http://localhost:8000/docs
"""

import base64
import json
import time
from pathlib import Path
from typing import Optional, List

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── Path setup ────────────────────────────────────────────────────────────────
# api/app.py lives one level inside ML_SERVICE, so we go up one dir
import sys
ML_ROOT = Path(__file__).parent.parent          # …/ML_SERVICE
sys.path.insert(0, str(ML_ROOT))

from model import GrievanceClassifier
from image_features import SimulatedCNN, extract_features_from_array, preprocess_image_from_bytes

# ── Load model once at startup ────────────────────────────────────────────────
MODEL_DIR = ML_ROOT / "models"
_clf: Optional[GrievanceClassifier] = None
_results: dict = {}

def get_classifier() -> GrievanceClassifier:
    global _clf, _results
    if _clf is None:
        pkl_path = MODEL_DIR / "classifier.pkl"
        if not pkl_path.exists():
            raise RuntimeError(
                "Model not found. Run: python train.py  from the ML_SERVICE directory."
            )
        print(f"[startup] Loading model from {pkl_path} …")
        _clf = GrievanceClassifier.load(str(MODEL_DIR))
        results_path = MODEL_DIR / "results.json"
        if results_path.exists():
            with open(results_path) as f:
                _results = json.load(f)
        print("[startup] Model loaded successfully.")
    return _clf


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="CityFix — Grievance Severity Classifier",
    description="Multimodal ML API: predicts complaint severity (low/medium/high/critical) from text + optional image.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=3, description="Complaint description text")
    image_base64: Optional[str] = Field(
        None,
        description="Optional base64-encoded image (JPEG/PNG). Omit or pass null if no image."
    )

class BatchPredictRequest(BaseModel):
    complaints: List[PredictRequest] = Field(..., max_items=50)

class BranchPrediction(BaseModel):
    severity: str
    confidence: float

class ImageBranchPrediction(BranchPrediction):
    image_used: bool

class PredictResponse(BaseModel):
    severity: str
    confidence: float
    probabilities: dict
    text_prediction: BranchPrediction
    image_prediction: ImageBranchPrediction
    inference_time_ms: float

class BatchPredictResponse(BaseModel):
    results: List[PredictResponse]
    total_time_ms: float


# ── Helper: decode base64 image → 8-dim feature vector ───────────────────────

_cnn = SimulatedCNN()   # used only for L2 normalisation step

def decode_image_features(image_base64: Optional[str]) -> np.ndarray:
    """
    base64 string → 8-dim normalised feature vector.
    Returns neutral fallback array if no image or decoding fails.
    """
    NEUTRAL = np.full(8, 0.5, dtype=np.float32)

    if not image_base64:
        return NEUTRAL

    try:
        # Strip data-URI prefix if present (e.g. "data:image/jpeg;base64,…")
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]

        image_bytes = base64.b64decode(image_base64)
        img_array   = preprocess_image_from_bytes(image_bytes)     # (224, 224, 3)
        raw_feats   = extract_features_from_array(img_array)       # (8,)
        norm_feats  = _cnn.extract(raw_feats)                      # (1, 8) normalised
        return norm_feats[0]

    except Exception as e:
        # Log but don't crash — fall back to neutral (text-only prediction)
        print(f"[warn] Image decoding failed: {e}. Using text-only prediction.")
        return NEUTRAL


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    """Liveness check — returns ok once model is loaded."""
    clf = get_classifier()
    return {
        "status": "ok",
        "model": "GrievanceClassifier",
        "model_loaded": clf is not None,
    }


@app.get("/model-info")
def model_info():
    """Returns model architecture, accuracy metrics, and feature dimensions."""
    get_classifier()   # ensure loaded
    return {
        "model": "LateFusion(GBM_text + RF_image + LR_meta)",
        "version": "1.0.0",
        "classes": ["low", "medium", "high", "critical"],
        "feature_dims": {"text": 133, "image": 8, "meta_input": 9},
        "test_accuracy": _results.get("test_accuracy"),
        "test_f1_macro": _results.get("test_f1_macro"),
        "text_only_accuracy": _results.get("text_only_accuracy"),
        "image_only_accuracy": _results.get("image_only_accuracy"),
        "train_size": _results.get("train_size"),
        "note": "Trained on synthetic data. Real-world F1 expected ~80-90%.",
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """
    Predict severity of a single complaint.

    - text: complaint description (supports English + Hinglish)
    - image_base64: optional base64-encoded image of the issue
    """
    clf = get_classifier()

    t0         = time.perf_counter()
    img_feats  = decode_image_features(req.image_base64)
    result     = clf.predict_single(req.text, img_feats)
    elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

    return PredictResponse(
        severity      = result["severity"],
        confidence    = result["confidence"],
        probabilities = result["probabilities"],
        text_prediction  = BranchPrediction(**result["text_prediction"]),
        image_prediction = ImageBranchPrediction(**result["image_prediction"]),
        inference_time_ms = elapsed_ms,
    )


@app.post("/batch-predict", response_model=BatchPredictResponse)
def batch_predict(req: BatchPredictRequest):
    """
    Predict severity for up to 50 complaints in one call.
    Each item may independently include or omit an image.
    """
    clf = get_classifier()
    t0 = time.perf_counter()

    results = []
    for item in req.complaints:
        img_feats = decode_image_features(item.image_base64)
        r = clf.predict_single(item.text, img_feats)
        results.append(PredictResponse(
            severity      = r["severity"],
            confidence    = r["confidence"],
            probabilities = r["probabilities"],
            text_prediction  = BranchPrediction(**r["text_prediction"]),
            image_prediction = ImageBranchPrediction(**r["image_prediction"]),
            inference_time_ms = 0.0,   # individual timing omitted in batch
        ))

    total_ms = round((time.perf_counter() - t0) * 1000, 2)
    return BatchPredictResponse(results=results, total_time_ms=total_ms)


# ── Dev entry point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.app:app", host="0.0.0.0", port=8000, reload=True)
