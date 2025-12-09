// import { OrbitControls } from "@react-three/drei/native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { Suspense, useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { OrbitControls } from "@react-three/drei/native";
import { router } from "expo-router";

import { useGobelinStore } from "../../src/store/gobelinStore";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import { useMenuStore } from "../../src/store/menuStore";

import Avatar from "./Avatar";
import TabsBar from "../(configurator)/TabsBar";
import ThemedView from "../../components/ui/ThemedView";
import ThemedButton from "../../components/ui/ThemedButton";
import ThemedText from "../../components/ui/ThemedText";
import MenuBar from "../(configurator)/MenuBar";
import GuildChoice from "../(configurator)/GuildChoice";

function CameraController() {
  const { camera } = useThree();
  const cameraZoom = useConfigurateurStore((state) => state.cameraZoom);
  const cameraX = useConfigurateurStore((state) => state.cameraX);
  const cameraY = useConfigurateurStore((state) => state.cameraY);

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
  const activeMenu = useMenuStore((state) => state.activeMenu);
  
  const tabsSlideAnim = useRef(new Animated.Value(0)).current;
  const guildSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (activeMenu === "guild") {
      // Slide tabs down, slide guild up
      Animated.parallel([
        Animated.timing(tabsSlideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(guildSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Slide tabs up, slide guild down
      Animated.parallel([
        Animated.timing(tabsSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(guildSlideAnim, {
          toValue: 900,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [activeMenu]);

  console.log("USER GOBLIN CONFIG IN SCENE:", configuration);

  return (
    <ThemedView
      safe={true}
      style={{ flex: 1 }}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
    >
       <TouchableOpacity onPress={() => router.push("/(dashboard)/profile")}>
        <ThemedText>
          INDEX
        </ThemedText>
      </TouchableOpacity>

      <MenuBar />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
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
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.6}
          minDistance={2}
          maxDistance={10}
        />

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
         
            <Avatar
              accesssoire={configuration.accessoire}
              hair={configuration.hair}
              cloth={configuration.cloth}
              face={configuration.face}
              animation={configuration.animation}
              pose={configuration.pose}
            />
  
          {/* Trepied */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[1, 1, 0.5, 32]} />
            <meshStandardMaterial color="red" wireframe={true} />
          </mesh>
        </Suspense>
        </Canvas>
      </View>

      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10 },
        { transform: [{ translateY: tabsSlideAnim }] }
      ]}>
        <TabsBar />
      </Animated.View>

      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 11 },
        { transform: [{ translateY: guildSlideAnim }] }
      ]}>
        <GuildChoice />
      </Animated.View>
      
    </ThemedView>
  );
}
