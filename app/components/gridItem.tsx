import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GridItemProps {
  icon: string;
  value: number | string;
  units: string[]; // array of units to toggle
  defaultUnit: string; // default static unit
  label: string;
}

const GridItem = ({ icon, value, units, defaultUnit, label }: GridItemProps) => {

  const [unitIndex, setUnitIndex] = useState(0);

  // get current unit
  const unit = units.length > 0 ? units[unitIndex] : defaultUnit;

  // convert value based on unit if needed
  let displayValue = value;

  if (typeof value === 'number') {
    if (unit === 'mph') displayValue = (value * 0.621371).toFixed(1);
    else if (unit === 'm/s') displayValue = (value / 3.6).toFixed(1);
    else displayValue = value.toFixed(1); // km/h
  }

  // handle click
  const handlePress = () => {
    setUnitIndex((unitIndex + 1) % units.length);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.icon}>{icon}</Text>      
      <Text style={styles.value}>
        {displayValue}{units.length == 0 ? 
          <Text style={{ ...styles.unit, fontSize: 16 }}>{unit}</Text> : 
          <Text style={{ ...styles.unit }}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default GridItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  icon: { fontSize: 24, marginBottom: 5 },
  value: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 12, color: '#555' },
  unit: {
    fontFamily: 'Poppins-Regular', fontSize: 9, fontWeight: '300'
  }
});
