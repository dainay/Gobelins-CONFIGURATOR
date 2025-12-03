import { View } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei/native";
import ObjectLoad from "./ObjectLoad";
import ThemedButton from "../../components/ui/ThemedButton";

export default function Scene() {
  const [selectedEar, setSelectedEar] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState("ANIMATION1");

  const created = (state) => {
    console.log("called on creating component");
  };

  function changeEar() {
    if (!selectedEar) {
      setSelectedEar("Bandage2")
    } else {
      setSelectedEar(null)
    }
  }

  function changeAnimation() {
    const animations = ["ANIMATION1", "ANIMATION2", "ANIMATION3", "ANIMATION4", "POSE1"];
    const currentIndex = animations.indexOf(currentAnimation);
    const nextIndex = (currentIndex + 1) % animations.length;
    setCurrentAnimation(animations[nextIndex]);
  }

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        shadows
        dpr={1} 

        //this code disable awful log that generate expo-gl every tick
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function(...args) {
            const [parameter] = args;
            switch(parameter) {
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
          <ObjectLoad selectedEar={selectedEar} animationName={currentAnimation} />
        </Suspense>
      </Canvas>
      
      <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', gap: 10 }}>
        <ThemedButton onPress={changeEar}>
          Toggle Ear
        </ThemedButton>
        <ThemedButton onPress={changeAnimation}>
          {currentAnimation}
        </ThemedButton>
      </View>
    </View>
  );
}
