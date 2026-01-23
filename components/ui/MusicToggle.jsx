import { useSegments } from "expo-router";
import { Image, Pressable, StyleSheet } from "react-native";
import { useMusicStore } from "../../src/store/musicStore";

const MusicON = require("../../assets/icons/musicON.png");
const MusicOFF = require("../../assets/icons/musicOFF.png");

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
      <Image
        source={enabled ? MusicON : MusicOFF}
        style={styles.musicIcon}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  musicButton: {
    position: "absolute",
    top: 150,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "rgba(135, 135, 135, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  musicIcon: {
    width: 35,
    height: 35,
  },
});
