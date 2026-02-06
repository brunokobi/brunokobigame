import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  opacity?: number;
}

const Cloud = ({ position, scale = 1, speed = 0.05, opacity = 0.15 }: CloudProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialX = position[0];

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Slow drift movement
    groupRef.current.position.x = initialX + Math.sin(time * speed) * 8;
    groupRef.current.position.y = position[1] + Math.sin(time * speed * 1.5) * 1;
  });

  // Each cloud is a cluster of spheres
  const puffs = useMemo(() => {
    const arr = [];
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 6 * scale,
          (Math.random() - 0.5) * 1.5 * scale,
          (Math.random() - 0.5) * 3 * scale,
        ] as [number, number, number],
        radius: (1.5 + Math.random() * 2) * scale,
      });
    }
    return arr;
  }, [scale]);

  return (
    <group ref={groupRef} position={position}>
      {puffs.map((puff, i) => (
        <mesh key={i} position={puff.pos}>
          <sphereGeometry args={[puff.radius, 12, 12]} />
          <meshStandardMaterial
            color="#667799"
            transparent
            opacity={opacity}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export const Clouds = () => {
  const clouds = useMemo(() => [
    { position: [-30, 35, -40] as [number, number, number], scale: 1.2, speed: 0.03, opacity: 0.12 },
    { position: [25, 38, -50] as [number, number, number], scale: 1.5, speed: 0.02, opacity: 0.1 },
    { position: [-50, 32, -35] as [number, number, number], scale: 0.9, speed: 0.04, opacity: 0.14 },
    { position: [40, 40, -55] as [number, number, number], scale: 1.3, speed: 0.025, opacity: 0.08 },
    { position: [-10, 36, -60] as [number, number, number], scale: 1.1, speed: 0.035, opacity: 0.11 },
    { position: [60, 34, -45] as [number, number, number], scale: 0.8, speed: 0.03, opacity: 0.09 },
  ], []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <Cloud key={i} {...cloud} />
      ))}
    </group>
  );
};
