import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import Model from '../../assets/models/bake.glb'
import { useFrame } from '@react-three/fiber/native'
import { MeshStandardMaterial } from 'three'
import {avatarOptions} from '../../constants/AvatarOptions'
 

export default function ObjectLoad({ hair, cloth, face, accesssoire, animation, pose }) {
  const model = useGLTF(Model)
  const { animations, scene } = model
  const { actions, names } = useAnimations(animations, scene)
  
  console.log("Available animations:", names)

  const accessoiresGroup = scene.getObjectByName("Accessoires")
  const hairGroup = scene.getObjectByName("Cheveux")
  const clothesGroup = scene.getObjectByName("Tenue")
  const faceGroup = scene.getObjectByName("Visage")

  // Play pose
  useEffect(() => {
    if (pose && actions[pose]) {
      actions[pose].reset().fadeIn(0.5).play()
      return () => actions[pose]?.fadeOut(0.5)
    }
  }, [pose, actions])

  // Hide/show groups based on selected options
  useEffect(() => {
    
    // Hide/show direct children groups of ACCESSOIRES
    if (accessoiresGroup) {
      accessoiresGroup.children.forEach((childGroup) => {
        childGroup.visible = childGroup.name === accesssoire;
      });
    }

    // Hide/show direct children groups of HAIR
    if (hairGroup) {
      hairGroup.children.forEach((childGroup) => { 
        childGroup.visible = childGroup.name === hair;
      });
    }

    // Hide/show direct children groups of CLOTHES
    if (clothesGroup) {
      clothesGroup.children.forEach((childGroup) => {
        childGroup.visible = childGroup.name === cloth;
      });
    }

    // Hide/show direct children groups of FACE
    if (faceGroup) {
      faceGroup.children.forEach((childGroup) => {
        childGroup.visible = childGroup.name === face;
      });
    }
  }, [scene, hair, cloth, face, accesssoire]);
   

  // const avatarConfig = {
  //   ear: ["Bandage2"], 
  // }

  // useEffect(() => {
  //   Object.values(avatarConfig).flat().forEach((meshName) => {
  //     if (nodes[meshName]) nodes[meshName].visible = false;
  //   });
  // }, [nodes]);

  // useEffect(() => {
  //   avatarConfig.ea`r.forEach((meshName) => {
  //     if (nodes[meshName]) {
  //       nodes[meshName].visible = meshName === selectedEar
  //     }
  //   })
  // }, [selectedEar, nodes])

  return (
    <>
      {/* Axis Helper: Red=X, Green=Y, Blue=Z */}
      <axesHelper args={[2]} />
      <primitive position={[0, 0, 0]} object={model.scene} scale={0.9} rotation={[0, 0, 0]} />
    </>
  
    
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