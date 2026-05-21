"""
NexBuy — Anomaly Detection Service
====================================
FastAPI REST API untuk deteksi anomali partisipasi menggunakan Isolation Forest.
Jalankan: uvicorn anomaly_service:app --reload --port 8001

Endpoint:
  POST /detect         → cek 1 user, return Trust Score
  POST /detect/batch   → cek banyak user sekaligus
  GET  /health         → cek status service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pickle
import os
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import MinMaxScaler
from sklearn.pipeline import Pipeline

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NexBuy Anomaly Detection API",
    description="Deteksi bot & fake demand menggunakan Isolation Forest",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model Storage ─────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "anomaly_behavior_model.pkl")
model_pipeline = None
TRUST_THRESHOLD = 40

# ── Feature Columns ───────────────────────────────────────────────────────────
FEATURE_COLS = [
    "events_per_hour",
    "avg_inter_sec",
    "std_inter_sec",
    "min_inter_sec",
    "n_sessions",
    "events_per_session",
    "cart_ratio",
    "purchase_ratio",
    "n_types",
    "night_ratio",
    "unique_products",
]

# ── Schemas ───────────────────────────────────────────────────────────────────
class UserBehavior(BaseModel):
    user_id: str
    events_per_hour: float
    avg_inter_sec: float
    std_inter_sec: float
    min_inter_sec: float
    n_sessions: int
    events_per_session: float
    cart_ratio: float
    purchase_ratio: float
    n_types: int
    night_ratio: float
    unique_products: int

class TrustScoreResult(BaseModel):
    user_id: str
    trust_score: float
    is_anomaly: bool
    risk_flag: bool
    risk_level: str
    message: str

class BatchRequest(BaseModel):
    users: List[UserBehavior]

class BatchResult(BaseModel):
    total: int
    flagged: int
    results: List[TrustScoreResult]

# ── Helpers ───────────────────────────────────────────────────────────────────
def get_risk_level(score: float) -> str:
    if score < 30:   return "HIGH"
    elif score < 50: return "MEDIUM"
    else:            return "LOW"

def get_message(score: float, is_anomaly: bool) -> str:
    if score < 30:
        return "Aktivitas sangat mencurigakan — kemungkinan bot atau akun palsu"
    elif score < 40:
        return "Pola partisipasi tidak normal — di-exclude dari pipeline prediksi"
    elif score < 60:
        return "Aktivitas sedikit tidak biasa — perlu dipantau"
    else:
        return "Partisipasi organik — data valid untuk pipeline prediksi"

def load_or_create_model():
    global model_pipeline
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model_pipeline = pickle.load(f)
        print(f"Model loaded dari {MODEL_PATH}")
    else:
        print("Model belum ada — membuat model default dari synthetic data...")
        _create_default_model()

def _create_default_model():
    global model_pipeline
    import pandas as pd

    rng = np.random.default_rng(42)
    N = 5000

    normal = pd.DataFrame({
        "events_per_hour":    rng.uniform(0.5, 20, N),
        "avg_inter_sec":      rng.uniform(60, 7200, N),
        "std_inter_sec":      rng.uniform(30, 3600, N),
        "min_inter_sec":      rng.uniform(5, 300, N),
        "n_sessions":         rng.integers(1, 8, N).astype(float),
        "events_per_session": rng.uniform(2, 20, N),
        "cart_ratio":         rng.uniform(0.05, 0.3, N),
        "purchase_ratio":     rng.uniform(0.02, 0.15, N),
        "n_types":            rng.integers(2, 4, N).astype(float),
        "night_ratio":        rng.uniform(0, 0.2, N),
        "unique_products":    rng.integers(2, 50, N).astype(float),
    })

    bot = pd.DataFrame({
        "events_per_hour":    rng.uniform(200, 500, 350),
        "avg_inter_sec":      rng.uniform(0.1, 5, 350),
        "std_inter_sec":      rng.uniform(0, 1, 350),
        "min_inter_sec":      rng.uniform(0.01, 1, 350),
        "n_sessions":         rng.integers(1, 2, 350).astype(float),
        "events_per_session": rng.uniform(80, 300, 350),
        "cart_ratio":         rng.uniform(0, 0.05, 350),
        "purchase_ratio":     rng.uniform(0, 0.02, 350),
        "n_types":            rng.integers(1, 2, 350).astype(float),
        "night_ratio":        rng.uniform(0.6, 1.0, 350),
        "unique_products":    rng.integers(1, 3, 350).astype(float),
    })

    X_train = pd.concat([normal, bot], ignore_index=True)[FEATURE_COLS]
    X_train = X_train.replace([np.inf, -np.inf], 0).fillna(0)

    model_pipeline = Pipeline([
        ("scaler", MinMaxScaler()),
        ("iso", IsolationForest(n_estimators=200, contamination=0.07, random_state=42, n_jobs=-1))
    ])
    model_pipeline.fit(X_train)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model_pipeline, f)
    print(f"Model disimpan ke {MODEL_PATH}")

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    load_or_create_model()

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model_pipeline is not None,
        "trust_threshold": TRUST_THRESHOLD
    }

@app.post("/detect", response_model=TrustScoreResult)
def detect_single(user: UserBehavior):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model belum siap")

    X = np.array([[
        user.events_per_hour, user.avg_inter_sec, user.std_inter_sec,
        user.min_inter_sec, user.n_sessions, user.events_per_session,
        user.cart_ratio, user.purchase_ratio, user.n_types,
        user.night_ratio, user.unique_products
    ]])
    X = np.clip(X, 0, None)

    raw   = model_pipeline["iso"].decision_function(model_pipeline["scaler"].transform(X))[0]
    label = model_pipeline.predict(X)[0]
    trust = float(np.clip((raw + 0.5) * 100, 0, 100))
    trust = round(trust, 1)

    return TrustScoreResult(
        user_id    =user.user_id,
        trust_score=trust,
        is_anomaly =label == -1,
        risk_flag  =trust < TRUST_THRESHOLD,
        risk_level =get_risk_level(trust),
        message    =get_message(trust, label == -1)
    )

@app.post("/detect/batch", response_model=BatchResult)
def detect_batch(req: BatchRequest):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model belum siap")
    if not req.users:
        raise HTTPException(status_code=400, detail="List user kosong")

    X = np.array([[
        u.events_per_hour, u.avg_inter_sec, u.std_inter_sec,
        u.min_inter_sec, u.n_sessions, u.events_per_session,
        u.cart_ratio, u.purchase_ratio, u.n_types,
        u.night_ratio, u.unique_products
    ] for u in req.users])
    X = np.clip(X, 0, None)

    raws   = model_pipeline["iso"].decision_function(model_pipeline["scaler"].transform(X))
    labels = model_pipeline.predict(X)
    trusts = np.clip((raws + 0.5) * 100, 0, 100).round(1)

    results = [
        TrustScoreResult(
            user_id    =u.user_id,
            trust_score=float(t),
            is_anomaly =l == -1,
            risk_flag  =float(t) < TRUST_THRESHOLD,
            risk_level =get_risk_level(float(t)),
            message    =get_message(float(t), l == -1)
        )
        for u, t, l in zip(req.users, trusts, labels)
    ]

    return BatchResult(total=len(results), flagged=sum(1 for r in results if r.risk_flag), results=results)
