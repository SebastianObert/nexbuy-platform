from pydantic import BaseModel
from typing import Optional


class SuccessPredictionInput(BaseModel):
    goal: float
    category: str
    country: str
    duration_days: int
    has_staff_pick: bool = False
    has_spotlight: bool = False
    name_length: int
    desc_length: int


class SuccessPredictionOutput(BaseModel):
    product_id: Optional[str] = None
    probability: float
    risk_level: str  # low / medium / high


class AnomalyInput(BaseModel):
    joins_in_window: int
    unique_accounts: int
    time_window_hours: float
    avg_account_age_days: float
    shared_addresses: int


class AnomalyOutput(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    severity: str  # low / medium / high


class MOQInput(BaseModel):
    goal_usd: float       # funding target in USD
    main_category: str    # broad category (e.g. "Technology", "Design", "Games")
    country: str          # ISO country code (e.g. "US", "GB")
    duration_days: int    # planned campaign duration in days


class MOQOutput(BaseModel):
    product_id: Optional[str] = None
    recommended_moq: int   # recommended minimum number of backers/participants
    moq_range_low: int     # conservative lower bound (easier to hit)
    moq_range_high: int    # ambitious upper bound
    confidence: str        # low / medium / high
    category_insight: str  # short human-readable rationale


class HealthStatus(BaseModel):
    status: str
    model_version: str
    last_trained: str
    accuracy: Optional[float] = None
