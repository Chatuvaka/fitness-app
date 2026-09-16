import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  Icon?: LucideIcon;
  color?: string;
}

export function MetricCard({ title, value, unit, Icon, color = '#3b82f6' }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {Icon && <Icon size={20} color={color} style={styles.icon} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  unit: {
    color: '#9ca3af',
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
});
