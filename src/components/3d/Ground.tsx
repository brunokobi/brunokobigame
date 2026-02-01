import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export const Ground = () => {
  return (
    <RigidBody type="fixed" friction={1}>
      {/* Main Ground Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#1a3d1a" 
          roughness={0.9}
        />
      </mesh>

      {/* Grass Patches for visual variety */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const scale = 0.5 + Math.random() * 1;
        return (
          <mesh 
            key={i}
            position={[x, 0.01, z]} 
            rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
            receiveShadow
          >
            <circleGeometry args={[scale, 6]} />
            <meshStandardMaterial 
              color={`hsl(120, ${30 + Math.random() * 20}%, ${12 + Math.random() * 8}%)`}
              roughness={1}
            />
          </mesh>
        );
      })}
    </RigidBody>
  );
};
