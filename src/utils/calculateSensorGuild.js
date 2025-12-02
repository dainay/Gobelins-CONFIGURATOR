const BATTERY_IDEAL = {
  ardembouls: 0.82,
  brumelins: 0.67,
  lumivel: 0.45,
  mecarocks: 0.90,
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

      const diff = Math.abs(battery - ideal);
      const batteryScore = 1 / (1 + diff * 2);  

      scores[guild] += batteryScore * 1.5; 
    }
  }

  // --- THEME ---
  if (theme === "light") {
    scores.ardembouls += 0.75;
    scores.brumelins += 0.75;
  } else if (theme === "dark") {
    scores.lumivel += 0.75;
    scores.mecarocks += 0.75;
  }

  return scores;
}
