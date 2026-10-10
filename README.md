# HealthTrack Mobile

A biomedical fitness and health tracking mobile application built with React Native + Expo, plus a FastAPI backend for health metrics and dashboard analytics.

Features
- User profile and health dashboard
- Activity and step tracking
- Workout logging
- Sleep and recovery analytics
- Nutrition and hydration tracking
- Goal tracking
- Personalized wellness insights
- API-backed architecture ready for real device integration

Tech stack
- Mobile: React Native + Expo
- Backend: FastAPI + SQLAlchemy + SQLite
- Database: SQLite for MVP

Project structure
- mobile/ — React Native app
- backend/ — FastAPI backend API

Quick start

1. Backend
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. Mobile app
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

   For Android emulator, use the default API URL in the app: http://10.0.2.2:8000
   For a physical device, replace it with your machine's local IP address.

Project goals
- Support wellness tracking and health monitoring
- Encourage habit consistency and long-term fitness progress
- Provide a foundation for future wearable integration and AI-powered coaching

License
MIT
