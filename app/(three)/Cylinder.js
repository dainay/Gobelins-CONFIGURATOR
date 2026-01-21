import { useGLTF } from "@react-three/drei/native";
import { useThree } from "@react-three/fiber/native";
import { useEffect } from "react";
import Model from "../../assets/models/cylinder.glb";

export default function Cylinder({
  // Par défaut: plus haut en Y, un peu plus fin en X/Z
  scale = [1, 1.1, 1],
  scaleX,
  scaleY,
  scaleZ,
  y = 0.2,
  // Limite perf: anisotropie max appliquée (0/1 = désactivé)
  anisotropy = 4,
}) {
  // On conserve les mêmes repères que le cylindre "en code"
  // (position/rotation adaptées à ton sol incliné).
  const tiltX = 5 * Math.PI / 180;

  const { scene } = useGLTF(Model);
  const { gl } = useThree();

  // Assure ombres comme pour l'avatar
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh || obj.isSkinnedMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  // Réduit le flou de textures aux angles rasants (anisotropie)
  useEffect(() => {
    const deviceMax = gl?.capabilities?.getMaxAnisotropy?.() ?? 1;
    const maxAniso = Math.min(deviceMax, anisotropy ?? 1);
    if (maxAniso <= 1) return;

    scene.traverse((obj) => {
      if (!obj?.isMesh || !obj.material) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];

      for (const mat of materials) {
        // Limité volontairement à la map couleur (meilleur ratio qualité/perf)
        if (mat.map) {
          mat.map.anisotropy = maxAniso;
          mat.map.needsUpdate = true;
        }
      }
    });
  }, [scene, gl, anisotropy]);

  const finalScale = [
    scaleX ?? scale[0] ?? 1,
    scaleY ?? scale[1] ?? 1,
    scaleZ ?? scale[2] ?? 1,
  ];

  return (
    <group
      position={[0, y, 0]}
      rotation={[tiltX, 0, 0]}
      scale={finalScale}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(Model);
