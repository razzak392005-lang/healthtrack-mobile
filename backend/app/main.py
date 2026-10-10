from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthTrack MVP", version="1.0.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "HealthTrack"}


@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    return crud.create_user(db=db, user=user)


@app.get("/users", response_model=List[schemas.UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/users/{user_id}/goals", response_model=schemas.GoalResponse)
def create_user_goal(user_id: int, goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_goal(db=db, user_id=user_id, goal=goal)


@app.get("/users/{user_id}/goals", response_model=List[schemas.GoalResponse])
def list_goals(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_goals(db, user_id)


@app.post("/users/{user_id}/metrics", response_model=schemas.HealthMetricResponse)
def create_health_metric(user_id: int, metric: schemas.HealthMetricCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_health_metric(db=db, user_id=user_id, metric=metric)


@app.get("/users/{user_id}/metrics", response_model=List[schemas.HealthMetricResponse])
def list_metrics(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_health_metrics(db, user_id)


@app.post("/users/{user_id}/workouts", response_model=schemas.WorkoutResponse)
def create_workout(user_id: int, workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_workout(db=db, user_id=user_id, workout=workout)


@app.get("/users/{user_id}/workouts", response_model=List[schemas.WorkoutResponse])
def list_workouts(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_workouts(db, user_id)


@app.post("/users/{user_id}/sleep", response_model=schemas.SleepLogResponse)
def create_sleep_log(user_id: int, sleep_log: schemas.SleepLogCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_sleep_log(db=db, user_id=user_id, sleep_log=sleep_log)


@app.get("/users/{user_id}/sleep", response_model=List[schemas.SleepLogResponse])
def list_sleep_logs(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_sleep_logs(db, user_id)


@app.post("/users/{user_id}/nutrition", response_model=schemas.NutritionLogResponse)
def create_nutrition_log(user_id: int, nutrition_log: schemas.NutritionLogCreate, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_nutrition_log(db=db, user_id=user_id, nutrition_log=nutrition_log)


@app.get("/users/{user_id}/nutrition", response_model=List[schemas.NutritionLogResponse])
def list_nutrition_logs(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_nutrition_logs(db, user_id)


@app.get("/users/{user_id}/dashboard")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    summary = crud.get_dashboard_summary(db, user_id)
    if not summary:
        raise HTTPException(status_code=404, detail="User not found")
    return summary
