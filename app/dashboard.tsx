import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebase/config';

interface WeatherData {
  humidity?: number;
  pressure?: number;
  rain?: string;
  temperature?: number;
  wind?: number;
}

export default function DashboardScreen() {

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    const db = getDatabase(app);
    const weatherRef = ref(db, 'weather_data');

    const unsubscribe = onValue(weatherRef, (snapshot) => {
      console.log(snapshot);
      const data = snapshot.val();
      const keys = Object.keys(data);
      const latestKey = keys[keys.length - 1];  // last pushed item
      setWeather(data[latestKey]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#6dd5fa', '#2980b9']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#6dd5fa', '#2980b9']} style={styles.container}>
      <Text style={styles.title}>🌤️ Weather Dashboard</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🌧️ Humidity</Text>
        <Text style={styles.value}>{weather?.humidity ?? '--'}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📉 Pressure</Text>
        <Text style={styles.value}>{weather?.pressure ?? '--'} hPa</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌦️ Rain</Text>
        <Text style={styles.value}>{weather?.rain ?? '--'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🌡️ Temperature</Text>
        <Text style={styles.value}>{weather?.temperature ?? '--'}°C</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>💨 Wind</Text>
        <Text style={styles.value}>{weather?.wind ?? '--'} km/h</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 5,
    marginTop: 20,
  },
  timestamp: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: '#444',
    fontWeight: '600',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#222',
  },
});
