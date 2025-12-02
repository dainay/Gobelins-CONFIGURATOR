import { useEffect } from "react";
import { Asset } from "expo-asset";
import { useGLTF, useTexture } from "@react-three/drei/native";
import * as THREE from "three";
import Model from "../../assets/models/Duck.glb"

export default function ObjectLoad() {
 
  const cheeseTexture = useTexture(
    require("../../assets/images/texture.jpeg")
  );

  const gltf = useGLTF(Model);

  // Apply custom texture to all meshes
  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({
          map: cheeseTexture,
        });
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [gltf.scene, cheeseTexture]);

  return (
    <mesh>
      <primitive position={[0, 0, 0]} object={gltf.scene} scale={1} />
    </mesh>
  );
}

 