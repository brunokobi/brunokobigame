import { useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/gameStore';
import { Text } from '@react-three/drei';

export const Barn = () => {
  const { openModal } = useGameStore();
  const entered = useRef(false);

  const handleEnter = () => {
    if (!entered.current) {
      entered.current = true;
      openModal('about');
    }
  };

  const handleExit = () => {
    entered.current = false;
  };

  return (
    <group position={[-15, 0, -10]}>
      <RigidBody type="fixed">
        {/* Barn Base */}
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[8, 5, 6]} />
          <meshStandardMaterial color="#8b2500" roughness={0.8} />
        </mesh>

        {/* Barn Roof */}
        <mesh castShadow position={[0, 5.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[5.5, 2.5, 4]} />
          <meshStandardMaterial color="#4a1a00" roughness={0.9} />
        </mesh>

        {/* Windows with warm light */}
        <mesh position={[-4.01, 2.5, 0]}>
          <boxGeometry args={[0.1, 1.5, 1]} />
          <meshStandardMaterial 
            color="#ffaa44" 
            emissive="#ffaa44" 
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[4.01, 2.5, 0]}>
          <boxGeometry args={[0.1, 1.5, 1]} />
          <meshStandardMaterial 
            color="#ffaa44" 
            emissive="#ffaa44" 
            emissiveIntensity={2}
          />
        </mesh>

        {/* Door */}
        <mesh position={[0, 1.5, 3.01]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#3d1a00" roughness={0.9} />
        </mesh>

        {/* Point Light inside barn */}
        <pointLight 
          position={[0, 3, 0]} 
          color="#ffaa44" 
          intensity={5} 
          distance={15}
        />
      </RigidBody>

      {/* Entrance Sensor */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider 
          args={[3, 3, 2]} 
          position={[0, 2, 5]}
          onIntersectionEnter={handleEnter}
          onIntersectionExit={handleExit}
        />
      </RigidBody>

      {/* Sign */}
      <Text
        position={[0, 7, 0]}
        fontSize={1}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        SOBRE MIM
      </Text>
    </group>
  );
};
