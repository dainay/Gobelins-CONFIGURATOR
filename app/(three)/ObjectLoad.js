import React from 'react';
import { useGLTF } from '@react-three/drei/native';

export default function ObjectLoad(props) {
  const { scene } = useGLTF('https://github.com/KhronosGroup/glTF-Sample-Models/raw/main/2.0/Duck/glTF-Binary/Duck.glb');

  return <primitive object={scene} scale={1} {...props} />;
}