import LottieView from 'lottie-react-native';
import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
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
    outputRange: [Colors.black, '#35d224'],
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
    <View style={styles.container}>
      <AnimatedLottie
        pointerEvents="none"
        source={require('../assets/lottie/Magma.json')}
        autoPlay
        loop
        style={{
          width: '90%',
          height: 300,
          alignSelf: 'center',
          marginVertical: -30,
          transform: [{ scale: shineAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }],
          opacity: isShining ? 1 : 0.9,
        }}
      />

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
              outputRange: ["#3e351500", "#3b5c3714"],
            }),
            shadowOpacity: isShining ? 0.5 : 0,
          },
        ]}
      />

      <AnimatedThemedText font="christmasBold" style={[styles.textFingers, { color: animatedTextColor }]}> 
        {detected ? "Main gobeline reconnue " : (isShining && currentPhraseRef.current ? currentPhraseRef.current : `Pose ${MIN_TOUCHES} doigts ici. \n Lance le rite d'initiation pour découvrir ta guilde`)}
      </AnimatedThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  touchZone: {
    width: "100%",
    height: 300,
    backgroundColor: "#edb55525",
    borderRadius: 16,
    // justifyContent: "center",
    // alignItems: "center",
    overflow: "hidden", 
  },

  glow: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: "#1ba7325d",
    shadowRadius: 25,
  },

  text: {
    fontSize: 30, 
    color: Colors.black,
    // zIndex: 10,
    textAlign: "center",
    marginVertical: 110,
    width: "80%",
    alignSelf: "center",
  },
  textFingers:{
     fontSize: 30, 
    color: Colors.black,
     marginTop: 90,
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
  }
});
