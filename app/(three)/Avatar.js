import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { MeshStandardMaterial } from "three";
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
  const currentAction = useRef(null);

  // ---------- CACHE GROUPS in MEMO ----------
  const groups = useMemo(() => {
    return {
      accessoires: scene.getObjectByName("Accessoires"),
      hair: scene.getObjectByName("Cheveux"),
      clothes: scene.getObjectByName("Tenue"),
      face: scene.getObjectByName("Visage"),
    };
  }, [scene]);

  console.log("avaliable animations into Avatar:", animations);

  // ---------- FIX MATERIALS ONCE MB remove ----------
  // useMemo(() => {
  //   scene.traverse((obj) => {
  //     if (!obj.isMesh || !obj.material) return;

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

    const nextAction = actions[pose];
    
    console.log("Playing animation:", pose);
     // stop previous
  if (currentAction.current && currentAction.current !== nextAction) {
    currentAction.current.fadeOut(0.3);
  }

  // play new
  nextAction
    .reset()
    .fadeIn(0.3)
    .play();

  currentAction.current = nextAction;

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

  return (
    <>
      {/* remove axesHelper in production */}
      {/* <axesHelper args={[2]} /> */}
      <primitive object={scene} scale={0.9} />
    </>
  );
}

useGLTF.preload(Model);
