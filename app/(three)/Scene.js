import { View } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei/native";

import { useGobelinStore } from "../../src/store/gobelinStore";

import Avatar from "./Avatar";
import TabsBar from "../(configurator)/TabsBar";
import ThemedView from "../../components/ui/ThemedView";

export default function Scene() {
  const created = (state) => {
    console.log("called on creating component");
  };

  // Subscribe to configuration changes - component will rerender when these change
  const configuration = useGobelinStore((state) => state.configuration);

  console.log("USER GOBLIN CONFIG IN SCENE:", configuration);

  return (
    <ThemedView safe={true} style={{ flex: 1 }}>
      <Canvas
        shadows
        dpr={1}
        //this code disable awful log that generate expo-gl every tick
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
        <color attach="background" args={["grey"]} />
        <ambientLight intensity={1} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />

        <Suspense fallback={null}>
          <Avatar
            accesssoire={configuration.accessoire}
            hair={configuration.hair}
            cloth={configuration.cloth}
            face={configuration.face}
            animation={configuration.animation}
            pose={configuration.pose}
          />
        </Suspense>
      </Canvas>

      <View>
        <TabsBar />
      </View>
    </ThemedView>
  );
}
