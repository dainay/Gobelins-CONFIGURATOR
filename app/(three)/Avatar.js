import { useAnimations, useGLTF } from "@react-three/drei/native";
import React, { useEffect, useMemo } from "react";
import Model from "../../assets/models/bake.glb";

export default function ObjectLoad({
  hair,
  cloth,
  face,
  accesssoire,
  animation,
  pose,
}) {
  const { scene, animations } = useGLTF(Model);
  const { actions } = useAnimations(animations, scene);

  // ---------- CACHE GROUPS in MEMO ----------
  const groups = useMemo(() => {
    return {
      accessoires: scene.getObjectByName("Accessoires"),
      hair: scene.getObjectByName("Cheveux"),
      clothes: scene.getObjectByName("Tenue"),
      face: scene.getObjectByName("Visage"),
    };
  }, [scene]);

  // ---------- FIX MATERIALS ONCE MB remove ----------
  // useMemo(() => {
  //   scene.traverse((obj) => {
  //     if (!obj.isMesh || !obj.material) return;

  //     // Если Blender экспортировал MeshBasicMaterial
  //     if (obj.material.isMeshBasicMaterial) {
  //       const m = obj.material;
  //       obj.material = new MeshStandardMaterial({
  //         color: m.color,
  //         map: m.map || null,
  //         roughness: 0.6,
  //         metalness: 0.1,
  //       });
  //       m.dispose();
  //     }
  //     obj.material.needsUpdate = true;
  //   });
  // }, [scene]);

  // ---------- APPLY POSE ANIMATION ----------
  useEffect(() => {
    if (!pose || !actions[pose]) return;

    actions[pose].reset().fadeIn(0.4).play();
    return () => actions[pose]?.fadeOut(0.4);
  }, [pose, actions]);

  // ---------- SHOW/HIDE GROUPS ----------
  useEffect(() => {
    const applyVisibility = (group, targetName) => {
      if (!group) return;
      group.children.forEach((child) => {
        child.visible = child.name === targetName;
      });
    };

    applyVisibility(groups.accessoires, accesssoire);
    applyVisibility(groups.hair, hair);
    applyVisibility(groups.clothes, cloth);
    applyVisibility(groups.face, face);
  }, [hair, cloth, face, accesssoire, groups]);

  // ---------- ACTIVATE SHADOWS ----------
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <>
      {/* remove axesHelper in production */}
      <axesHelper args={[2]} />
      <primitive object={scene} scale={0.9} />
    </>
  );
}

useGLTF.preload(Model);
