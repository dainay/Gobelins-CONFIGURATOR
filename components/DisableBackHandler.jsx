import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function DisableBackHandler() {
  useEffect(() => {
    const handler = () => true; // disables back button globally
    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, []);
  return null;
}
