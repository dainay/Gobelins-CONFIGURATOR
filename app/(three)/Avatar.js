import { useAnimations, useGLTF } from "@react-three/drei/native";
import { useEffect, useMemo, useRef } from "react";
// import Model from "../../assets/models/bake.glb";
import Model from "../../assets/models/GOBLINK6.glb";

// ======= visibility utils =======
function setVisibleDeep(obj, visible) {
  if (!obj) return;
  obj.visible = visible;
  obj.traverse?.((o) => {
    o.visible = visible;
  });
}

function toggleVariantsByPrefix(root, prefix, chosenName) {
  if (!root) return;

  root.children.forEach((child) => {
    if (!child.name.startsWith(prefix)) return;
    setVisibleDeep(child, child.name === chosenName);
  });
}

function hideAllByPrefix(root, prefix) {
  if (!root) return;
  root.children.forEach((child) => {
    if (!child.name.startsWith(prefix)) return;
    setVisibleDeep(child, false);
  });
}


export default function Avatar({onPress, hair, cloth,  animation,  pose,
}) {
  const { scene, animations } = useGLTF(Model);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  const currentAction = useRef(null);

  // ---------- CACHE GROUPS in MEMO ----------
  const roots = useMemo(() => {
    return {
      head: scene.getObjectByName("Ctrl_Head"), // hat_* root
      hips: scene.getObjectByName("Ctrl_Hips"), // outfit* root
    };
  }, [scene]);

  // console.log("avaliable animations into Avatar:", animations);

   // ---------- SHOW/HIDE HATS + OUTFITS ----------
  useEffect(() => {
    if (!roots.head || !roots.hips) return;

    // hats
    if (!hair) hideAllByPrefix(roots.head, "hat_");
    else toggleVariantsByPrefix(roots.head, "hat_", hair);
 
    if (!cloth) hideAllByPrefix(roots.hips, "outfit");
    else toggleVariantsByPrefix(roots.hips, "outfit", cloth);
  }, [hair, cloth, roots]);

  // ---------- APPLY POSE ANIMATION ----------
 
const playAction = (name, fade = 0.25) => {
  if (!name || !actions?.[name]) return;

  const next = actions[name];

  if (currentAction.current && currentAction.current !== next) {
    currentAction.current.fadeOut(fade);
  }

  next.reset().fadeIn(fade).play();
  currentAction.current = next;
};

useEffect(() => { 
  const name = animation || pose;
  playAction(name, 0.3);
}, [pose, animation, actions]); 

  // ---------- SHADOWS (mesh + skinnedMesh) ----------
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh || obj.isSkinnedMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <>
      <group>
        
        <mesh
           position={[0, 0.7, 0]}  
          onPointerDown={(e) => {
            e.stopPropagation();
            onPress?.();
          }}
        >
          <boxGeometry args={[1.3, 1.7, 1.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <primitive ref={group} object={scene} scale={0.9} />
      </group>
    </>
  );
}

useGLTF.preload(Model);
