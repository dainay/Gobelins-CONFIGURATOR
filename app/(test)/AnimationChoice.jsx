import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Accelerometer } from "expo-sensors";
import * as Battery from "expo-battery";

import { router } from "expo-router";

import { useGobelinStore } from "../../src/store/gobelinStore";
import { useUser } from "../../hooks/useUser";
import { saveGobelinToDatabase } from "../../src/lib/saveGobelin";

import { calculateShakeMetrics } from "../../src/utils/calculateShakeMetrics";
 
import { ANIMATIONS } from "../../constants/Animations";

import ThemedView from "../../components/ui/ThemedView";
import ThemedText from "../../components/ui/ThemedText";
import ThemedButton from "../../components/ui/ThemedButton";
import Avatar from "../(three)/Avatar";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AnimationChoice() {
  const [isTesting, setIsTesting] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
 
  const { user } = useUser();
  const gobelin = useGobelinStore((state) => state);
  const setConfig = useGobelinStore((state) => state.setConfig);

   const [selectedAnimation, setSelectedAnimation] = useState(gobelin.configuration.pose.label);

  // shake data
  const [samples, setSamples] = useState([]);
  const [zeroCrossings, setZeroCrossings] = useState(0);

  const lastValueRef = useRef(null);
  const prevDiffRef = useRef(null);
  const subscriptionRef = useRef(null);

  // ---------------------------------------------------
  // CALCULATE ANIMATION ON TEST FINISH
  // ---------------------------------------------------
  useEffect(() => {
    if (!testFinished || samples.length === 0) return;

    const metrics = calculateShakeMetrics(samples, zeroCrossings);

    Battery.getBatteryLevelAsync().then((battery) => {
      const animId = chooseAnimation(metrics, battery);

      setSelectedAnimation(animId);
      // Don't set config here - will be set on handleConfirm

      console.log("Selected animation:", animId);
    });
  }, [testFinished]);

  // ---------------------------------------------------
  // ACCELEROMETER LISTENER
  // ---------------------------------------------------
  const startAccelerometer = () => {
    Accelerometer.setUpdateInterval(50);

    subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      setSamples((prev) => [...prev, magnitude]);

      const last = lastValueRef.current;
      const diff = magnitude - last;

      if (last !== null && Math.abs(diff) > 0.2) {
        if (
          prevDiffRef.current !== null &&
          ((diff > 0 && prevDiffRef.current < 0) ||
            (diff < 0 && prevDiffRef.current > 0))
        ) {
          setZeroCrossings((prev) => prev + 1);
        }
        prevDiffRef.current = diff;
      }

      lastValueRef.current = magnitude;
    });
  };

  const stopAccelerometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    lastValueRef.current = null;
    prevDiffRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  // ---------------------------------------------------
  // START TEST
  // ---------------------------------------------------
  const startTest = () => {
    setIsTesting(true);
    setTestFinished(false);
    setTimeLeft(5);
    setSamples([]);
    setZeroCrossings(0);

    startAccelerometer();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopAccelerometer();
          setTestFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirm = async () => {
    // Save animation to store (using animName from ANIMATIONS)
    setConfig({ animation: ANIMATIONS[selectedAnimation].animName });
    
    // Save complete gobelin to database
    await saveGobelinToDatabase(user.id);
    
    router.replace("/(dashboard)/openWorld");
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <View style={styles.container}>
      <Canvas 
        shadows
        dpr={1}
        camera={{ position: [0, 2, 5], fov: 50 }}
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args);
              default:
                return;
            }
          };
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <Avatar 
          hair={gobelin.configuration.hair}
          cloth={gobelin.configuration.cloth}
          face={gobelin.configuration.face}
          accesssoire={gobelin.configuration.accessoire}
          animation={gobelin.configuration.animation}
          pose={selectedAnimation}
        />
      </Canvas>

      <View style={styles.contentContainer}>
        {!testFinished ? (
          !isTesting ? (
            <>
              <ThemedText title style={styles.text}>Relie ton énergie à ton Gobelin…</ThemedText>
              <ThemedButton onPress={startTest}>
                Commencer le test
              </ThemedButton>
            </>
          ) : (
            <>
              <ThemedText style={styles.text}>Continue de bouger…</ThemedText>
              <ThemedText style={styles.text}>{timeLeft}s</ThemedText>
            </>
          )
        ) : selectedAnimation ? (
          <>
            <ThemedText title style={styles.text}>
              {ANIMATIONS[selectedAnimation].title}
            </ThemedText>

            <ThemedText style={styles.text}>
              {ANIMATIONS[selectedAnimation].detail}
            </ThemedText>

            <ThemedButton onPress={handleConfirm}>
              Mon gobelin est prêt !
            </ThemedButton>
          </>
        ) : (
          <ThemedText style={styles.text}>Calcul de ton animation...</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: '#000',
  },
});
