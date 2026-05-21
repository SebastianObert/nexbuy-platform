"""
FastAPI server for NexBuy AI Engine.
Endpoints: success prediction, anomaly detection, MOQ recommendation.
"""

import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .schemas import (
    SuccessPredictionInput,
    SuccessPredictionOutput,
    AnomalyInput,
    AnomalyOutput,
    MOQInput,
    MOQOutput,
    HealthStatus,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

SUCCESS_MODEL_PATH = os.path.join(MODELS_DIR, "success_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, "anomaly_model.pkl")
ENCODERS_PATH = os.path.join(MODELS_DIR, "label_encoders.pkl")
MOQ_MODEL_PATH = os.path.join(MODELS_DIR, "moq_model.pkl")
MOQ_ENCODERS_PATH = os.path.join(MODELS_DIR, "moq_encoders.pkl")

success_model = None
anomaly_model = None
label_encoders = None
moq_model = None
moq_encoders = None

# Per-category fallback MOQs derived from dataset medians (successful campaigns only)
_CATEGORY_MEDIAN_BACKERS = {
    "Technology": 150,
    "Design": 120,
    "Games": 200,
    "Film & Video": 80,
    "Music": 60,
    "Publishing": 50,
    "Art": 45,
    "Food": 70,
    "Fashion": 65,
    "Theater": 40,
    "Comics": 90,
    "Photography": 55,
    "Crafts": 35,
    "Dance": 30,
    "Journalism": 40,
}

_CATEGORY_INSIGHTS = {
    "Technology": "Tech hardware campaigns need critical mass early — a higher MOQ signals production viability.",
    "Design": "Design communities reward well-presented limited runs; MOQ reflects typical niche interest.",
    "Games": "Gaming communities are enthusiastic — recommend a MOQ that's ambitious but achievable.",
    "Film & Video": "Film projects attract smaller but dedicated backers; a modest MOQ works well.",
    "Music": "Music campaigns rely on existing fanbase; tune MOQ to your current audience size.",
    "Publishing": "Publishing has smaller backer pools — a conservative MOQ increases your success odds.",
    "Art": "Art collectors value exclusivity; a lower MOQ keeps the product desirable.",
    "Food": "Food/beverage groupbuys depend on local demand — align MOQ to your distribution reach.",
    "Fashion": "Fashion demand is trend-sensitive; set MOQ to match your marketing window.",
    "Games": "Tabletop and gaming communities have strong word-of-mouth — MOQ can be set ambitiously.",
}


def _load_models():
    global success_model, anomaly_model, label_encoders, moq_model, moq_encoders

    if os.path.exists(SUCCESS_MODEL_PATH):
        with open(SUCCESS_MODEL_PATH, "rb") as f:
            success_model = pickle.load(f)

    if os.path.exists(ANOMALY_MODEL_PATH):
        with open(ANOMALY_MODEL_PATH, "rb") as f:
            anomaly_model = pickle.load(f)

    if os.path.exists(ENCODERS_PATH):
        with open(ENCODERS_PATH, "rb") as f:
            label_encoders = pickle.load(f)

    if os.path.exists(MOQ_MODEL_PATH):
        with open(MOQ_MODEL_PATH, "rb") as f:
            moq_model = pickle.load(f)

    if os.path.exists(MOQ_ENCODERS_PATH):
        with open(MOQ_ENCODERS_PATH, "rb") as f:
            moq_encoders = pickle.load(f)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _load_models()
    yield


app = FastAPI(
    title="NexBuy AI Engine",
    description="Success prediction, anomaly detection & MOQ recommendation for groupbuy platform",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _risk_label(prob: float) -> str:
    if prob >= 70:
        return "low"
    if prob >= 40:
        return "medium"
    return "high"


def _severity_label(score: float) -> str:
    score = abs(score)
    if score >= 0.6:
        return "high"
    if score >= 0.3:
        return "medium"
    return "low"


def _moq_confidence(cv: float) -> str:
    """Confidence from coefficient of variation across forest trees."""
    if cv < 0.25:
        return "high"
    if cv < 0.55:
        return "medium"
    return "low"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthStatus)
async def health():
    trained = "yes" if moq_model is not None else "not trained"
    return HealthStatus(
        status="ok",
        model_version="0.2.0",
        last_trained=trained,
        accuracy=None,
    )


@app.post("/predict/success", response_model=SuccessPredictionOutput)
async def predict_success(input_data: SuccessPredictionInput):
    if success_model is None or label_encoders is None:
        return SuccessPredictionOutput(probability=75.0, risk_level="low")

    row = {
        "goal": input_data.goal,
        "duration_days": input_data.duration_days,
        "name_length": input_data.name_length,
        "desc_length": input_data.desc_length,
        "has_staff_pick": int(input_data.has_staff_pick),
        "has_spotlight": int(input_data.has_spotlight),
    }

    if "category" in label_encoders:
        cat = input_data.category
        row["category_encoded"] = (
            label_encoders["category"].transform([cat])[0]
            if cat in label_encoders["category"].classes_ else -1
        )
    if "country" in label_encoders:
        ctry = input_data.country
        row["country_encoded"] = (
            label_encoders["country"].transform([ctry])[0]
            if ctry in label_encoders["country"].classes_ else -1
        )

    X = pd.DataFrame([row])
    prob = success_model.predict_proba(X)[0, 1] * 100

    return SuccessPredictionOutput(
        probability=round(prob, 1),
        risk_level=_risk_label(prob),
    )


@app.post("/predict/anomaly", response_model=AnomalyOutput)
async def predict_anomaly(input_data: AnomalyInput):
    if anomaly_model is None:
        return AnomalyOutput(is_anomaly=False, anomaly_score=0.0, severity="low")

    X = pd.DataFrame([{
        "joins_in_window": input_data.joins_in_window,
        "unique_accounts": input_data.unique_accounts,
        "time_window_hours": input_data.time_window_hours,
        "avg_account_age_days": input_data.avg_account_age_days,
        "shared_addresses": input_data.shared_addresses,
    }])

    score = anomaly_model.decision_function(X)[0]
    is_anomaly = anomaly_model.predict(X)[0] == -1

    return AnomalyOutput(
        is_anomaly=bool(is_anomaly),
        anomaly_score=round(float(score), 4),
        severity=_severity_label(score),
    )


@app.post("/predict/moq", response_model=MOQOutput)
async def predict_moq(input_data: MOQInput):
    """
    Recommend a Minimum Order Quantity (MOQ) for a new groupbuy campaign.

    The recommendation is derived from a RandomForestRegressor trained on
    successful Kickstarter campaigns. It predicts how many backers a comparable
    campaign typically needs to succeed.
    """
    category = input_data.main_category
    fallback_moq = _CATEGORY_MEDIAN_BACKERS.get(category, 100)
    fallback_insight = _CATEGORY_INSIGHTS.get(
        category,
        f"Based on successful {category} campaigns, this MOQ reflects typical backer counts.",
    )

    if moq_model is None or moq_encoders is None:
        return MOQOutput(
            recommended_moq=fallback_moq,
            moq_range_low=max(1, int(fallback_moq * 0.6)),
            moq_range_high=int(fallback_moq * 1.8),
            confidence="low",
            category_insight=fallback_insight,
        )

    # Build feature row
    log_goal = float(np.log1p(max(input_data.goal_usd, 0)))
    row = {
        "log_goal_usd": log_goal,
        "duration_days": input_data.duration_days,
    }

    for col in ["main_category", "country"]:
        enc_key = col
        if enc_key in moq_encoders:
            value = input_data.main_category if col == "main_category" else input_data.country
            classes = moq_encoders[enc_key].classes_
            row[col + "_encoded"] = (
                int(moq_encoders[enc_key].transform([value])[0])
                if value in classes else -1
            )

    # Use stored feature order to guarantee column alignment
    feature_order = moq_encoders.get("_feature_order", list(row.keys()))
    X = pd.DataFrame([{k: row.get(k, 0) for k in feature_order}])

    # Collect per-tree predictions to derive a range and confidence.
    # Use numpy array to avoid scikit-learn feature-name mismatch warnings on individual trees.
    X_np = X.to_numpy()
    tree_preds = np.array([tree.predict(X_np)[0] for tree in moq_model.estimators_])
    tree_preds = np.clip(tree_preds, 1, None)

    median_pred = float(np.median(tree_preds))
    p25 = float(np.percentile(tree_preds, 25))
    p75 = float(np.percentile(tree_preds, 75))
    cv = float(np.std(tree_preds) / (np.mean(tree_preds) + 1e-9))

    recommended = max(1, int(round(median_pred)))
    moq_low = max(1, int(round(p25)))
    moq_high = max(recommended + 1, int(round(p75)))

    insight = _CATEGORY_INSIGHTS.get(
        category,
        f"Based on {category} campaigns, projects reaching this MOQ have a strong success rate.",
    )

    return MOQOutput(
        recommended_moq=recommended,
        moq_range_low=moq_low,
        moq_range_high=moq_high,
        confidence=_moq_confidence(cv),
        category_insight=insight,
    )
