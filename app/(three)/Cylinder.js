export default function Cylinder() {
  // Position du sol : Y = -3.5 * sin(5°) ≈ -0.305
  // Le trépied a une hauteur de 0.5, donc son centre doit être à Y = -0.305 + 0.25 = -0.055
  // Le sol est incliné de 5°, donc on incline aussi le trépied pour qu'il soit perpendiculaire
  const groundY = -3.5 * Math.sin(5 * Math.PI / 180);
  const cylinderHeight = 0.7;
  const cylinderCenterY = groundY + cylinderHeight / 2;
  
  return (
    <mesh 
      position={[0, cylinderCenterY, 0]} 
      rotation={[5 * Math.PI / 180, 0, 0]}
      receiveShadow 
      castShadow
    >  
      <cylinderGeometry args={[0.9, 1.0, cylinderHeight, 32]} />
      <meshStandardMaterial color="#ffff00" />
    </mesh>
  );
}
