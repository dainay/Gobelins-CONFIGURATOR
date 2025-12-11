import { ANIMATIONS } from "../../constants/Animations";

// Normalize shake metrics to 0-1 range for comparison with ideal profiles
function normalizeMetrics(metrics) {
  return {
    energy: Math.min(metrics.maxMag / 20, 1), // max expected magnitude ~20
    rhythm: Math.min(metrics.zeroX / 100, 1), // max expected zero crossings ~100
    chaos: Math.min(metrics.stdDev / 5, 1), // max expected std dev ~5
    smooth: 1 - Math.min(metrics.stdDev / 5, 1), // smooth is inverse of chaos
    batteryMood: metrics.battery ?? 0.7, // assume 70% if battery not provided
  };
}

function distance(normalized, ideal) {
  return (
    Math.abs(normalized.energy - ideal.energy) +
    Math.abs(normalized.rhythm - ideal.rhythm) +
    Math.abs(normalized.chaos - ideal.chaos) +
    Math.abs(normalized.smooth - ideal.smooth) +
    Math.abs(normalized.batteryMood - ideal.batteryMood)
  );
}

export function chooseAnimation(metrics, batteryLevel) {

    console.log("Choosing animation with metrics:", metrics, "and battery level:", batteryLevel);

  const normalized = normalizeMetrics({ ...metrics, battery: batteryLevel });

  console.log("Normalized metrics:", normalized);

  let bestAnim = null;
  let bestScore = Infinity;

  for (const anim in ANIMATIONS) {
    const score = distance(normalized, ANIMATIONS[anim].ideal);

    if (score < bestScore) {
      bestScore = score;
      bestAnim = anim;
    }
  }

  console.log("Animation scores:", Object.keys(ANIMATIONS).map(anim => ({ id: anim, score: distance(normalized, ANIMATIONS[anim].ideal) })));
  console.log("Best animation:", bestAnim, "->", ANIMATIONS[bestAnim].animName);
  
  return bestAnim;
}
