import { useEffect } from "react";
import { Asset } from "expo-asset";
import { useGLTF, useTexture } from "@react-three/drei/native";
import * as THREE from "three";

export default function ObjectLoad() {
  // 1. Загружаем свою текстуру
  const cheeseTexture = useTexture(
    require("../../assets/images/texture.jpeg")
  );

  // 2. Загружаем GLB из URL
  const asset = Asset.fromURI(
    "https://t49q8flueooukrdm.public.blob.vercel-storage.com/gobelinsV3.glb"
  );

  const { nodes, materials, scene } = useGLTF(asset.uri, true);


  // 3. После загрузки — заменить материалы
  useEffect(() => {
    if (!scene) return;

    console.log(nodes, materials);

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({
          map: cheeseTexture,
        });
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene, cheeseTexture]);

  return <primitive object={scene} scale={0.5} />;
}
