import { Canvas, useFrame } from "@react-three/fiber/native";
import * as Battery from "expo-battery";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { Suspense, useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { MathUtils } from "three";

import { ANIMATIONS } from "../../constants/Animations";
import { useUser } from "../../hooks/useUser";
import { saveGobelinToDatabase } from "../../src/lib/saveGobelin";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { calculateShakeMetrics } from "../../src/utils/calculateShakeMetrics";
import { chooseAnimation } from "../../src/utils/chooseAnimation";

import Avatar from "../(three)/Avatar";
import ConfiguratorBackground from "../(three)/ConfiguratorBackground";
import Cylinder from "../(three)/Cylinder";
import CameraController from "../../components/CameraController";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import { Colors } from "../../constants/Colors";

function AvatarRig({ y, children }) {
  const group = useRef();
  const targetY = useRef(y);
  const didInit = useRef(false);

  useEffect(() => {
    targetY.current = y;
  }, [y]);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Init position once (sinon React "position={[0,y,0]}" téléporte)
    if (!didInit.current) {
      group.current.position.y = targetY.current;
      didInit.current = true;
      return;
    }
    group.current.position.y = MathUtils.damp(
      group.current.position.y,
      targetY.current,
      10,
      delta
    );
  });

  return (
    <group ref={group} position={[0, 0, 0.5]}>
      {children}
    </group>
  );
}

export default function AnimationChoice() {
  const [isTesting, setIsTesting] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  const { user } = useUser();
  const gobelin = useGobelinStore((state) => state);
  const setConfig = useGobelinStore((state) => state.setConfig);

  // Ajuster le zoom de la caméra au montage pour dézoomer
  useEffect(() => {
    const store = useConfigurateurStore.getState();
    useConfigurateurStore.setState({ cameraZoom: 4.5 }); // Augmenter le zoom pour dézoomer
    return () => {
      // Restaurer la valeur par défaut si nécessaire
      useConfigurateurStore.setState({ cameraZoom: store.cameraZoom });
    };
  }, []);

  const [selectedAnimation, setSelectedAnimation] = useState();

  // shake data
  const [samples, setSamples] = useState([]);
  const [zeroCrossings, setZeroCrossings] = useState(0);

  const lastValueRef = useRef(null);
  const prevDiffRef = useRef(null);
  const subscriptionRef = useRef(null);

  // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:", user);

  // ---------------------------------------------------
  // CALCULATE ANIMATION ON TEST FINISH
  // ---------------------------------------------------
  useEffect(() => {
    if (!testFinished || samples.length === 0) return;

    const metrics = calculateShakeMetrics(samples, zeroCrossings);

    Battery.getBatteryLevelAsync().then((battery) => {
      const animName = chooseAnimation(metrics, battery);

      console.log("Chosen animation name:", animName);
      setSelectedAnimation(animName);
      // Don't set config here - will be set on handleConfirm

      console.log("Selected animation:", ANIMATIONS[animName].animName);
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
    await saveGobelinToDatabase(user.id, user.user_metadata.display_name);

    router.replace("/(dashboard)/openWorld");
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <View style={styles.container}>
      <Canvas
        dpr={1}
        shadows
        flat
        gl={{ antialias: false }}
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
        <CameraController />

        <color attach="background" args={["#000000"]} />

        <Suspense fallback={null}>
          {/* Fog lumineux */}
          <fog attach="fog" args={["#000000", 4, 15]} />
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[0, 4, 3.5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Fond du configurateur (mur de fond + sol) */}
          <ConfiguratorBackground />

          <AvatarRig y={0.8}>
            <Avatar
              hair={gobelin.configuration.hair}
              cloth={gobelin.configuration.cloth}
              face={gobelin.configuration.face}
              accesssoire={gobelin.configuration.accessoire}
              pose={
                selectedAnimation
                  ? ANIMATIONS[selectedAnimation].animName
                  : gobelin.configuration.pose
              }
            />
          </AvatarRig>

          {/* Trepied - Test visible */}
          <Cylinder />
        </Suspense>
      </Canvas>

      <ImageBackground
        source={require("../../assets/ui/tutorial/square-paper.webp")}
        resizeMode="stretch"
        style={styles.panelBackground}
      >
        <View style={styles.contentContainer}>
          {!testFinished ? (
            !isTesting ? (
              <View style={styles.stepWrapper}>
                <ThemedText style={styles.title} font="merriweatherBold">
                  C’est le moment final !
                </ThemedText>
                <Image
                  source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                  style={styles.subtitleBar}
                  resizeMode="contain"
                />
                <ThemedText style={styles.bodyText} font="merriweather">
                  Transmets ton énergie à ton Gobelin. Secoue ton téléphone :
                  danse douce ou rage totale… à toi de décider.
                </ThemedText>
                <ThemedButton
                  onPress={startTest}
                  width={200}
                  height={60}
                  textStyle={styles.buttonText}
                >
                  En scène !
                </ThemedButton>
              </View>
            ) : (
              <View style={styles.testingWrapper}>
                <ThemedText style={styles.title} font="merriweatherBold">
                  Bouge ton tel !
                </ThemedText>
                <Image
                  source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                  style={styles.subtitleBar}
                  resizeMode="contain"
                />
                <ThemedText style={styles.bodyText} font="merriweather">
                  Continue de bouger…
                </ThemedText>
                <ThemedText style={styles.counter} font="merriweatherBold">
                  {timeLeft}s
                </ThemedText>
              </View>
            )
          ) : selectedAnimation ? (
            <View style={styles.resultWrapper}>
              <ThemedText style={styles.subtitle} font="merriweatherBold">
                {ANIMATIONS[selectedAnimation].title}
              </ThemedText>
              <Image
                source={require("../../assets/ui/tutorial/bar-subtitle.webp")}
                style={styles.subtitleBar}
                resizeMode="contain"
              />

              <ThemedText style={styles.bodyText} font="merriweather">
                {ANIMATIONS[selectedAnimation].detail}
              </ThemedText>

              <ThemedButton
                onPress={handleConfirm}
                width={280}
                height={80}
                textStyle={styles.buttonText}
              >
                Mon gobelin est prêt !
              </ThemedButton>
            </View>
          ) : (
            <View style={styles.loadingWrapper}>
              <ThemedText style={styles.bodyText} font="merriweather">
                Calcul de ton animation...
              </ThemedText>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panelBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    width: "100%",
    minHeight: 350,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 36,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 36,
    alignItems: "center",
  },
  stepWrapper: {
    width: "100%",
    alignItems: "center",
  },
  testingWrapper: {
    width: "100%",
    alignItems: "center",
  },
  resultWrapper: {
    width: "100%",
    alignItems: "center",
  },
  loadingWrapper: {
    width: "100%",
    alignItems: "center",
  },
  subtitleBar: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
    color: Colors.brownText,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: 0.2,
    color: Colors.brownText,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: 0.2,
    color: Colors.brownText,
    width: "85%",
    alignSelf: "center",
    marginBottom: 12,
  },
  counter: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    color: Colors.brownText,
  },
  buttonText: {
    fontFamily: "Merriweather-Bold",
    fontSize: 16,
    textAlign: "center",
    color: Colors.brownText,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 3,
  },
});
