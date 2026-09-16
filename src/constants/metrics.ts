export const METRICS = {
  // Stride length in meters
  STRIDE_LENGTH: {
    WALKING: 0.75,
    RUNNING: 1.0,
  },
  // Cadence thresholds (steps per minute)
  CADENCE: {
    RUNNING_THRESHOLD: 120, // > 120 is running
    WALKING_MIN_THRESHOLD: 20, // > 20 is walking (below is considered stopped/noise)
  },
  // Accelerometer thresholds
  ACCELEROMETER: {
    UPDATE_INTERVAL_MS: 100, // 10 updates per second
    // The base gravity is ~1.0g (9.8 m/s^2), so we look for peaks above it.
    // Magnitude = sqrt(x^2 + y^2 + z^2)
    PEAK_THRESHOLD: 1.15, // Threshold to detect a step (in g's)
  },
  // Time windows
  WINDOWS: {
    CADENCE_WINDOW_MS: 5000, // 5 seconds window to calculate cadence
  },
};
