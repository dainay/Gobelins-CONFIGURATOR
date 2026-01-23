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

  const children = Array.isArray(root.children) ? root.children : [];
  children.forEach((child) => {
    if (!child.name.startsWith(prefix)) return;
    setVisibleDeep(child, child.name === chosenName);
  });
}

function hideAllByPrefix(root, prefix) {
  if (!root) return;
  const children = Array.isArray(root.children) ? root.children : [];
  children.forEach((child) => {
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
 
const resolveActionName = (wanted) => {
  const keys = Object.keys(actions || {});
  const candidates = [
    wanted,
    "POSE_1",
    "ANIM_talking",
    keys[0],
  ].filter(Boolean);

  return candidates.find((n) => actions?.[n]);
};

const playAction = (wantedName, fade = 0.25) => {
  // Si on n'a pas de nom, on stoppe l'action courante (sinon elle reste figée).
  if (!wantedName) {
    if (currentAction.current) {
      currentAction.current.fadeOut(fade);
      currentAction.current = null;
    }
    // Revenir au bind pose (pose "de base" du rig) quand on ne joue rien
    scene.traverse((obj) => {
      if (obj.isSkinnedMesh && obj.skeleton) {
        obj.skeleton.pose();
      }
    });
    return;
  }

  const name = resolveActionName(wantedName);
  if (!name) return;

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
           position={[0, 1, 0]}  
          onPointerDown={(e) => {
            e.stopPropagation();
            onPress?.();
          }}
        >
          <boxGeometry args={[1.8, 2.2, 1.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <primitive ref={group} object={scene} scale={0.9} />
      </group>
    </>
  );
}

useGLTF.preload(Model);
