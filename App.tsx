import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Footprints, Route, Play, Square, RotateCcw } from 'lucide-react-native';
import { usePedometer } from './src/hooks/usePedometer';
import { MetricCard } from './src/components/MetricCard';
import { StatusIndicator } from './src/components/StatusIndicator';

export default function App() {
  const { steps, distance, intensity, isActive, hasPermission, startSession, stopSession, resetSession } = usePedometer();

  // Format distance based on value
  const formattedDistance = distance > 1000 
    ? (distance / 1000).toFixed(2) 
    : Math.floor(distance).toString();
  
  const distanceUnit = distance > 1000 ? 'km' : 'm';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Fitness Tracker</Text>

        {hasPermission === false && (
          <View style={styles.permissionWarning}>
            <Text style={styles.permissionText}>Se requieren permisos de movimiento para funcionar.</Text>
          </View>
        )}

        <View style={styles.metricsContainer}>
          <MetricCard 
            title="Pasos" 
            value={steps} 
            Icon={Footprints}
            color="#3b82f6" // blue
          />
          <MetricCard 
            title="Distancia" 
            value={formattedDistance} 
            unit={distanceUnit}
            Icon={Route}
            color="#8b5cf6" // purple
          />
        </View>

        <StatusIndicator intensity={intensity} />

        <View style={styles.controls}>
          {!isActive ? (
            <TouchableOpacity 
              style={[styles.button, styles.startButton]} 
              onPress={startSession}
              activeOpacity={0.8}
            >
              <Play color="#fff" size={24} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.stopButton]} 
              onPress={stopSession}
              activeOpacity={0.8}
            >
              <Square color="#fff" size={24} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Detener</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={resetSession}
            activeOpacity={0.8}
          >
            <RotateCcw color="#9ca3af" size={24} style={styles.buttonIcon} />
            <Text style={styles.resetText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // dark background
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    marginTop: 20,
    letterSpacing: 1,
  },
  permissionWarning: {
    backgroundColor: '#ef444430',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  permissionText: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  controls: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 16,
    borderRadius: 100,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#10b981', // green
  },
  stopButton: {
    backgroundColor: '#ef4444', // red
  },
  resetButton: {
    backgroundColor: '#374151', // gray
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  resetText: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
