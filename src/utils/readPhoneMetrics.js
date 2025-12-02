import * as Battery from "expo-battery"; 
import { Appearance } from "react-native";

export async function readPhoneMetrics() {

  // battery level: 0–1
  let batteryLevel = -1;
  try {
    const level = await Battery.getBatteryLevelAsync();
    if (typeof level === "number") {
      batteryLevel = level;
    }
  } catch (e) {
    console.log("Battery error:", e);
  }
 
  // theme: "light" | "dark" | null
  const theme = Appearance.getColorScheme() || -1;

  console.log("Read phone metrics:", {
    battery: batteryLevel, 
    theme,
  });

  return {
    battery: batteryLevel, 
    theme,
  };
}
