// import { OrbitControls } from "@react-three/drei/native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Suspense, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { useConfiguratorStore } from "../../src/store/configuratorStore";
import { useGobelinStore } from "../../src/store/gobelinStore";

import TabsBar from "../(configurator)/TabsBar";
import ThemedView from "../../components/ui/ThemedView";
import Avatar from "./Avatar";

function CameraController() {
  const { camera } = useThree();
  const cameraZoom = useConfiguratorStore((state) => state.cameraZoom);
  const cameraX = useConfiguratorStore((state) => state.cameraX);
  const cameraY = useConfiguratorStore((state) => state.cameraY);

  const targetZoom = useRef(cameraZoom);
  const targetX = useRef(cameraX);
  const targetY = useRef(cameraY);

  // Position initiale UNE SEULE FOIS au montage
  useEffect(() => {
    camera.position.set(cameraX, cameraY, cameraZoom);
    targetZoom.current = cameraZoom;
    targetX.current = cameraX;
    targetY.current = cameraY;
  }, []);

  useFrame(() => {
    targetZoom.current = cameraZoom;
    targetX.current = cameraX;
    targetY.current = cameraY;
  });


  useFrame(() => {
    // Animation Zoom 
    const currentZ = camera.position.z;
    const targetZ = targetZoom.current;
    const difference = targetZ - currentZ;

    camera.position.z += difference * 0.1;

    if (Math.abs(difference) < 0.01) {
      camera.position.z = targetZ;
    }

    // Animation X 
    const currentX = camera.position.x;
    const targetXValue = targetX.current;
    const differenceX = targetXValue - currentX;

    camera.position.x += differenceX * 0.1;

    if (Math.abs(differenceX) < 0.01) {
      camera.position.x = targetXValue;
    }

    // Animation Y 
    const currentY = camera.position.y;
    const targetYValue = targetY.current;
    const differenceY = targetYValue - currentY;

    camera.position.y += differenceY * 0.1;

    if (Math.abs(differenceY) < 0.01) {
      camera.position.y = targetYValue;
    }

  });


  return null;
}

// function RotatingGobelin({children, position}) {
//   const gobelinRef = useRef();
//   const [rotationY, setRotationY] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const lastTouchX = useRef(0);

//   useFrame(() => {
//     if (gobelinRef.current) {
//       gobelinRef.current.rotation.y = rotationY;
//     }
//   });

//   const handleTouchStart = (event) => {
//     setIsDragging(true);
//     const touch = event.touches ? event.touches[0] : event;
//     lastTouchX.current = touch.clientX || touch.pageX;
//   };

//   const handleTouchMove = (event) => {
//     if (isDragging) {
//       const touch = event.touches ? event.touches[0] : event;
//       const currentX = touch.clientX || touch.pageX;
//       const deltaX = currentX - lastTouchX.current;
//       setRotationY(prev => prev + deltaX * 0.01);
//       lastTouchX.current = currentX;
//     }
//   }

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };

//   return (
//     <group
//       ref={gobelinRef}
//       position={position}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       {children}
//     </group>
//   )
// }

function RotatingGobelin({
  children,
  position,
  rotationY,
  rotationVelocityY,
  setGobelinRotationY,
  setRotationVelocityY,
}) {
  const gobelinRef = useRef();

  useFrame(() => {
    if (gobelinRef.current) {
      // Appliquer la rotation actuelle
      gobelinRef.current.rotation.y = rotationY;

      // Si on n'est pas en train de glisser ET qu'il y a une vélocité
      if (rotationVelocityY !== 0) {
        // Appliquer la vélocité à la rotation
        const newRotation = rotationY + rotationVelocityY;
        setGobelinRotationY(newRotation);

        // Appliquer la friction (réduire la vélocité de 5% par frame)
        const friction = 0.95; // 0.95 = ralentit de 5% par frame
        const newVelocity = rotationVelocityY * friction;
        setRotationVelocityY(newVelocity);

        // Arrêter si la vélocité est très petite (optimisation)
        if (Math.abs(newVelocity) < 0.001) {
          setRotationVelocityY(0);
        }
      }
    }
  });

  return (
    <group ref={gobelinRef} position={position}>
      {children}
    </group>
  );
}

export default function Scene() {
  const [gobelinRotationY, setGobelinRotationY] = useState(0);
  const [rotationVelocityY, setRotationVelocityY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchX = useRef(0);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setRotationVelocityY(0);
    lastTouchX.current = e.nativeEvent.pageX;
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const currentX = e.nativeEvent.pageX;
      const deltaX = currentX - lastTouchX.current;

      const newVelocity = deltaX * 0.01;
      setRotationVelocityY(newVelocity);

      setGobelinRotationY((prev) => prev + newVelocity);
      lastTouchX.current = currentX;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Subscribe to configuration changes - component will rerender when these change
  const configuration = useGobelinStore((state) => state.configuration);

  console.log("USER GOBLIN CONFIG IN SCENE:", configuration);

  return (
    <ThemedView
      safe={true}
      style={{ flex: 1 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas
        shadows
        dpr={1}
        //this code disable awful log that generate expo-gl every tick
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args);
              default:
                return;
            }
          };
        }}
      >
        <CameraController />

        <color attach="background" args={["grey"]} />
        <ambientLight intensity={1} />

        {/* Sol */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10, 1, 1]} />
          <meshStandardMaterial color="green" wireframe={true} />
        </mesh>

        {/* Mur */}
        <mesh position={[0, 5, -5]}>
          <planeGeometry args={[10, 10, 1, 1]} />
          <meshStandardMaterial color="blue" wireframe={true} />
        </mesh>

        <Suspense fallback={null}>
          <RotatingGobelin
            position={[0, 1.5, 0]}
            rotationY={gobelinRotationY}
            rotationVelocityY={rotationVelocityY}
            setGobelinRotationY={setGobelinRotationY}
            setRotationVelocityY={setRotationVelocityY}
          >
            <Avatar
              accesssoire={configuration.accessoire}
              hair={configuration.hair}
              cloth={configuration.cloth}
              face={configuration.face}
              animation={configuration.animation}
              pose={configuration.pose}
            />
          </RotatingGobelin>
          {/* Trepied */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[1, 1, 0.5, 32]} />
            <meshStandardMaterial color="red" wireframe={true} />
          </mesh>
        </Suspense>
      </Canvas>

      <View>
        <TabsBar />
      </View>
    </ThemedView>
  );
}
