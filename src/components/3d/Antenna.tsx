import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

export const Antenna = () => {
  const { openModal } = useGameStore();
  const dishRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const handleContact = () => {
    openModal('contact');
  };

  return (
    <group position={[20, 0, -20]}>
      <RigidBody type="fixed">
        {/* Base Platform */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Main Pole */}
        <mesh castShadow position={[0, 3, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 5, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Antenna Arm */}
        <mesh castShadow position={[0, 5.5, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Satellite Dish */}
        <mesh 
          ref={dishRef}
          castShadow 
          position={[0, 6, 0]} 
          rotation={[Math.PI / 4, 0, 0]}
        >
          <sphereGeometry args={[2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.8} 
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Dish Center Receiver */}
        <mesh position={[0, 6.5, 1]} castShadow>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Signal Lights */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 1 + i * 1.5, 0.3]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color={i === 0 ? "#ff0000" : i === 1 ? "#ffff00" : "#00ff00"}
              emissive={i === 0 ? "#ff0000" : i === 1 ? "#ffff00" : "#00ff00"}
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        {/* Ambient Light from dish */}
        <pointLight 
          position={[0, 6, 0]} 
          color="#00ff88" 
          intensity={3} 
          distance={10}
        />
      </RigidBody>

      {/* Interaction Sensor */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider 
          args={[4, 5, 4]} 
          position={[0, 4, 0]}
          onIntersectionEnter={handleContact}
        />
      </RigidBody>

      {/* Label */}
      <Text
        position={[0, 9, 0]}
        fontSize={0.8}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        CONTATO
      </Text>
    </group>
  );
};
