import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; 

export default function ThreeDemo() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </Canvas>
  );
}
