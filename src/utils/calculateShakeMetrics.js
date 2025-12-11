export function calculateShakeMetrics(samples, zeroCrossings) {
  if (!samples || samples.length === 0) {
    return {
      maxMag: 0,
      meanMag: 0,
      stdDev: 0,
      zeroX: zeroCrossings ?? 0,
    };
  }

  console.log("Calculating shake metrics for samples:", samples);

  const maxMag = Math.max(...samples);

  const meanMag =
    samples.reduce((a, b) => a + b, 0) / samples.length;

  let variance = 0;
  for (let i = 0; i < samples.length; i++) {
    const diff = samples[i] - meanMag;
    variance += diff * diff;
  }
  variance /= samples.length;

  const stdDev = Math.sqrt(variance);

  return {
    maxMag,
    meanMag,
    stdDev,
    zeroX: zeroCrossings ?? 0,
  };
}
