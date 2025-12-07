import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RenderForecast = ({
  tempCel,
  status,
  tempFar, // optional prop if you already have it
}: {
  tempCel?: string | number;
  status: string;
  tempFar?: number;
}) => {
  // state to toggle temperature unit
  const [isCelsius, setIsCelsius] = useState(true);

  // calculate Fahrenheit if needed
  const tempF = tempFar ?? (typeof tempCel === 'number' ? (tempCel * 9) / 5 + 32 : '--');

  // determine which value and symbol to show
  const displayValue = isCelsius ? tempCel ?? '--' : tempF ?? '--';
  const symbol = isCelsius ? '°C' : '°F';

  // choose icon based on rain status
  let icon = <Text style={{ fontSize: 35, paddingBottom: 20 }}>🌤️</Text>;
  if (status === 'moderate') {
    icon = <Text style={{ fontSize: 35, paddingBottom: 20 }}>🌦️</Text>;
  } else if (status === 'heavy') {
    icon = <Text style={styles.icon}>🌧️☔</Text>;
  }

  return (
    <View style={{ marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
      {/* Temperature Display - Clickable */}
      <TouchableOpacity onPress={() => setIsCelsius(prev => !prev)}>
        <Text style={styles.temp}>{displayValue}{symbol}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Temperature</Text>

      <View style={{ height: 15 }} />

      {/* Rain Status */}
      <Text style={styles.condition}>
        {icon} {status ?? 'Loading...'}
      </Text>
      <Text style={styles.label}>Rain Forecast</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  temp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0d006bff'
  },
  condition: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#666'
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#555',
  },
  icon: { fontSize: 35, paddingBottom: 20 }
})

export default RenderForecast;
