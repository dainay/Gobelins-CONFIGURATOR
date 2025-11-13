import { Asset } from "expo-asset";
import { useGLTF } from "@react-three/drei/native";

export default function ObjectLoad() {
 const asset = Asset.fromURI(
    "https://t49q8flueooukrdm.public.blob.vercel-storage.com/gobelinsV3.glb"
  );
  const { scene } = useGLTF(asset.uri, true);
  return <primitive object={scene} scale={0.5} />;
}