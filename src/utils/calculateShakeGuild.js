const IDEAL = {
  maxMag: {
    ardembouls: 8,
    brumelins: 5,
    lumivel: 2,
    mecarocks: 1,
  },
  meanMag: {
    ardembouls: 4,
    brumelins: 2.5,
    lumivel: 1.5,
    mecarocks: 1,
  },
  stdDev: {
    ardembouls: 1.0,
    brumelins: 1.5,
    lumivel: 0.3,
    mecarocks: 0.1,
  },
  zeroX: {
    ardembouls: 35,
    brumelins: 60,
    lumivel: 10,
    mecarocks: 3,
  },
};

function proportionalScore(value, ideal) {
  const distance = Math.abs(value - ideal);
  return 1 / (1 + distance); // max = 1, min → 0
}

export function calculateShakeGuild({ maxMag, meanMag, stdDev, zeroX }) {
  const guilds = ["ardembouls", "brumelins", "lumivel", "mecarocks"];

  const scores = {
    ardembouls: 0,
    brumelins: 0,
    lumivel: 0,
    mecarocks: 0,
  };

  function applyMetric(metricName, value) {
    guilds.forEach((g) => {
      const ideal = IDEAL[metricName][g];
      const score = proportionalScore(value, ideal);
      scores[g] += score * 2; 
    });
  }

  applyMetric("maxMag", maxMag);
  applyMetric("meanMag", meanMag);
  applyMetric("stdDev", stdDev);
  applyMetric("zeroX", zeroX);

  console.log("Shake proportional:", scores);
  return scores;
}
