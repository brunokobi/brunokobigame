import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Moon = () => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (glowRef.current) {
      // Subtle pulsing glow
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        0.12 + Math.sin(time * 0.3) * 0.03;
    }
  });

  return (
    <group position={[-40, 50, -60]}>
      {/* Main moon sphere */}
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial 
          color="#e8e4d8"
          emissive="#ffe8c0"
          emissiveIntensity={0.8}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Moon craters (dark spots) */}
      <mesh position={[-2, 1, 7.5]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#c8c0b0" roughness={1} />
      </mesh>
      <mesh position={[2, -2, 7.2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#c0b8a8" roughness={1} />
      </mesh>
      <mesh position={[-1, 3, 7]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#d0c8b8" roughness={1} />
      </mesh>

      {/* Atmospheric glow around moon */}
      <mesh ref={glowRef} scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial 
          color="#c8d8ff" 
          transparent 
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer halo */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial 
          color="#8899cc" 
          transparent 
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Moon light casting silver light */}
      <pointLight 
        color="#c8d8ff" 
        intensity={4}
        distance={200}
        decay={1.5}
      />
    </group>
  );
};
