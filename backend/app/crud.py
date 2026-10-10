from datetime import datetime

from sqlalchemy.orm import Session

from . import models, schemas


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        age=user.age,
        gender=user.gender,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_goal(db: Session, user_id: int, goal: schemas.GoalCreate):
    db_goal = models.Goal(
        user_id=user_id,
        title=goal.title,
        target_value=goal.target_value,
        unit=goal.unit,
        achieved=goal.achieved,
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


def get_goals(db: Session, user_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).all()


def create_health_metric(db: Session, user_id: int, metric: schemas.HealthMetricCreate):
    db_metric = models.HealthMetric(
        user_id=user_id,
        date=metric.date or datetime.utcnow(),
        steps=metric.steps,
        calories_burned=metric.calories_burned,
        resting_heart_rate=metric.resting_heart_rate,
        average_heart_rate=metric.average_heart_rate,
        sleep_hours=metric.sleep_hours,
        water_ml=metric.water_ml,
        weight_kg=metric.weight_kg,
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


def get_health_metrics(db: Session, user_id: int):
    return db.query(models.HealthMetric).filter(models.HealthMetric.user_id == user_id).order_by(models.HealthMetric.date.desc()).all()


def create_workout(db: Session, user_id: int, workout: schemas.WorkoutCreate):
    db_workout = models.Workout(
        user_id=user_id,
        date=workout.date or datetime.utcnow(),
        workout_type=workout.workout_type,
        duration_minutes=workout.duration_minutes,
        calories_burned=workout.calories_burned,
        intensity=workout.intensity,
        notes=workout.notes,
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


def get_workouts(db: Session, user_id: int):
    return db.query(models.Workout).filter(models.Workout.user_id == user_id).order_by(models.Workout.date.desc()).all()


def create_sleep_log(db: Session, user_id: int, sleep_log: schemas.SleepLogCreate):
    db_sleep = models.SleepLog(
        user_id=user_id,
        date=sleep_log.date or datetime.utcnow(),
        hours_slept=sleep_log.hours_slept,
        quality_score=sleep_log.quality_score,
        bedtime=sleep_log.bedtime,
        wake_time=sleep_log.wake_time,
    )
    db.add(db_sleep)
    db.commit()
    db.refresh(db_sleep)
    return db_sleep


def get_sleep_logs(db: Session, user_id: int):
    return db.query(models.SleepLog).filter(models.SleepLog.user_id == user_id).order_by(models.SleepLog.date.desc()).all()


def create_nutrition_log(db: Session, user_id: int, nutrition_log: schemas.NutritionLogCreate):
    db_food = models.NutritionLog(
        user_id=user_id,
        date=nutrition_log.date or datetime.utcnow(),
        food_items=nutrition_log.food_items,
        calories=nutrition_log.calories,
        protein_g=nutrition_log.protein_g,
        carbs_g=nutrition_log.carbs_g,
        fat_g=nutrition_log.fat_g,
        water_ml=nutrition_log.water_ml,
    )
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food


def get_nutrition_logs(db: Session, user_id: int):
    return db.query(models.NutritionLog).filter(models.NutritionLog.user_id == user_id).order_by(models.NutritionLog.date.desc()).all()


def get_dashboard_summary(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None

    latest_metric = (
        db.query(models.HealthMetric)
        .filter(models.HealthMetric.user_id == user_id)
        .order_by(models.HealthMetric.date.desc())
        .first()
    )

    latest_workout = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == user_id)
        .order_by(models.Workout.date.desc())
        .first()
    )

    latest_sleep = (
        db.query(models.SleepLog)
        .filter(models.SleepLog.user_id == user_id)
        .order_by(models.SleepLog.date.desc())
        .first()
    )

    goals = db.query(models.Goal).filter(models.Goal.user_id == user_id).all()

    return {
        "user": user.name,
        "latest_metric": latest_metric,
        "latest_workout": latest_workout,
        "latest_sleep": latest_sleep,
        "goals": goals,
    }
