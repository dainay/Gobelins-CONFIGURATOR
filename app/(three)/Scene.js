import { Canvas, useFrame } from "@react-three/fiber/native";
import { Suspense, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MathUtils } from "three";

import GuildChoice from "../(configurator)/GuildChoice";
import MenuBar from "../(configurator)/MenuBar";
import TabsBar from "../(configurator)/TabsBar";
import CameraController from "../../components/CameraController";
import TutorialOverlay from "../../components/tutorial/TutorialOverlay";
import ThemedView from "../../components/ui/ThemedView";
import { playSfx } from "../../src/lib/sounds";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { useMenuStore } from "../../src/store/menuStore";
import Avatar from "./Avatar";
import ConfiguratorBackground from "./ConfiguratorBackground";
import Cylinder from "./Cylinder";

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
    <group ref={group} position={[0, 0, 0]}>
      {children}
    </group>
  );
}

export default function Scene() {
  const configuration = useGobelinStore((state) => state.configuration);
  const showTutorial = useConfigurateurStore((state) => state.showTutorial);
  const startTutorial = useConfigurateurStore((state) => state.startTutorial);
  const activeMenu = useMenuStore((state) => state.activeMenu);

  // start tutorial once
  useEffect(() => {
    startTutorial();
  }, []);

  // Pose de base = la pose (ou anim) "courante" tant qu'on n'a pas encore ouvert le menu pose.
  // Dès qu'on va sur le menu "pose", on fige cette valeur pour pouvoir y revenir en menu 1.
  const baseActionRef = useRef(null);
  const baseLockedRef = useRef(false);

  useEffect(() => {
    if (activeMenu === "pose") baseLockedRef.current = true;
  }, [activeMenu]);

  useEffect(() => {
    if (baseLockedRef.current) return;
    const candidate = configuration?.pose ?? configuration?.animation ?? null;
    if (candidate) baseActionRef.current = candidate;
  }, [configuration?.pose, configuration?.animation]);

  // menu bars animation
  const menuOpacity = useSharedValue(0);
  const tabsOpacity = useSharedValue(0);
  const menuY = useSharedValue(-80);
  const tabsY = useSharedValue(150);

  useEffect(() => {
    if (!showTutorial) {
      menuOpacity.value = withTiming(1, { duration: 100 });
      tabsOpacity.value = withTiming(1, { duration: 100 });
      menuY.value = withTiming(0, { duration: 120 });
      tabsY.value = withTiming(0, { duration: 120 });
    } else {
      menuOpacity.value = withTiming(0);
      tabsOpacity.value = withTiming(0);
      menuY.value = withTiming(-80);
      tabsY.value = withTiming(150);
    }
  }, [showTutorial]);

  const [activeAnimation, setActiveAnimation] = useState(null);

  const matchingMedias = [
    { animation: "ANIM_scream", sound: "scream" },
    { animation: "ANIM_salut", sound: "hello" },
    { animation: "ANIM_gettinghit", sound: "laugh" },
  ];

  const playTempAnimation = () => {
    // setActiveAnimation("ANIM_gettinghit");
    const randomIndex = Math.floor(Math.random() * matchingMedias.length);
    const media = matchingMedias[randomIndex];

    setActiveAnimation(media.animation);
    playSfx(media.sound);

    setTimeout(() => {
      setActiveAnimation(null);
    }, 3000);
  };

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ translateY: menuY.value }],
  }));

  const tabsStyle = useAnimatedStyle(() => ({
    opacity: tabsOpacity.value,
    transform: [{ translateY: tabsY.value }],
  }));

  useEffect(() => {
    if (activeMenu === "guild") {
      guildY.value = withTiming(0, { duration: 250 });
    } else {
      guildY.value = withTiming(900, { duration: 250 });
    }
  }, [activeMenu]);

  const guildY = useSharedValue(900);
  const guildStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: guildY.value }],
  }));

  // Déplacement du gobelin selon le menu (MenuBar)
  // menu 1 -> appearance, menu 2 -> pose, menu 3 -> guild
  const avatarY =
    activeMenu === "appearance"
      ? 1.0
      : activeMenu === "pose"
        ? 0.75
        : activeMenu === "guild"
          ? 0.75
          : 1.0;

  // Pose affichée:
  // - menu 2 ("pose"): on montre la pose choisie
  // - menu 1 ("appearance"): on revient à la pose "de base" (celle d'entrée, figée avant le menu pose)
  const avatarPose =
    activeMenu === "pose" ? configuration.pose : baseActionRef.current;

  return (
    <ThemedView safe style={{ flex: 1 }}>
      {/* <TouchableOpacity
        onPress={() => router.replace("/(dashboard)/profile")}
        style={{ position: "absolute", zIndex: 1000, top: "50%", right: 10 }}
      >
        <ThemedText>INDEX</ThemedText>
      </TouchableOpacity> */}

      {!showTutorial && (
        <Animated.View
          style={[
            menuStyle,
            { position: "absolute", top: 25, left: 0, right: 0, zIndex: 10 },
          ]}
        >
          <MenuBar />
        </Animated.View>
      )}

      <View style={{ position: "absolute", inset: 0, zIndex: -1 }}>
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

            <AvatarRig y={avatarY}>
              <Avatar
                onPress={playTempAnimation}
                hair={configuration.hair}
                cloth={configuration.cloth}
                animation={activeAnimation}
                pose={configuration.pose}
              />
            </AvatarRig>

            {/* Trepied - Test visible */}

            <Cylinder />
          </Suspense>
        </Canvas>
      </View>

      {!showTutorial && (
        <Animated.View
          style={[
            tabsStyle,
            { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 },
          ]}
        >
          <TabsBar />
        </Animated.View>
      )}

      {activeMenu === "guild" && (
        <Animated.View
          style={[
            guildStyle,
            styles.guildOverlay,
          ]}
          pointerEvents={activeMenu === "guild" ? "auto" : "none"}
        >
          <View style={styles.guildBackdrop} />
          <View style={styles.guildCard}>
            <GuildChoice />
          </View>
        </Animated.View>
      )}

      <TutorialOverlay /> 
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  guildOverlay: {
      ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  guildBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  guildCard: {
    width: "100%",
    maxWidth: 425,
    height: "65%",
    minHeight: 500,
  },
});
