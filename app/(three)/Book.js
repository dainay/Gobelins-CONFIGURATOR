import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import { useFrame } from '@react-three/fiber/native'
import Model from '../../assets/models/book.glb' 
 

export default function Book({ e }) {
  const model = useGLTF(Model)
  const { animations, scene } = model
  const { actions, names, mixer } = useAnimations(animations, scene)
  
  console.log("Available animations for book:", names)
  
  // Remove transmission materials IMMEDIATELY before render
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      // Disable transmission properties not supported in React Native
      if (child.material.transmission !== undefined) {
        child.material.transmission = 0;
      }
      if (child.material.thickness !== undefined) {
        child.material.thickness = 0;
      }
      if (child.material.ior !== undefined) {
        child.material.ior = 1.5;
      }
      if (child.material.attenuationDistance !== undefined) {
        child.material.attenuationDistance = Infinity;
      }
      // Force material update
      child.material.needsUpdate = true;
    }
  });
  
  // Update animation mixer
  // useFrame((state, delta) => {
  //   if (mixer) mixer.update(delta);
  // });
 
  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].reset().fadeIn(0.5).play();
      return () => actions["Take 001"]?.fadeOut(0.5);
    }
  }, [actions]);
 
  return (
    <>
      {/* Axis Helper: Red=X, Green=Y, Blue=Z */}
      <axesHelper args={[2]} />
      <primitive position={[0, -2, 0]} object={model.scene} scale={0.06} rotation={[0, Math.PI, 0]} />
    </>
  )
}
useGLTF.preload(Model)
 