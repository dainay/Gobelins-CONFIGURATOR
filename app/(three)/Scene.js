import { Canvas } from "@react-three/fiber/native";
import { router } from "expo-router";
import { Suspense, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import GuildChoice from "../(configurator)/GuildChoice";
import MenuBar from "../(configurator)/MenuBar";
import TabsBar from "../(configurator)/TabsBar";
import CameraController from "../../components/CameraController";
import TutorialOverlay from "../../components/tutorial/TutorialOverlay";
import ThemedText from "../../components/ui/ThemedText";
import ThemedView from "../../components/ui/ThemedView";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useGobelinStore } from "../../src/store/gobelinStore";
import { useMenuStore } from "../../src/store/menuStore";
import Avatar from "./Avatar";
import ConfiguratorBackground from "./ConfiguratorBackground";

export default function Scene() {
  const configuration = useGobelinStore((state) => state.configuration);
  const showTutorial = useConfigurateurStore((state) => state.showTutorial);
  const startTutorial = useConfigurateurStore((state) => state.startTutorial);
  const activeMenu = useMenuStore((state) => state.activeMenu);

  // start tutorial once
  useEffect(() => {
    startTutorial();
  }, []);

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

  return (
    <ThemedView safe style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => router.push("/(dashboard)/profile")}
        style={{ position: "absolute", zIndex: 1000, top: "50%", right: 10 }}
      >
        <ThemedText>INDEX</ThemedText>
      </TouchableOpacity>

      {!showTutorial && (
        <Animated.View
          style={[
            menuStyle,
            { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
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
 
          {/* Fog lumineux */}
          <fog attach="fog" args={["#000000", 4, 15]} />
          <ambientLight intensity={1.2} />
          {!showTutorial && (
            <>
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
              <Suspense fallback={null}>
                <ConfiguratorBackground />
              </Suspense>

              <Suspense fallback={null}>
                <group position={[0, 1, 0]}>
                  <Avatar
                    accessoire={configuration.accessoire}
                    hair={configuration.hair}
                    cloth={configuration.cloth}
                    face={configuration.face}
                    animation={configuration.animation}
                    pose={configuration.pose}
                  />
                </group>
              </Suspense>
            </>
          )}
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
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
            },
          ]}
          pointerEvents={activeMenu === "guild" ? "auto" : "none"}
        >
          <GuildChoice />
        </Animated.View>
      )}

      <TutorialOverlay />
    </ThemedView>
  );
}
