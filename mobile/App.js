import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';

const userProfile = {
  name: 'Amina Yusuf',
  age: 29,
  height: '168 cm',
  weight: '62 kg',
  bmi: '22.0',
  streak: 12,
};

const initialGoals = [
  { title: 'Daily steps', value: '8,420 / 10,000', color: '#4f46e5', unit: 'steps' },
  { title: 'Hydration', value: '2.2L / 2.5L', color: '#0ea5e9', unit: 'water' },
  { title: 'Sleep', value: '7.4h / 8h', color: '#10b981', unit: 'hours' },
];

const initialWorkoutLog = [
  { title: 'Cardio', duration: '35 min', calories: 420 },
  { title: 'Strength', duration: '25 min', calories: 280 },
  { title: 'Yoga', duration: '20 min', calories: 180 },
];

const initialNutrition = [
  { title: 'Breakfast', value: 'Oats + berries' },
  { title: 'Lunch', value: 'Grilled chicken salad' },
  { title: 'Snack', value: 'Greek yogurt' },
];

const initialSleep = [
  { title: 'Last night', value: '7.4h • Quality 86%' },
  { title: 'Recovery', value: 'On track' },
  { title: 'Trend', value: '+12% week over week' },
];

const API_URL = 'http://10.0.2.2:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(userProfile);
  const [goals, setGoals] = useState(initialGoals);
  const [workouts, setWorkouts] = useState(initialWorkoutLog);
  const [nutrition, setNutrition] = useState(initialNutrition);
  const [sleep, setSleep] = useState(initialSleep);
  const [steps, setSteps] = useState(8420);
  const [hydration, setHydration] = useState(2200);
  const [heartRate, setHeartRate] = useState(72);
  const [sleepHours, setSleepHours] = useState(7.4);
  const [newGoal, setNewGoal] = useState('');
  const [newWorkout, setNewWorkout] = useState('');
  const [newFood, setNewFood] = useState('');

  const weeklyBars = useMemo(() => [58, 74, 62, 89, 81, 94, 76], []);

  React.useEffect(() => {
    const load = async () => {
      try {
        const healthResponse = await fetch(`${API_URL}/health`);
        if (healthResponse.ok) {
          const status = await healthResponse.json();
          console.log('Backend status:', status);
        }

        const usersResponse = await fetch(`${API_URL}/users`);
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          if (users && users.length > 0) {
            const firstUser = users[0];
            setUser((current) => ({ ...current, name: firstUser.name }));
          }
        }
      } catch (error) {
        console.log('Using demo mode:', error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals((current) => [
      ...current,
      { title: newGoal, value: 'In progress', color: '#f59e0b', unit: 'goal' },
    ]);
    setNewGoal('');
  };

  const addWorkout = () => {
    if (!newWorkout.trim()) return;
    const entry = { title: newWorkout, duration: '20 min', calories: 220 };
    setWorkouts((current) => [entry, ...current]);
    setNewWorkout('');
  };

  const addFood = () => {
    if (!newFood.trim()) return;
    setNutrition((current) => [{ title: 'Meal log', value: newFood }, ...current]);
    setNewFood('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <View>
            <View style={styles.metricGrid}>
              <MetricCard label="Steps" value={steps.toLocaleString()} accent="#4f46e5" />
              <MetricCard label="Calories" value="1950" accent="#f97316" />
              <MetricCard label="Heart rate" value={`${heartRate} bpm`} accent="#ef4444" />
              <MetricCard label="Sleep" value={`${sleepHours}h`} accent="#10b981" />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Today</Text>
              <View style={styles.overviewRow}>
                <View style={styles.smallBadge}>
                  <Text style={styles.badgeLabel}>Hydration</Text>
                  <Text style={styles.badgeValue}>{hydration} ml</Text>
                </View>
                <View style={styles.smallBadge}>
                  <Text style={styles.badgeLabel}>Workout</Text>
                  <Text style={styles.badgeValue}>Cardio • 35 min</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Goal progress</Text>
              {goals.map((goal) => (
                <View key={goal.title} style={styles.goalRow}>
                  <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
                  <View style={styles.goalMeta}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalValue}>{goal.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weekly recovery</Text>
              <View style={styles.chartRow}>
                {weeklyBars.map((height, index) => (
                  <View key={index} style={styles.barWrap}>
                    <View style={[styles.barFill, { height: `${height}%` }]} />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Health insights</Text>
              <Text style={styles.insightItem}>• Recovery is trending up this week.</Text>
              <Text style={styles.insightItem}>• Your nutrition and sleep remain consistent.</Text>
              <Text style={styles.insightItem}>• Daily movement is within a healthy range.</Text>
            </View>
          </View>
        );
      case 'Activity':
        return (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Workout history</Text>
              {workouts.map((item, index) => (
                <View key={`${item.title}-${index}`} style={styles.listItem}>
                  <View>
                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listSubtitle}>{item.duration}</Text>
                  </View>
                  <Text style={styles.listTag}>{item.calories} kcal</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Log workout</Text>
              <TextInput
                placeholder="Workout name"
                value={newWorkout}
                onChangeText={setNewWorkout}
                style={styles.input}
              />
              <Pressable style={styles.primaryButton} onPress={addWorkout}>
                <Text style={styles.primaryButtonText}>Save workout</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'Sleep':
        return (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sleep overview</Text>
              {sleep.map((entry, index) => (
                <View key={`${entry.title}-${index}`} style={styles.listItem}>
                  <Text style={styles.listTitle}>{entry.title}</Text>
                  <Text style={styles.listSubtitle}>{entry.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick checks</Text>
              <TextInput
                placeholder="Sleep hours"
                keyboardType="numeric"
                value={String(sleepHours)}
                onChangeText={(value) => setSleepHours(Number(value) || 0)}
                style={styles.input}
              />
              <TextInput
                placeholder="Resting heart rate"
                keyboardType="numeric"
                value={String(heartRate)}
                onChangeText={(value) => setHeartRate(Number(value) || 0)}
                style={styles.input}
              />
            </View>
          </View>
        );
      case 'Nutrition':
        return (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Meals</Text>
              {nutrition.map((item, index) => (
                <View key={`${item.title}-${index}`} style={styles.listItem}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listSubtitle}>{item.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Log meal</Text>
              <TextInput
                placeholder="Enter meal or food item"
                value={newFood}
                onChangeText={setNewFood}
                style={styles.input}
              />
              <Pressable style={styles.primaryButton} onPress={addFood}>
                <Text style={styles.primaryButtonText}>Save meal</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'Goals':
        return (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal goals</Text>
              {goals.map((goal) => (
                <View key={goal.title} style={styles.goalRow}>
                  <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
                  <View style={styles.goalMeta}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalValue}>{goal.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add goal</Text>
              <TextInput
                placeholder="New goal"
                value={newGoal}
                onChangeText={setNewGoal}
                style={styles.input}
              />
              <Pressable style={styles.primaryButton} onPress={addGoal}>
                <Text style={styles.primaryButtonText}>Add goal</Text>
              </Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.subTitle}>Good morning</Text>
            <Text style={styles.title}>{user.name}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{user.streak}d</Text>
          </View>
        </View>

        <View style={styles.profileRow}>
          <Text style={styles.profileText}>Age {user.age}</Text>
          <Text style={styles.profileText}>BMI {user.bmi}</Text>
          <Text style={styles.profileText}>{user.height}</Text>
          <Text style={styles.profileText}>{user.weight}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Syncing wellness data…</Text>
          </View>
        ) : null}

        <View style={styles.tabBar}>
          {['Dashboard', 'Activity', 'Sleep', 'Nutrition', 'Goals'].map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <View style={[styles.metricCard, { borderTopColor: accent }]}> 
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eff6ff' },
  container: { padding: 18, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subTitle: { fontSize: 14, color: '#64748b' },
  title: { fontSize: 30, fontWeight: '700', color: '#0f172a' },
  streakBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: { fontWeight: '700', color: '#1d4ed8', fontSize: 18 },
  profileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  profileText: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    color: '#334155',
    marginRight: 6,
    marginBottom: 6,
  },
  loadingBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: { marginLeft: 10, color: '#334155', fontSize: 14 },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  tabButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tabButtonActive: { backgroundColor: '#1d4ed8' },
  tabText: { color: '#0f172a', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#ffffff' },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderTopWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  metricLabel: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  metricValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  smallBadge: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, width: '48%' },
  badgeLabel: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  badgeValue: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  goalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  goalMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  goalTitle: { fontSize: 15, color: '#334155' },
  goalValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  goalDot: { width: 12, height: 12, borderRadius: 999 },
  chartRow: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  barWrap: {
    width: 26,
    height: 100,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', backgroundColor: '#22c55e', borderRadius: 12 },
  insightItem: { fontSize: 15, lineHeight: 26, color: '#334155' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  listSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  listTag: { fontSize: 13, color: '#1d4ed8', fontWeight: '700' },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
