from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    goals = relationship("Goal", back_populates="user")
    metrics = relationship("HealthMetric", back_populates="user")
    workouts = relationship("Workout", back_populates="user")
    sleep_logs = relationship("SleepLog", back_populates="user")
    nutrition_logs = relationship("NutritionLog", back_populates="user")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    achieved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")


class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    steps = Column(Integer, default=0)
    calories_burned = Column(Float, default=0.0)
    resting_heart_rate = Column(Float, default=0.0)
    average_heart_rate = Column(Float, default=0.0)
    sleep_hours = Column(Float, default=0.0)
    water_ml = Column(Float, default=0.0)
    weight_kg = Column(Float, default=0.0)

    user = relationship("User", back_populates="metrics")


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    workout_type = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    calories_burned = Column(Float, default=0.0)
    intensity = Column(String, default="moderate")
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="workouts")


class SleepLog(Base):
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    hours_slept = Column(Float, nullable=False)
    quality_score = Column(Integer, nullable=True)
    bedtime = Column(String, nullable=True)
    wake_time = Column(String, nullable=True)

    user = relationship("User", back_populates="sleep_logs")


class NutritionLog(Base):
    __tablename__ = "nutrition_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    food_items = Column(String, nullable=True)
    calories = Column(Float, default=0.0)
    protein_g = Column(Float, default=0.0)
    carbs_g = Column(Float, default=0.0)
    fat_g = Column(Float, default=0.0)
    water_ml = Column(Float, default=0.0)

    user = relationship("User", back_populates="nutrition_logs")
