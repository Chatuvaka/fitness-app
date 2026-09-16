import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from 'lucide-react-native';
import { ActivityIntensity } from '../hooks/usePedometer';

interface StatusIndicatorProps {
  intensity: ActivityIntensity;
}

export function StatusIndicator({ intensity }: StatusIndicatorProps) {
  let color = '#9ca3af'; // Gray for Detenido
  let text = 'Detenido';

  if (intensity === 'Caminando') {
    color = '#10b981'; // Green
    text = 'Caminando';
  } else if (intensity === 'Corriendo') {
    color = '#ef4444'; // Red
    text = 'Corriendo';
  }

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: `${color}20`, borderColor: color }]}>
        <Activity color={color} size={24} style={styles.icon} />
        <Text style={[styles.text, { color }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 2,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
