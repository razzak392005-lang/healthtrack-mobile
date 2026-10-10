from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class GoalCreate(BaseModel):
    title: str
    target_value: float
    unit: str
    achieved: bool = False


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_value: float
    unit: str
    achieved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class HealthMetricCreate(BaseModel):
    date: Optional[datetime] = None
    steps: int = 0
    calories_burned: float = 0.0
    resting_heart_rate: float = 0.0
    average_heart_rate: float = 0.0
    sleep_hours: float = 0.0
    water_ml: float = 0.0
    weight_kg: float = 0.0


class HealthMetricResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    steps: int
    calories_burned: float
    resting_heart_rate: float
    average_heart_rate: float
    sleep_hours: float
    water_ml: float
    weight_kg: float

    class Config:
        from_attributes = True


class WorkoutCreate(BaseModel):
    workout_type: str
    duration_minutes: int
    calories_burned: float = 0.0
    intensity: str = "moderate"
    notes: Optional[str] = None
    date: Optional[datetime] = None


class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    workout_type: str
    duration_minutes: int
    calories_burned: float
    intensity: str
    notes: Optional[str]

    class Config:
        from_attributes = True


class SleepLogCreate(BaseModel):
    hours_slept: float
    quality_score: Optional[int] = None
    bedtime: Optional[str] = None
    wake_time: Optional[str] = None
    date: Optional[datetime] = None


class SleepLogResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    hours_slept: float
    quality_score: Optional[int]
    bedtime: Optional[str]
    wake_time: Optional[str]

    class Config:
        from_attributes = True


class NutritionLogCreate(BaseModel):
    food_items: Optional[str] = None
    calories: float = 0.0
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fat_g: float = 0.0
    water_ml: float = 0.0
    date: Optional[datetime] = None


class NutritionLogResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    food_items: Optional[str]
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    water_ml: float

    class Config:
        from_attributes = True
