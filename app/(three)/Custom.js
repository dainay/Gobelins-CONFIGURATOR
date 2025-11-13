import { useEffect, useMemo, useRef } from 'react';

export default function Custom({ THREE }) {
  const verticiesCount = 10 * 3; // 10 triangles, 3 verticies each
  const geometryRef = useRef();

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  const positions = useMemo(() => {
    const positions = new Float32Array(verticiesCount * 3); // 3 coordinates (x, y, z) per vertex
    for (let i = 0; i < verticiesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4; // Random position between -2 and 2
    }
    return positions;
  }, []);

  return (
    <>
      <mesh position={[2, 0, 0]}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={verticiesCount}
            array={positions}
            itemSize={3} //for triangles, 3 coordinates per vertex
          />
        </bufferGeometry>
        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}