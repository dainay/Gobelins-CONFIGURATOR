import { Float, OrbitControls, useHelper } from "@react-three/drei/native";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

const Experience = ({ THREE }) => {
  const cubeRef = useRef();
  const directionalLightRef = useRef();

   useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "red");

  useFrame((state, delta) => {
    // console.log("frame");
    // console.log(delta);
    // cubeRef.current.rotation.y += delta * 1;
    //time from the start of the experience
    // const angle = state.clock.getElapsedTime();
    //camera doing a circle around the scene
    // state.camera.position.x = Math.sin(angle) *4;
    // state.camera.position.z = Math.cos(angle) *4;
    // state.camera.lookAt(0, 0, 0);
  });

  //to get stuff one time on load
  const { camera, gl } = useThree((state) => {});



  return (
    <>
      <OrbitControls
        // makeDefault
        enableDamping
      />

      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[2, 4, 2]}
        intensity={1.1}
        castShadow 
      />

      <group ref={cubeRef}>
        <Float speed={5} rotationIntensity={2} floatIntensity={5}>
          <mesh
            position={[1, 1, 1]}
            rotation={[0, 0, 0.5]}
            castShadow
            receiveShadow
          >
            <boxGeometry attach="geometry" />
            <meshStandardMaterial color="#15ff9d" />
          </mesh>
        </Float>

        <mesh
          castShadow
          // receiveShadow
        >
          <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />
          <meshStandardMaterial
            color="#c55dfc"
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[0, -2, 0]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshStandardMaterial
            color="#fde942"
            //   wireframe
            castShadow
            // receiveShadow
          />
        </mesh>
      </group>

      <mesh
        position-y={-3}
        scale={10}
        rotation-x={[-Math.PI * 0.5]}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color="darkgreen" />
      </mesh>
    </>
  );
};

export default Experience;
