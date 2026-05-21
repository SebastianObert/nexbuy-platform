"""
Feature engineering for Kickstarter groupbuy success prediction & MOQ recommendation.
"""

import pandas as pd
import numpy as np
from typing import List


def load_and_clean_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)

    # Normalize column names to internal conventions
    rename_map = {}
    if "launched" in df.columns and "launched_at" not in df.columns:
        rename_map["launched"] = "launched_at"
    if "usd pledged" in df.columns:
        rename_map["usd pledged"] = "usd_pledged"
    if rename_map:
        df = df.rename(columns=rename_map)

    # Drop rows missing critical values
    critical_cols = ["goal", "category", "country", "launched_at", "deadline"]
    for col in critical_cols:
        if col in df.columns:
            df = df.dropna(subset=[col])

    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    features = df.copy()

    # Campaign duration in days
    if "launched_at" in features.columns and "deadline" in features.columns:
        features["duration_days"] = (
            pd.to_datetime(features["deadline"]) -
            pd.to_datetime(features["launched_at"])
        ).dt.days.clip(lower=1)

    # Text length features (desc may not exist in all datasets)
    if "name" in features.columns:
        features["name_length"] = features["name"].str.len().fillna(0).astype(int)
    else:
        features["name_length"] = 0

    if "desc" in features.columns:
        features["desc_length"] = features["desc"].str.len().fillna(0).astype(int)
    else:
        features["desc_length"] = 0

    # Boolean flags
    features["has_staff_pick"] = features.get("staff_pick", pd.Series(False, index=features.index)).astype(bool)
    features["has_spotlight"] = features.get("spotlight", pd.Series(False, index=features.index)).astype(bool)

    return features


def engineer_moq_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer features specifically for MOQ (backer count) prediction."""
    features = engineer_features(df)

    # Use USD-normalized goal for cross-currency fairness
    if "usd_goal_real" in features.columns:
        features["goal_usd"] = features["usd_goal_real"]
    else:
        features["goal_usd"] = features["goal"]

    # Log-transform goal to compress the heavy right tail
    features["log_goal_usd"] = np.log1p(features["goal_usd"].clip(lower=0))

    # Pledge efficiency for reference (only meaningful for training data)
    backer_col = "backers" if "backers" in features.columns else "backers_count"
    if backer_col in features.columns and "pledged" in features.columns:
        features["pledge_per_backer"] = (
            features["pledged"] / features[backer_col].replace(0, np.nan)
        ).fillna(0)

    return features


# ---------------------------------------------------------------------------
# Feature column lists
# ---------------------------------------------------------------------------

def get_feature_columns() -> List[str]:
    return [
        "goal",
        "duration_days",
        "name_length",
        "desc_length",
        "has_staff_pick",
        "has_spotlight",
    ]


def get_categorical_columns() -> List[str]:
    return ["category", "country"]


def get_moq_feature_columns() -> List[str]:
    return [
        "log_goal_usd",
        "duration_days",
    ]


def get_moq_categorical_columns() -> List[str]:
    """Main category gives broader signal; country adds regional demand context."""
    return ["main_category", "country"]
