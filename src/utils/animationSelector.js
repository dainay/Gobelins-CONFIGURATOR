// Normalize shake metrics to 0-1 range for comparison with ideal profiles

const MAX_MAG_REAL = 13;
const MAX_STD_REAL = 3.2;
const MAX_ZEROX_REAL = 80;

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

export function normalizeMetrics(metrics, batteryLevel = 0.7) {
  return {
    energy: clamp(metrics.maxMag / MAX_MAG_REAL),
    rhythm: clamp(metrics.zeroX / MAX_ZEROX_REAL),
    chaos: clamp(metrics.stdDev / MAX_STD_REAL),
    batteryMood: clamp(batteryLevel),
  };
}

const WEIGHTS = {
  energy: 2.0,       
  rhythm: 1.2,
  chaos: 1.0,
  batteryMood: 0.4,
};

export function distance(user, ideal) {
  return (
    WEIGHTS.energy * Math.abs(user.energy - ideal.energy) +
    WEIGHTS.rhythm * Math.abs(user.rhythm - ideal.rhythm) +
    WEIGHTS.chaos * Math.abs(user.chaos - ideal.chaos) +
    WEIGHTS.batteryMood * Math.abs(user.batteryMood - ideal.batteryMood)
  );
}

