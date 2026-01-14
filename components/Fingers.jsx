import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function Fingers({ onHandDetected }) {
  const MIN_TOUCHES = 2;      // Чётко столько пальцев нужно
  const HOLD_TIME = 2500;     // Время удержания

  const [detected, setDetected] = useState(false);
  const [isShining, setIsShining] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(null);

  const timerRef = useRef(null);
  const shineAnim = useRef(new Animated.Value(0)).current;

  // ---------------- Glow animation ----------------
  const startShine = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopShine = () => {
    shineAnim.stopAnimation();
    shineAnim.setValue(0);
  };

  // ---------------- Timer logic ----------------
  const startHoldTimer = () => {
    timerRef.current = setTimeout(() => {
      setDetected(true);
      onHandDetected && onHandDetected();
    }, HOLD_TIME);
  };

  const cancelHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDetected(false);
  };

  // ---------------- Touch Zone ----------------
  const processTouches = (touches) => {
    const count = touches.length;

    if (count !== MIN_TOUCHES) {
      setIsShining(false);
      stopShine();
      cancelHold();
      return;
    }

    if (count === MIN_TOUCHES) {
      // choose a random lore phrase to show while holding
      if (!currentPhrase) {
        const bank = [
          "Le voile gobelin s'ouvre…",
          "Les runes murmurent ton nom.",
          "Un souffle ancien te reconnaît.",
          "La guilde sourit à ta présence.",
          "Les esprits gobelins s'éveillent.",
        ];
        setCurrentPhrase(bank[Math.floor(Math.random() * bank.length)]);
      }

      if (!timerRef.current) startHoldTimer();
      if (!isShining) {
        setIsShining(true);
        startShine();
      }
    }
  };

  return (
    <View
      style={styles.touchZone}
      onTouchStart={(e) => processTouches(e.nativeEvent.touches)}
      onTouchMove={(e) => processTouches(e.nativeEvent.touches)}
      onTouchEnd={(e) => processTouches(e.nativeEvent.touches)}
    >
      {/* Glow background */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: shineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#888", "#b9aaff"],
            }),
            shadowOpacity: isShining ? 0.5 : 0,
          },
        ]}
      />

      <Text style={styles.text}>
        {detected ? "Main détectée !" : (isShining && currentPhrase ? currentPhrase : `Pose exactement ${MIN_TOUCHES} doigts`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  touchZone: {
    width: "100%",
    height: 300,
    backgroundColor: "#888",
    borderRadius: 16,
    // justifyContent: "center",
    // alignItems: "center",
    overflow: "hidden", 
  },

  glow: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: "#c7b5ff",
    shadowRadius: 25,
  },

  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    zIndex: 10,
  },
});
