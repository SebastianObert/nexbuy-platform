"""
Training pipeline for NexBuy AI Engine.
Models: success prediction, anomaly detection, MOQ recommendation.
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder

from .features import (
    load_and_clean_data,
    engineer_features,
    engineer_moq_features,
    get_feature_columns,
    get_categorical_columns,
    get_moq_feature_columns,
    get_moq_categorical_columns,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "kickstarter.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

SUCCESS_MODEL_PATH = os.path.join(MODELS_DIR, "success_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, "anomaly_model.pkl")
ENCODERS_PATH = os.path.join(MODELS_DIR, "label_encoders.pkl")
MOQ_MODEL_PATH = os.path.join(MODELS_DIR, "moq_model.pkl")
MOQ_ENCODERS_PATH = os.path.join(MODELS_DIR, "moq_encoders.pkl")


def train_success_model(df: pd.DataFrame):
    print("Training success prediction model...")

    feature_cols = get_feature_columns()
    cat_cols = get_categorical_columns()

    encoders = {}
    for col in cat_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = df[col].astype(str)
            df[col + "_encoded"] = le.fit_transform(df[col])
            encoders[col] = le
            feature_cols.append(col + "_encoded")

    X = df[feature_cols].fillna(0)

    target_col = "success" if "success" in df.columns else "state"
    y = (df["state"] == "successful").astype(int) if target_col == "state" else df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))
    roc_auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  ROC AUC:  {roc_auc:.4f}")

    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(SUCCESS_MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(ENCODERS_PATH, "wb") as f:
        pickle.dump(encoders, f)

    return accuracy, roc_auc


def train_anomaly_model(df: pd.DataFrame):
    print("Training anomaly detection model...")

    anomaly_features = ["goal", "backers" if "backers" in df.columns else "pledged"]
    available = [col for col in anomaly_features if col in df.columns]
    X = df[available].fillna(0).sample(min(5000, len(df)), random_state=42)

    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(X)

    with open(ANOMALY_MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print(f"  Anomaly model trained on {len(X)} samples")


def train_moq_model(df: pd.DataFrame):
    """
    Train a RandomForestRegressor to predict the expected backer count (MOQ)
    for a campaign, based only on successful Kickstarter campaigns.
    """
    print("Training MOQ recommendation model...")

    # Train only on successful campaigns — they represent achievable MOQs
    successful = df[df["state"] == "successful"].copy()
    print(f"  Using {len(successful)} successful campaigns")

    successful = engineer_moq_features(successful)

    feature_cols = get_moq_feature_columns()
    cat_cols = get_moq_categorical_columns()

    encoders = {}
    used_features = list(feature_cols)
    for col in cat_cols:
        if col in successful.columns:
            le = LabelEncoder()
            successful[col] = successful[col].astype(str)
            successful[col + "_encoded"] = le.fit_transform(successful[col])
            encoders[col] = le
            used_features.append(col + "_encoded")

    backer_col = "backers" if "backers" in successful.columns else "backers_count"
    X = successful[used_features].fillna(0)
    # Clip extreme outliers (top 1%) to reduce noise without removing real data
    y = successful[backer_col].clip(lower=1, upper=successful[backer_col].quantile(0.99))

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=20,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"  MAE: {mae:.1f} backers")
    print(f"  R²:  {r2:.4f}")

    # Store feature order so prediction can reconstruct the same columns
    encoders["_feature_order"] = used_features

    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(MOQ_MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(MOQ_ENCODERS_PATH, "wb") as f:
        pickle.dump(encoders, f)

    return mae, r2


def main():
    if not os.path.exists(DATA_PATH):
        print(f"Dataset not found at {DATA_PATH}")
        print("Place your Kickstarter CSV at: data/kickstarter.csv")
        return

    print("Loading data...")
    df = load_and_clean_data(DATA_PATH)
    df = engineer_features(df)
    print(f"  Loaded {len(df)} samples")

    train_success_model(df)
    train_anomaly_model(df)
    train_moq_model(df)

    print("\nDone! Models saved to:", MODELS_DIR)


if __name__ == "__main__":
    main()
