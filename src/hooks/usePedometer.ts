import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { METRICS } from '../constants/metrics';

export type ActivityIntensity = 'Caminando' | 'Corriendo' | 'Detenido';

interface PedometerState {
  steps: number;
  distance: number; // in meters
  intensity: ActivityIntensity;
  isActive: boolean;
}

export function usePedometer() {
  const [state, setState] = useState<PedometerState>({
    steps: 0,
    distance: 0,
    intensity: 'Detenido',
    isActive: false,
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Refs for tracking values across renders without triggering re-renders
  const stepTimestamps = useRef<number[]>([]);
  const lastMagnitude = useRef<number>(1);
  const isPeak = useRef<boolean>(false);
  const appState = useRef(AppState.currentState);

  const startSession = useCallback(async () => {
    const { status } = await Accelerometer.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status !== 'granted') {
      return;
    }

    Accelerometer.setUpdateInterval(METRICS.ACCELEROMETER.UPDATE_INTERVAL_MS);
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const stopSession = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false, intensity: 'Detenido' }));
  }, []);

  const resetSession = useCallback(() => {
    setState({
      steps: 0,
      distance: 0,
      intensity: 'Detenido',
      isActive: false,
    });
    stepTimestamps.current = [];
  }, []);

  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    if (state.isActive && appState.current === 'active') {
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        
        // Calculate magnitude of the acceleration vector
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        
        // Simple peak detection
        const delta = magnitude - lastMagnitude.current;
        lastMagnitude.current = magnitude;
        
        if (magnitude > METRICS.ACCELEROMETER.PEAK_THRESHOLD && delta > 0) {
          isPeak.current = true;
        } else if (magnitude < METRICS.ACCELEROMETER.PEAK_THRESHOLD && isPeak.current) {
          // Peak has ended, count a step
          isPeak.current = false;
          
          const now = Date.now();
          stepTimestamps.current.push(now);
          
          // Keep only timestamps within the cadence window
          const cutoffTime = now - METRICS.WINDOWS.CADENCE_WINDOW_MS;
          stepTimestamps.current = stepTimestamps.current.filter(t => t > cutoffTime);
          
          // Calculate cadence (steps per minute)
          const stepsInWindow = stepTimestamps.current.length;
          // Extrapolate to per minute based on window size
          const cadence = (stepsInWindow * 60000) / METRICS.WINDOWS.CADENCE_WINDOW_MS;
          
          let currentIntensity: ActivityIntensity = 'Detenido';
          let strideLength = 0;
          
          if (cadence > METRICS.CADENCE.RUNNING_THRESHOLD) {
            currentIntensity = 'Corriendo';
            strideLength = METRICS.STRIDE_LENGTH.RUNNING;
          } else if (cadence > METRICS.CADENCE.WALKING_MIN_THRESHOLD) {
            currentIntensity = 'Caminando';
            strideLength = METRICS.STRIDE_LENGTH.WALKING;
          }
          
          setState(prev => ({
            ...prev,
            steps: prev.steps + 1,
            distance: prev.distance + strideLength,
            intensity: currentIntensity,
          }));
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [state.isActive]);

  // Handle AppState changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      // We rely on the AppState value within the effect dependency to restart/stop listener
      // Trigger a re-render to evaluate the accelerometer subscription effect
      setState(prev => ({ ...prev })); 
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    ...state,
    hasPermission,
    startSession,
    stopSession,
    resetSession,
  };
}
