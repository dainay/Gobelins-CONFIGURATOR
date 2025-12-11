// -------------------------------------------------------
// Normalisation (shake + battery)
// -------------------------------------------------------

export function buildUserProfile(metrics, battery) {
  // metrics = { maxMag, meanMag, stdDev, zeroX }

  return {
    maxMag: metrics.maxMag,
    meanMag: metrics.meanMag,
    stdDev: metrics.stdDev,
    zeroX: metrics.zeroX,

    battery: battery !== undefined ? battery : 0.7, 
  };
}
