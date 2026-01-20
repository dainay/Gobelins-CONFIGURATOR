import LottieView from 'lottie-react-native';
import { useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import ThemedText from "./ui/ThemedText";

const AnimatedLottie = Animated.createAnimatedComponent(LottieView);

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

export default function Fingers({ onHandDetected }) {
  const MIN_TOUCHES = 2;       
  const HOLD_TIME = 2500;    

  const [detected, setDetected] = useState(false);
  const [isShining, setIsShining] = useState(false);
  
  const phraseBank = [
    "Le voile gobelin s'ouvre…",
    "Les runes murmurent ton nom...",
    "Un souffle ancien te reconnaît...",
    "La guilde sourit à ta présence...",
    "Les esprits gobelins s'éveillent...",
  ];
  
  const currentPhraseRef = useRef(null);

  const timerRef = useRef(null);
  const shineAnim = useRef(new Animated.Value(0)).current;

  const animatedTextColor = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.brownText, "#35d224"],
  });

  // ---------------- Glow animation ----------------
  const startShine = () => {
    
    currentPhraseRef.current = phraseBank[Math.floor(Math.random() * phraseBank.length)];
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopShine = () => {
    shineAnim.stopAnimation();
    shineAnim.setValue(0);
    currentPhraseRef.current = null;
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

      if (!timerRef.current) startHoldTimer();
      if (!isShining) {
        setIsShining(true);
        startShine();
      }
    }
  };

  return (
    <View style={[styles.container, styles.debugContainer]}>
      <AnimatedLottie
        pointerEvents="none"
        source={require('../assets/lottie/Magma.json')}
        autoPlay
        loop
        style={{
          width: '100%',
          maxHeight: 300,
          alignSelf: 'center',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginVertical: -30,
          transform: [{ scale: shineAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }],
          opacity: isShining ? 1 : 0.9,
        }}
      />

      <View
        style={[styles.touchZone, styles.debugTouchZone]}
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
              outputRange: ["#3e351500", "#3b5c3714"],
            }),
            shadowOpacity: isShining ? 0.5 : 0,
          },
          styles.debugGlow,
        ]}
      />

      <View style={styles.contentOverlay}>
        <AnimatedThemedText
          font="merriweather"
          style={[styles.textFingers, { color: animatedTextColor }, styles.debugText]}
        >
          {detected
            ? "Main gobeline reconnue"
            : isShining && currentPhraseRef.current
              ? currentPhraseRef.current
              : `Pose ${MIN_TOUCHES} doigts ici.\nLance le rite d'initiation pour découvrir ta guilde.`}
        </AnimatedThemedText>

        <View style={[styles.iconsRow, styles.debugIconsRow]}>
          <Image
            source={require("../assets/ui/guilds/empreinte-digitale.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require("../assets/ui/guilds/empreinte-digitale.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  touchZone: {
    width: "100%",
    height: "100%",
    backgroundColor: "#edb55525",
    borderRadius: 16,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    overflow: "hidden", 
  },

  glow: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: "#1ba7325d",
    shadowRadius: 25,
  },

  contentOverlay: {
    width: "100%",
    zIndex: 2,
    alignItems: "center",
    gap: 12,
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  icon: {
    width: 80,
    height: 80,
  },

  textFingers: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
    textAlign: "center",
    width: "100%",
  },
  // DEBUG BORDERS
  debugContainer: {
    borderWidth: 2,
    borderColor: "red",
  },
  debugTouchZone: {
    borderWidth: 2,
    borderColor: "lime",
  },
  debugGlow: {
    borderWidth: 2,
    borderColor: "cyan",
  },
  debugText: {
    borderWidth: 2,
    borderColor: "magenta",
  },
  debugIconsRow: {
    borderWidth: 2,
    borderColor: "yellow",
  },
});
