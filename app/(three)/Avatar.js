import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import Model from '../../assets/models/try.glb'
import { useFrame } from '@react-three/fiber/native'
import {avatarOptions} from '../../constants/AvatarOptions'
 

export default function ObjectLoad({ hair, cloth, face, accesssoire, animation }) {
  const model = useGLTF(Model)
  const { animations, scene } = model
  const { actions, names } = useAnimations(animations, scene)
  
  console.log("Available animations:", names)

  const accessoiresGroup = scene.getObjectByName("ACCESSOIRES")
  const hairGroup = scene.getObjectByName("HAIR")
  const clothesGroup = scene.getObjectByName("CLOTHES")
  const faceGroup = scene.getObjectByName("FACE")

  
  // Play animation 
  useEffect(() => {
    if (animation && actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play()
      return () => actions[animation]?.fadeOut(0.5)
    }
  }, [animation, actions])

  // Hide/show meshes based on selected options
  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.name) return;

      if (accessoiresGroup) {
        accessoiresGroup.traverse((obj) => {
          if (obj !== accessoiresGroup) { // skip the group itself
            obj.visible = obj.name === accesssoire
          }
        })
      }

      if (hairGroup) {
        hairGroup.traverse((obj) => {
          if (obj !== hairGroup) { // skip the group itself
            obj.visible = obj.name === hair
          }
        })
      }

      if (clothesGroup) {
        clothesGroup.traverse((obj) => {
          if (obj !== clothesGroup) { // skip the group itself
            obj.visible = obj.name === cloth
          }
        })
      }

      if (faceGroup) {
        faceGroup.traverse((obj) => {
          if (obj !== faceGroup) { // skip the group itself
            obj.visible = obj.name === face
          }
        })
      }
    });
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
      <primitive position={[0, 0, 0]} object={model.scene} scale={0.5} rotation={[0, Math.PI, 0]} />
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