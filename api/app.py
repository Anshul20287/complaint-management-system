"""
FastAPI REST API — Grievance Severity Classifier
Offline deployment — no internet required after model is trained

Endpoints:
  POST /predict      — text + optional image → severity label
  GET  /health       — health check
  GET  /model-info   — model metadata
  GET  /docs         — Swagger UI (auto-generated)

Run: uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
"""

import numpy as np
import base64
import json
import time
from pathlib import Path
from typing import Optional

# FastAPI imports
try:
    from fastapi import FastAPI, HTTPException, UploadFile, File, Form
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
except ImportError:
    raise ImportError("Run: pip install fastapi uvicorn python-multipart")

import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "ML_SERVICE"))

from image_features import SimulatedCNN, extract_features_from_array

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Grievance Severity Classifier",
    description="Offline multimodal ML model: text + image → Low/Medium/High/Critical",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load Model at Startup ────────────────────────────────────────────────────

MODEL_DIR = Path(__file__).parent.parent / "ML_SERVICE" / "models"
clf = None
model_metadata = {}

@app.on_event("startup")
async def load_model():
    global clf, model_metadata
    model_path = MODEL_DIR / "classifier.pkl"
    if not model_path.exists():
        print("WARNING: Model not found. Train it first: python src/model.py")
        return
    try:
        from model import GrievanceClassifier
        clf = GrievanceClassifier.load(str(MODEL_DIR))
        results_path = MODEL_DIR / "results.json"
        if results_path.exists():
            with open(results_path) as f:
                model_metadata = json.load(f)
        print(f"Model loaded: {model_metadata.get('best_model', 'unknown')}")
        print(f"Test Accuracy: {model_metadata.get('test_accuracy', 'N/A')}")
    except Exception as e:
        print(f"Model load error: {e}")


# ─── Schemas ──────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=2000,
                      example="A huge pothole near Hazratganj market is causing accidents daily.")
    image_base64: Optional[str] = Field(None, description="Base64-encoded image (JPG/PNG)")

class SeverityResponse(BaseModel):
    severity: str
    confidence: float
    probabilities: dict
    needs_review: bool
    text_prediction: dict
    image_prediction: dict
    text_preview: str
    has_image: bool
    inference_time_ms: float

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str]

class ModelInfoResponse(BaseModel):
    model_name: str
    test_accuracy: float
    test_f1_macro: float
    feature_dim: int
    labels: list
    architecture: dict


# ─── Helper ──────────────────────────────────────────────────────────────────

def get_image_features(image_base64: Optional[str]) -> np.ndarray:
    """Decode base64 image and extract CNN features. Falls back to neutral if no image."""
    if not image_base64:
        # Neutral mid-range features when no image provided
        return np.array([0.5, 0.4, 0.3, 0.2, 0.4, 0.6, 0.3, 0.3], dtype=np.float32)

    try:
        from image_features import preprocess_image_from_bytes
        img_bytes = base64.b64decode(image_base64)
        arr = preprocess_image_from_bytes(img_bytes)
        raw = extract_features_from_array(arr)
        cnn = SimulatedCNN()
        return cnn.extract(raw.reshape(1, -1))[0]
    except Exception as e:
        print(f"Image processing error: {e}, using neutral features")
        return np.array([0.5, 0.4, 0.3, 0.2, 0.4, 0.6, 0.3, 0.3], dtype=np.float32)


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "model_loaded": clf is not None,
        "model_name": model_metadata.get("best_model"),
    }


@app.get("/model-info", response_model=ModelInfoResponse, tags=["System"])
async def model_info():
    if not model_metadata:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "model_name": model_metadata.get("best_model", "unknown"),
        "test_accuracy": model_metadata.get("test_accuracy", 0),
        "test_f1_macro": model_metadata.get("test_f1_macro", 0),
        "feature_dim": model_metadata.get("feature_dim", 0),
        "labels": ["low", "medium", "high", "critical"],
        "architecture": {
            "text_branch": "TF-IDF + SVD (128-dim) + keyword features (5-dim)",
            "image_branch": "CNN feature extractor (8-dim)",
            "fusion": "Concatenation → StandardScaler → Classifier",
            "classifier": model_metadata.get("best_model", "unknown"),
        }
    }


@app.post("/predict", response_model=SeverityResponse, tags=["Prediction"])
async def predict(request: PredictRequest):
    if clf is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train first.")

    start = time.time()
    img_feats = get_image_features(request.image_base64)

    result = clf.predict_single(request.text, img_feats)
    elapsed_ms = round((time.time() - start) * 1000, 2)

    return {
        "severity": result["severity"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "needs_review": result["confidence"] < 70.0,
        "text_prediction": result["text_prediction"],
        "image_prediction": result["image_prediction"],
        "text_preview": request.text[:100] + ("..." if len(request.text) > 100 else ""),
        "has_image": request.image_base64 is not None,
        "inference_time_ms": elapsed_ms,
    }


@app.post("/predict-form", response_model=SeverityResponse, tags=["Prediction"])
async def predict_form(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    """Accepts multipart form with text + image file directly."""
    if clf is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Train first.")

    start = time.time()
    img_b64 = None
    if image:
        raw = await image.read()
        img_b64 = base64.b64encode(raw).decode()

    img_feats = get_image_features(img_b64)
    result = clf.predict_single(text, img_feats)
    elapsed_ms = round((time.time() - start) * 1000, 2)

    return {
        "severity": result["severity"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "needs_review": result["confidence"] < 70.0,   
        "text_preview": text[:100] + ("..." if len(text) > 100 else ""),
        "has_image": image is not None,
        "inference_time_ms": elapsed_ms,
    }


@app.post("/batch-predict", tags=["Prediction"])
async def batch_predict(requests: list[PredictRequest]):
    """Classify multiple grievances in one call."""
    if clf is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    if len(requests) > 50:
        raise HTTPException(status_code=400, detail="Max 50 items per batch.")

    results = []
    for req in requests:
        img_feats = get_image_features(req.image_base64)
        result = clf.predict_single(req.text, img_feats)
        result["needs_review"] = result["confidence"] < 70.0
        results.append(result)
    return {"predictions": results, "count": len(results)}


# ─── Run directly ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)