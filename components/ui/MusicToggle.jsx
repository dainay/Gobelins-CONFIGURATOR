import { useSegments } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useMusicStore } from "../../src/store/musicStore";
import ThemedText from "./ThemedText";

export default function MusicToggle({ style }) {
  const segments = useSegments();
  const group = segments[0]; // "(auth)", "(intro)", "(dashboard)", etc.

  const enabled = useMusicStore((s) => s.enabled);
  const toggleMusic = useMusicStore((s) => s.toggleMusic);

  if (group === "(intro)") return null;

  return (
    <Pressable
      style={[styles.musicButton, style]}
      onPress={toggleMusic}
      accessibilityLabel={enabled ? "Mute music" : "Play music"}
      accessibilityRole="button"
    >
      <ThemedText style={styles.musicText}>{enabled ? "🎵" : "🔇"}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  musicButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  musicText: {
    fontSize: 26,
    lineHeight: 26,
  },
});
