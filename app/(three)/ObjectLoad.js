import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei/native'
import Model from '../../assets/models/gob.glb'

export default function ObjectLoad({ selectedEar, ...props }) {
  const { nodes } = useGLTF(Model)

  const avatarConfig = {
    ear: ["Bandage2"], 
  }

  useEffect(() => {
    Object.values(avatarConfig).flat().forEach((meshName) => {
      if (nodes[meshName]) nodes[meshName].visible = false;
    });
  }, [nodes]);

  useEffect(() => {
    avatarConfig.ear.forEach((meshName) => {
      if (nodes[meshName]) {
        nodes[meshName].visible = meshName === selectedEar
      }
    })
  }, [selectedEar, nodes])

  return (
    <group {...props} dispose={null} scale={0.5}>
      <primitive object={nodes.Bandage2} />
      <primitive object={nodes.MainG} />
    </group>
  )
}

useGLTF.preload(Model)
