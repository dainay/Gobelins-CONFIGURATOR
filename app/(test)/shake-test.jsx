import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { Accelerometer } from "expo-sensors";
import { router } from "expo-router";

import { useTestStore } from "../../src/store/testStore";
import { calculateShakeMetrics } from "../../src/utils/calculateShakeMetrics";
import { calculateShakeGuild } from "../../src/utils/calculateShakeGuild";


import ThemedView from "../../components/ui/ThemedView";
import ThemedText from "../../components/ui/ThemedText";
import ThemedButton from "../../components/ui/ThemedButton";
import Spacer from "../../components/ui/Spacer";

export default function ShakeTestScreen() {
  // UI state
  const [isTesting, setIsTesting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [testFinished, setTestFinished] = useState(false);

  // Data collection
  const [samples, setSamples] = useState([]);
  const [zeroCrossings, setZeroCrossings] = useState(0);

  // For detecting direction changes
  const lastValueRef = useRef(null);
  const prevDiffRef = useRef(null);

  // Store setter
const shakeGuild = useTestStore((s) => s.shakeGuild);
const setShakeGuild = useTestStore((s) => s.setShakeGuild);

  // We will keep subscription here so we can remove it later
  const subscriptionRef = useRef(null);

  //useEffect to listen when test is finished so we can calculate guild
  useEffect(() => {
  if (testFinished && samples.length > 0) {

    const metrics = calculateShakeMetrics(samples, zeroCrossings);

    const guildScores = calculateShakeGuild(metrics);

    setShakeGuild(guildScores);
    router.replace("/shake-result");
  }
}, [testFinished]);


  // -----------------------------
  // LISTENER LOGIC (ONLY STARTS WHEN USER PRESSES BUTTON)
  // -----------------------------
  const startAccelerometer = () => {
    Accelerometer.setUpdateInterval(50); //20 times per sec

    subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Add sample
      setSamples((prev) => [...prev, magnitude]);

      // Zero-crossings calculation
      const last = lastValueRef.current;

      if (last !== null) {
       const THRESHOLD = 0.2; // ignore micro mouvements. Max i succed to have 67. middle move 40, slow move 25.

            const diff = magnitude - last;

            if (Math.abs(diff) > THRESHOLD) {
            if (prevDiffRef.current !== null) {
                const changedDirection =
                (diff > 0 && prevDiffRef.current < 0) ||
                (diff < 0 && prevDiffRef.current > 0);

                if (changedDirection) {
                setZeroCrossings(prev => prev + 1);
                }
            }

            prevDiffRef.current = diff; // обновляем только если diff значимый
            }
      }

      lastValueRef.current = magnitude;
    });
  };

  // -----------------------------
  // STOP LISTENER
  // -----------------------------
  const stopAccelerometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    lastValueRef.current = null;
    prevDiffRef.current = null;
  };

  // -----------------------------
  // START TEST
  // -----------------------------
  const handleStartTest = () => {
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

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <ThemedView style={styles.container}>
      {!isTesting && !testFinished && (
        <>
          <ThemedText title style={styles.title}>
            Relie ton énergie à ton Gobelin…
          </ThemedText>

          <ThemedText >
            Bouge librement — danse comme un fou ou reste tranquille, comme tu veux.
Sois fidèle à toi-même.
Et surtout, garde bien ton téléphone en main.
          </ThemedText>

          <ThemedButton onPress={handleStartTest}>
            Commencer le test
          </ThemedButton>
        </>
      )}

      {isTesting && !testFinished && (
        <>
          <ThemedText style={styles.testingText}>
            Donne un petit coup de danse à ton téléphone. Doux ou énergique — suis ton style !
          </ThemedText>

          <ThemedText style={styles.timerText}>{timeLeft}s</ThemedText>
        </>
      )}

     
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 8,
  },
  testingText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
  },
  timerText: {
    fontSize: 30,
    marginTop: 10,
  },
  endText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
