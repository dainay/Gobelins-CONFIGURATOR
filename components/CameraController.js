import { useFrame, useThree } from "@react-three/fiber/native";
import { OrbitControls } from "@react-three/drei/native";
import { useRef } from "react";
import * as THREE from "three";
import { useConfigurateurStore } from "../src/store/configurateurStore";

export default function CameraController() {
  const { camera } = useThree();
  const controls = useRef();

  // read camera targets from Zustand
  const camX = useConfigurateurStore((s) => s.cameraX);
  const camY = useConfigurateurStore((s) => s.cameraY);
  const camZ = useConfigurateurStore((s) => s.cameraZoom);
  const lookY = useConfigurateurStore((s) => s.cameraLookAtY);

  // persistent vectors
  const targetPos = useRef(new THREE.Vector3()).current;
  const targetLook = useRef(new THREE.Vector3()).current;

  // LIMITS
  const MIN_POLAR = 0.8;       // don't look under skirt 
  const MAX_POLAR = 2.2;       // allow looking from above 
  const MIN_DISTANCE = 1.4;
  const MAX_DISTANCE = 6.0;

  useFrame(() => {
    if (!controls.current) return;

    // smooth camera position
    targetPos.set(camX, camY, camZ);
    controls.current.object.position.lerp(targetPos, 0.12);

    // smooth "look at" target
    targetLook.set(0, lookY, 0);
    controls.current.target.lerp(targetLook, 0.12);

    // Apply OrbitControls updates
    controls.current.update();

    // ---------------------------
    // CAMERA ROTATION LIMITS
    // ---------------------------

    // prevent camera tilting too low or too high
    const polar = controls.current.getPolarAngle();

    if (polar < MIN_POLAR) {
      controls.current.rotateUp(polar - MIN_POLAR);
    }
    if (polar > MAX_POLAR) {
      controls.current.rotateUp(polar - MAX_POLAR);
    }

    // prevent zooming too close or too far
    const distance = controls.current.object.position.distanceTo(controls.current.target);

    if (distance < MIN_DISTANCE) {
      controls.current.object.position.normalize().multiplyScalar(MIN_DISTANCE);
    }
    if (distance > MAX_DISTANCE) {
      controls.current.object.position.normalize().multiplyScalar(MAX_DISTANCE);
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.08}
      enableZoom={true}
      zoomSpeed={0.4}
      rotateSpeed={0.8}
    />
  );
}
