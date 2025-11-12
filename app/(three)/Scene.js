import { View } from "react-native";
import { Canvas } from "@react-three/fiber/native"; 
import { useRef } from "react";
import { Suspense } from 'react';

import * as THREE from "three";

import Experience from "./Experience";
import Custom from "./Custom";
import ObjectLoad from "./ObjectLoad"; 

function Box() {
  const ref = useRef(null);
  return (
    <mesh ref={ref} rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const  created = (state) => {
  console.log('called on creating component');

  // if (state.gl) {
  //   state.gl.setClearColor('blue', 1.0);
  // } else {
  //   console.warn('state.gl is not initialized');
  // }

  // state.scene.background = new THREE.Color('pink');
}

export default function ThreeDemo() {
  return ( 
    <View style={{ 
      flex: 1, 
      // backgroundColor: "black"
       }}>
      <Canvas 
      shadows
      dpr={1}
      // gl={{ antialias: true,
      //   toneMapping: THREE.CineonToneMapping,
      // outputEncoding: THREE.sRGBEncoding,
      //  }}

      // flat 


      // orthographic
      // camera={{
      //   // zoom: 100,
      //   // fov: 45,
      //   // near: 0.1,
      //   // far: 100,
      //   // position: [0, 1, 0],
      // }}

      onCreated={created}
      >
        
        <Suspense fallback={null}>
        <color attach="background" args={["pink"]} />
         <ambientLight intensity={1} />
          {/* <mesh>
            <boxGeometry />
            <meshStandardMaterial color="red" />
         </mesh>  */}
       
        {/* <Experience THREE={THREE} /> */}
         <ObjectLoad />
 
        </Suspense>
 
      </Canvas>
    </View> 
  );
}
