import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from './firebase/config';

interface WeatherData {
  humidity?: number;
  pressure?: number;
  rain?: string;
  pressure_hpa?: string;
  altitude_meters?: string;
  battery_voltage?: string;
  heat_index: string;
  rain_adc: number;
  rain_status: string;
  rain_voltage: string;
  temperature_celsius: string;
  temperature_fahrenheit: string;
  temperature?: number;
  wind?: number;
  wind_speed_kmh: number;
  wind_speed_mph: number;
  wind_speed_ms: number;
  condition: string;
  timestamp: {
    seconds: number;
  };
}

const RenderForecast = ({ Value, status }: { Value?: string | number; status: string }) => {

  let icon = <Text style={{ fontSize: 35, paddingBottom: 20 }}>🌤️</Text>

  if(status == "moderate") {
    icon = <Text style={{ fontSize: 35, paddingBottom: 20 }}>🌦️</Text>
  }else if(status == "heavy"){
    icon = <Text style={{ fontSize: 35, paddingBottom: 20 }}>🌧️☔</Text>
  }

  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <Text style={styles.temp}>{Value ?? '--'}°</Text>
      <Text style={gridStyles.label}>Temperature</Text>
      <View style={{ height: 15 }}></View>
      <Text style={styles.condition}> {icon} {status ?? 'Loading...'}</Text>
      <Text style={gridStyles.label}>Rain Forecast</Text>
    </View>
  )
}

export default function DashboardScreen() {

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    // Firestore query: get latest weather record
    const q = query(
      collection(db, "weather_data"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    // Realtime listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setWeather(snapshot.docs[0].data() as WeatherData);
        console.log(snapshot.docs[0].data());
        console.log('Timestamp:', weather?.timestamp);
      } else {
        console.log("No weather records found");
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
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
    <LinearGradient colors={['#eef2ff', '#ffffff']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Sual NHS</Text>
        <Text style={styles.date}>
          Data Source: {weather?.timestamp
            ? new Date(weather.timestamp.seconds * 1000).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            : ''}
        </Text>


        <View style={styles.mainCard}>
          <Text style={styles.city}>Weather Monitoring</Text>

          <RenderForecast
            Value={weather?.temperature_celsius ?? ''}
            status={weather?.rain_status ?? ''}
          />

          <View style={gridStyles.container}>
            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>🌡️</Text>
              <Text style={gridStyles.value}>{weather?.heat_index ?? '--'}°</Text>
              <Text style={gridStyles.label}>Heat Index</Text>
            </View>
            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>🧭</Text>
              <Text style={gridStyles.value}>{weather?.pressure_hpa ?? '--'}</Text>
              <Text style={gridStyles.label}>Pressure</Text>
            </View>
            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>🏔️</Text>
              <Text style={gridStyles.value}>{weather?.altitude_meters ?? '--'} m</Text>
              <Text style={gridStyles.label}>Altitude</Text>
            </View>

            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>💧</Text>
              <Text style={gridStyles.value}>{weather?.humidity ?? '--'}%</Text>
              <Text style={gridStyles.label}>Humidity</Text>
            </View>
            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>💨</Text>
              <Text style={gridStyles.value}>{weather?.wind_speed_kmh ?? '--'} km/h</Text>
              <Text style={gridStyles.label}>Wind</Text>
            </View>
            <View style={[gridStyles.cell, { backgroundColor: '#fff' }]}>
              <Text style={gridStyles.icon}>🌧️</Text>
              <Text style={gridStyles.value}>{weather?.rain_voltage ?? '--'}%</Text>
              <Text style={gridStyles.label}>Rain</Text>
            </View>
          </View>

        </View>

      </ScrollView>
    </LinearGradient>
  );

}

const textStyle = StyleSheet.create({
  regular: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal'
  },
  bold: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    ...textStyle.bold,
    fontSize: 26,
    paddingTop: 20,
    color: '#555'
  },
  date: {
    ...textStyle.regular,
    color: '#777',
    marginBottom: 20
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  city: {
    ...textStyle.regular,
    fontSize: 20,
    color: '#444'
  },
  temp: {
    ...textStyle.regular,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0d006bff'
  },
  condition: {
    ...textStyle.regular,
    fontSize: 18,
    color: '#666'
  },
  weatherIcon: {
    ...textStyle.regular,
    width: 120,
    height: 120,
    marginVertical: 10
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  statBox: {
    flex: 1,
  },
  statIcon: {
    fontSize: 30
  },
  statText: {
    ...textStyle.regular,
    fontSize: 22,
    fontWeight: '600'
  }
});

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 12,
  },
  cell: {
    width: '33.33%', // 3 columns
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12
  },
  icon: {
    fontSize: 24,
  },
  value: {
    ...textStyle.bold,
    fontSize: 20,
    color: '#3c3c3cff'
  },
  label: {
    ...textStyle.regular,
    fontSize: 13,
    color: '#555',
  }
})