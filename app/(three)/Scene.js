import { View } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useState } from "react";
import ObjectLoad from "./ObjectLoad";
import ThemedButton from "../../components/ui/ThemedButton";

export default function Scene() {
  const [selectedEar, setSelectedEar] = useState(null);

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

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        shadows
        dpr={1}
        onCreated={created}
      >
        <color attach="background" args={["grey"]} />
        <ambientLight intensity={1} />
      
        <Suspense fallback={null}>
          <ObjectLoad selectedEar={selectedEar} />
        </Suspense>
      </Canvas>
      
      <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
        <ThemedButton onPress={changeEar}>
          Toggle Ear
        </ThemedButton>
      </View>
    </View>
  );
}
