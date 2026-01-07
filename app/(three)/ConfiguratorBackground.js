import { useTexture } from "@react-three/drei/native";

export default function ConfiguratorBackground() {
  // Charger la texture du mur de fond
  const backWallTexture = useTexture(require("../../assets/images/configurateur/fond-configurateur.jpg"));
  // Charger la normal map
  const backWallNormalMap = useTexture(require("../../assets/images/configurateur/NormalMap-wall-conf.jpg"));
  const groundTexture = useTexture(require("../../assets/images/configurateur/sol-configurateur.jpg"));
  const groundNormalMap = useTexture(require("../../assets/images/configurateur/NormalMap-ground.jpg"));
  const textureTonneaux = useTexture(require("../../assets/images/configurateur/tonneau-texture.png"));
  const textureTable = useTexture(require("../../assets/images/configurateur/table-texture.png"));
  const textureLights = useTexture(require("../../assets/images/configurateur/texture-light-verte.png"));
  const textureHerbe = useTexture(require("../../assets/images/configurateur/texture-herbe.png"));
  
  return (
    <>
      {/* Mur de fond (plan vertical) */}
      <mesh position={[0, 3.5, -3.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial 
          map={backWallTexture} 
          normalMap={backWallNormalMap}
        />
      </mesh>

      {/* Plan vertical avec texture herbe (devant le mur, transparent) */}
      {/* <mesh position={[0, 0.25, -2.5]} rotation={[15 * Math.PI / 180, 0, 0]}>
        <planeGeometry args={[7, 0.5]} />
        <meshStandardMaterial 
          map={textureHerbe} 
          color="#b6ff39"
          transparent 
          opacity={1}
          alphaTest={0.1}
          depthWrite={false}
        />
      </mesh> */}

      {/* Layers verticaux devant le mur de fond */}
      {/* <mesh position={[0, 3.5, -3]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial map={textureTable} transparent opacity={1} />
      </mesh> */}

      {/* <mesh position={[0, 3.5, -2]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial map={textureLights} transparent opacity={1} />
      </mesh> */}


      {/* Sol (plan horizontal) */}
      <mesh 
        position={[0, -3.5 * Math.sin(5 * Math.PI / 180), -0.1]} 
        rotation={[-Math.PI / 2 + (5 * Math.PI / 180), 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial 
          map={groundTexture} 
          normalMap={groundNormalMap}
          map-anisotropy={16}
        />
      </mesh>
    </>
  );
}

