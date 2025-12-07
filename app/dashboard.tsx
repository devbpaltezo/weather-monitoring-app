import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from './firebase/config';

import RenderForecast from './components/forecast';
import GridItem from './components/gridItem';

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

interface DatabaseRecord {
  id: string;
  title?: string;
  timestamp?: {
    seconds: number;
  };
}

function formatToUTC8(ts: any) {

  if (!ts) return '';

  // Step 1: convert Firestore timestamp to JS Date
  const date = new Date(ts.seconds * 1000);

  // Step 2: convert to UTC+8
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const utc8 = new Date(utc + 8 * 60 * 60 * 1000);

  console.log(date, utc, utc8)

  // Step 3: convert to readable string
  return utc8.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function DashboardScreen() {

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const timestamp = new Date().toLocaleString();
  const [showJson, setShowJson] = useState(false);

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

      } else {
        console.log("No weather records found");
      }
      setLoading(false);
      console.log('Timestamp:', weather?.timestamp);
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
          Data Source: {weather?.timestamp ? formatToUTC8(weather.timestamp) : ''}
        </Text>

        <View style={styles.mainCard}>
          <Text style={styles.city}>Weather Monitoring</Text>

          <RenderForecast
            tempCel={weather?.temperature_celsius ?? ''}
            status={weather?.rain_status ?? ''}
          />

          <View style={gridStyles.container}>            
            <GridItem
              icon="🌡️"
              value={weather?.heat_index ?? '--'}
              units={[]}
              defaultUnit='°'
              label="Heat Index"
            /> 
            <GridItem
              icon="🧭"
              value={weather?.pressure_hpa ?? '--'}
              units={[]}
              defaultUnit=''
              label="Pressure"
            />           
            <GridItem
              icon="🏔️"
              value={weather?.altitude_meters ?? '--'}
              units={[]}
              defaultUnit=' m'
              label="Altitude"
            />
          </View>

          <View style={gridStyles.container}>
            <GridItem
              icon="💧"
              value={weather?.humidity ?? '--'}
              units={[]}
              defaultUnit='%'
              label="Humidity"
            />
            <GridItem
              icon="💨"
              value={typeof weather?.wind_speed_kmh === 'number' ? weather.wind_speed_kmh : 0}
              units={['km/h', 'mph', 'm/s']}
              defaultUnit='km/h'
              label="Wind"
            />
            <GridItem
              icon="🌧️"
              value={weather?.rain_voltage ?? '--'}
              units={[]}
              defaultUnit="%"
              label="Rain"
            />
          </View>

        </View>

        {/* ------------------- JSON Dropdown Section ------------------- */}
        <View style={styles.jsonDropdownContainer}>
          <TouchableOpacity
            onPress={() => setShowJson(prev => !prev)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showJson ? 'hide' : 'more info'}
            </Text>
          </TouchableOpacity>

          {showJson && (
            <View style={styles.jsonSection}>
              <Text style={styles.jsonText}>
                {weather ? JSON.stringify(weather, null, 2) : 'No data available'}
              </Text>
            </View>
          )}
          <View style={{ height: 100 }}></View>

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
  jsonDropdownContainer: { marginHorizontal: 20, marginBottom: 30 },
  toggleButton: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  toggleButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },

  jsonSection: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
  },
  jsonText: {
    fontFamily: 'Courier', // monospaced for readability
    fontSize: 12,
    color: '#333',
  },
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
    padding: 4,
    marginVertical: 12
  },
  icon: {
    fontSize: 24,
  },
  value: {
    ...textStyle.bold,
    fontSize: 18,
    color: '#3c3c3cff'
  },
  label: {
    ...textStyle.regular,
    fontSize: 13,
    color: '#555',
  }
})