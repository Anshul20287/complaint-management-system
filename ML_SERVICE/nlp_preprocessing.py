"""
NLP Preprocessing Module
Demonstrates: text cleaning, TF-IDF vectorization, BERT tokenization
"""

import re
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import pickle
from pathlib import Path


# ─── Text Cleaning ────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Clean and normalize grievance text."""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)          # remove URLs
    text = re.sub(r"[^a-zA-Z0-9\s.,!?'-]", " ", text)   # keep useful punctuation
    text = re.sub(r"\s+", " ", text).strip()             # normalize whitespace
    return text


def extract_severity_keywords(text: str) -> dict:
    """
    Rule-based feature extraction including Hindi/Hinglish keywords.
    """
    text_lower = text.lower()
    keywords = {
        "urgency_words": [
            "urgent", "immediately", "emergency", "critical", "danger",
            "collapse", "trapped", "turant", "jaldi", "madad", "bachao",
            "help", "sos", "akasmik", "khatarnak", "khatre"
        ],
        "high_risk_words": [
            "accident", "injury", "flood", "fire", "burst", "fallen",
            "blocked", "exposed", "baadhh", "aag", "zakhmi", "phuta",
            "gira", "girna", "duba", "phansa"
        ],
        "medium_words": [
            "broken", "damaged", "clogged", "overflow", "disrupted",
            "malfunctioning", "toot", "jam", "band", "kharab", "leak",
            "leakge", "nahi aa raha", "problem"
        ],
        "low_words": [
            "minor", "small", "slight", "flickering", "peeling", "loose",
            "faded", "chota", "thoda", "halka", "minor", "theek nahi"
        ],
        "time_pressure": [
            "days", "week", "multiple", "several", "repeatedly", "ongoing",
            "din se", "hafte se", "baar baar", "pehle bhi", "again"
        ],
    }
    features = {}
    for key, words in keywords.items():
        features[key] = sum(1 for w in words if w in text_lower)
    return features


# ─── TF-IDF Vectorizer ───────────────────────────────────────────────────────

class GrievanceTFIDF:
    """TF-IDF vectorizer fitted on grievance corpus."""

    def __init__(self, max_features: int = 5000, ngram_range=(1, 2)):
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            stop_words="english",
            preprocessor=clean_text,
            sublinear_tf=True,
        )
        self.label_encoder = LabelEncoder()
        self.is_fitted = False

    def fit(self, texts, labels):
        self.vectorizer.fit(texts)
        self.label_encoder.fit(labels)
        self.is_fitted = True
        return self

    def transform_text(self, texts):
        return self.vectorizer.transform(texts).toarray()

    def encode_labels(self, labels):
        return self.label_encoder.transform(labels)

    def decode_labels(self, ids):
        return self.label_encoder.inverse_transform(ids)

    def get_top_features(self, n: int = 20) -> list:
        """Return top n features by IDF score."""
        if not self.is_fitted:
            return []
        feature_names = self.vectorizer.get_feature_names_out()
        idf_scores = self.vectorizer.idf_
        top_idx = np.argsort(idf_scores)[-n:][::-1]
        return [(feature_names[i], round(idf_scores[i], 3)) for i in top_idx]

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @staticmethod
    def load(path: str) -> "GrievanceTFIDF":
        with open(path, "rb") as f:
            return pickle.load(f)


# ─── BERT-style Token Feature Extractor (lightweight simulation) ──────────────

class BERTFeatureExtractor:
    """
    Simulates BERT sentence embeddings using TF-IDF + SVD (LSA).
    In production, replace with: transformers.AutoModel('bert-base-uncased')
    This keeps the project dependency-light while demonstrating the concept.
    """

    def __init__(self, embedding_dim: int = 128):
        from sklearn.decomposition import TruncatedSVD
        from sklearn.pipeline import Pipeline

        self.embedding_dim = embedding_dim
        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                max_features=10000,
                ngram_range=(1, 3),
                preprocessor=clean_text,
                sublinear_tf=True,
            )),
            ("svd", TruncatedSVD(n_components=embedding_dim, random_state=42)),
        ])
        self.is_fitted = False

    def fit(self, texts):
        self.pipeline.fit(texts)
        self.is_fitted = True
        return self

    def transform(self, texts) -> np.ndarray:
        """Returns shape (n_samples, embedding_dim)"""
        embeddings = self.pipeline.transform(texts)
        # L2 normalize like BERT [CLS] token
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1, norms)
        return embeddings / norms

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @staticmethod
    def load(path: str) -> "BERTFeatureExtractor":
        with open(path, "rb") as f:
            return pickle.load(f)


# ─── Keyword Feature Matrix ───────────────────────────────────────────────────

def build_keyword_features(texts: list) -> np.ndarray:
    """Build keyword signal feature matrix for all texts."""
    rows = []
    for text in texts:
        kf = extract_severity_keywords(text)
        rows.append(list(kf.values()))
    return np.array(rows, dtype=np.float32)


if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from generate_data import generate_full_dataset

    df, _ = generate_full_dataset(n_per_class=100)
    texts = df["text"].tolist()
    labels = df["label"].tolist()

    print("=== TF-IDF Vectorizer ===")
    tfidf = GrievanceTFIDF()
    tfidf.fit(texts, labels)
    X = tfidf.transform_text(texts[:5])
    print(f"TF-IDF feature shape: {X.shape}")
    print("Top 10 features:", tfidf.get_top_features(10))

    print("\n=== BERT-style Embeddings ===")
    bert = BERTFeatureExtractor(embedding_dim=128)
    bert.fit(texts)
    embs = bert.transform(texts[:5])
    print(f"Embedding shape: {embs.shape}")
    print(f"Norm of first embedding: {np.linalg.norm(embs[0]):.4f}")

    print("\n=== Keyword Features ===")
    kf = build_keyword_features(texts[:5])
    print(f"Keyword feature shape: {kf.shape}")
    print("Sample:", kf[0])