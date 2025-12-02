const BATTERY_IDEAL = {
  ardembouls: 0.60,
  brumelins: 0.40,
  lumivel: 0.25,
  mecarocks: 0.85,
};

export function calculateSensorGuild({ battery, theme }) {
  const scores = {
    ardembouls: 0,
    brumelins: 0,
    lumivel: 0,
    mecarocks: 0,
  };

  // --- BATTERY ---
  if (battery !== -1) {
    for (const guild in BATTERY_IDEAL) {
      const ideal = BATTERY_IDEAL[guild];

      const diff = Math.abs(battery - ideal); // 0 → perfect, 1 → worst
      const batteryScore = 1 - diff;          // 1 → perfect match

      scores[guild] += Math.max(0, batteryScore); // keep 0–1 range
    }
  }

  // --- THEME ---
  if (theme === "light") {
    scores.ardembouls += 0.5;
    scores.brumelins += 0.5;
  } else if (theme === "dark") {
    scores.lumivel += 0.5;
    scores.mecarocks += 0.5;
  }

  return scores;
}
