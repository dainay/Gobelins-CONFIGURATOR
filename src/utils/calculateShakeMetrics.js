export function calculateShakeMetrics(samples, zeroCrossings) {
  if (!samples || samples.length === 0) {
    return {
      maxMag: 0,
      meanMag: 0,
      zeroX: zeroCrossings ?? 0,
      stdDev: 0,
    };
  }

  const maxMag = Math.max(...samples);
  const meanMag = samples.reduce((a, b) => a + b, 0) / samples.length;

  const variance = samples.reduce((sum, v) => sum + Math.pow(v - meanMag, 2), 0) / samples.length;
  const stdDev = Math.sqrt(variance);
  
  console.log('maxMAg:', maxMag, 'meanMag:', meanMag, 'stdDev:', stdDev, 'zeroCrossings:', zeroCrossings);

  return {
    maxMag,
    meanMag,
    zeroX: zeroCrossings,
    stdDev,
  };
}
