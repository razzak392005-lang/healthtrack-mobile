import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';

const mockDashboard = {
  user: 'Amina Yusuf',
  greeting: 'Good morning',
  steps: 8420,
  calories: 1950,
  heartRate: 72,
  sleep: 7.4,
  hydration: 2200,
  workout: 'Cardio • 35 min',
  streak: 12,
  goals: [
    { title: 'Daily steps', value: '8,420 / 10,000', color: '#4f46e5' },
    { title: 'Hydration', value: '2.2L / 2.5L', color: '#0ea5e9' },
    { title: 'Sleep', value: '7.4h / 8h', color: '#10b981' },
  ],
  insights: [
    'Recovery is trending upward this week.',
    'Your activity is consistent with your target range.',
    'Sleep quality improved after reducing late-night screen time.',
  ],
};

const API_URL = 'http://10.0.2.2:8000';

export default function App() {
  const [dashboard, setDashboard] = useState(mockDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) {
          throw new Error('API unavailable');
        }

        const publicHealth = await response.json();
        console.log('API online:', publicHealth);

        const userResponse = await fetch(`${API_URL}/users`);
        if (userResponse.ok) {
          const users = await userResponse.json();
          if (users && users.length > 0) {
            const user = users[0];
            setDashboard((current) => ({ ...current, user: user.name }));
          }
        }
      } catch (error) {
        console.log('Using mock data for offline mode:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const weeklyBars = useMemo(
    () => [58, 74, 62, 89, 81, 94, 76],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.subTitle}>{dashboard.greeting}</Text>
            <Text style={styles.title}>{dashboard.user}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>{dashboard.streak}d</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Syncing your wellness data…</Text>
          </View>
        ) : null}

        <View style={styles.metricGrid}>
          <MetricCard label="Steps" value={dashboard.steps.toLocaleString()} accent="#4f46e5" />
          <MetricCard label="Calories" value={`${dashboard.calories}`} accent="#f97316" />
          <MetricCard label="Heart rate" value={`${dashboard.heartRate} bpm`} accent="#ef4444" />
          <MetricCard label="Sleep" value={`${dashboard.sleep}h`} accent="#10b981" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's overview</Text>
          <View style={styles.overviewRow}>
            <View style={styles.smallBadge}>
              <Text style={styles.badgeLabel}>Hydration</Text>
              <Text style={styles.badgeValue}>{dashboard.hydration} ml</Text>
            </View>
            <View style={styles.smallBadge}>
              <Text style={styles.badgeLabel}>Workout</Text>
              <Text style={styles.badgeValue}>{dashboard.workout}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Goal progress</Text>
          {dashboard.goals.map((goal) => (
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
          {dashboard.insights.map((insight, index) => (
            <Text key={index} style={styles.insightItem}>• {insight}</Text>
          ))}
        </View>

        <View style={styles.quickActions}>
          <ActionButton label="Add workout" />
          <ActionButton label="Log sleep" />
          <ActionButton label="Track food" />
        </View>
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

function ActionButton({ label }) {
  return (
    <Pressable style={styles.actionButton}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  streakBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    fontWeight: '700',
    color: '#1d4ed8',
    fontSize: 18,
  },
  loadingBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#334155',
    fontSize: 14,
  },
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
  metricLabel: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallBadge: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    width: '48%',
  },
  badgeLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  badgeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  goalMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  goalTitle: {
    fontSize: 15,
    color: '#334155',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  goalDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
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
  barFill: {
    width: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 12,
  },
  insightItem: {
    fontSize: 15,
    lineHeight: 26,
    color: '#334155',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});
