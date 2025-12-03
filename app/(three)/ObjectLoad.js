import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import Model from '../../assets/models/anim.glb'
 

export default function ObjectLoad({ animationName, ...props }) {
  const model = useGLTF(Model)
  const { animations, scene } = model
  const { actions, names } = useAnimations(animations, scene)
  
  console.log("Available animations:", names)
  
  // Play animation when specified
  useEffect(() => {
    if (animationName && actions[animationName]) {
      actions[animationName].reset().fadeIn(0.5).play()
      return () => actions[animationName]?.fadeOut(0.5)
    }
  }, [animationName, actions])
   

  // const avatarConfig = {
  //   ear: ["Bandage2"], 
  // }

  // useEffect(() => {
  //   Object.values(avatarConfig).flat().forEach((meshName) => {
  //     if (nodes[meshName]) nodes[meshName].visible = false;
  //   });
  // }, [nodes]);

  // useEffect(() => {
  //   avatarConfig.ear.forEach((meshName) => {
  //     if (nodes[meshName]) {
  //       nodes[meshName].visible = meshName === selectedEar
  //     }
  //   })
  // }, [selectedEar, nodes])

  return (
 
     <primitive position={[0, 0, 0]} object={model.scene} scale={1} />
  
    
    // <group {...props} dispose={null} scale={0.5}>
    //   <primitive object={nodes.Bandage2} />
    //   <primitive object={nodes.MainG} />
    // </group>
  )
}

useGLTF.preload(Model)

// import { useGLTF } from "@react-three/drei/native";
// import Model from '../../assets/models/gob.glb'

// export default function ObjectLoad({ }) {
//   const gltf = useGLTF(Model);
//   return (
//     <mesh>
//       <primitive position={[0, 0, 0]} object={gltf.scene} scale={1} />
//     </mesh>
//   );
// }