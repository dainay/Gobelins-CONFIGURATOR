import { ANIMATIONS } from "../../constants/Animations";
import { normalizeMetrics } from "./normalizeMetrics";
import { distance } from "./distance";

export function chooseAnimation(metrics, batteryLevel) {
  const normalized = normalizeMetrics(metrics, batteryLevel);

  let bestAnim = null;
  let bestScore = Infinity;

  const scores = [];

  for (const id in ANIMATIONS) {
    const score = distance(normalized, ANIMATIONS[id].ideal);
    scores.push({ id, score });

    if (score < bestScore) {
      bestScore = score;
      bestAnim = id;
    }
  }

  console.log("Normalized:", normalized);
  console.log("Scores:", scores.sort((a, b) => a.score - b.score));
  console.log("Best:", bestAnim);

  return bestAnim;
}
