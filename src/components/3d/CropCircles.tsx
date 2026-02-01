import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import type { ProjectId } from '@/store/gameStore';
import * as THREE from 'three';

interface CropCircleProps {
  position: [number, number, number];
  projectId: ProjectId;
  label: string;
  color: string;
}

const CropCircle = ({ position, projectId, label, color }: CropCircleProps) => {
  const { isAbducting, openProject } = useGameStore();
  const [isHovering, setIsHovering] = useState(false);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleSensorEnter = () => {
    setIsHovering(true);
  };

  const handleSensorExit = () => {
    setIsHovering(false);
  };

  // Check if abducting while hovering
  useFrame(() => {
    if (isHovering && isAbducting && projectId) {
      openProject(projectId);
    }
  });

  return (
    <group position={position}>
      {/* Crop Circle on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[2, 4, 32]} />
        <meshStandardMaterial 
          color="#8b7355" 
          roughness={1}
        />
      </mesh>
      
      {/* Inner circle pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial 
          color="#6b5344" 
          roughness={1}
        />
      </mesh>

      {/* Floating Project Cube */}
      <Float speed={2} rotationIntensity={0} floatIntensity={1}>
        <mesh ref={cubeRef} position={[0, 3, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={isHovering ? 0.5 : 0.2}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Project Label */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.6}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Instruction when hovering */}
      {isHovering && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          Segure ESPAÇO
        </Text>
      )}

      {/* Sensor for detection */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider 
          args={[4, 5, 4]} 
          position={[0, 3, 0]}
          onIntersectionEnter={handleSensorEnter}
          onIntersectionExit={handleSensorExit}
        />
      </RigidBody>

      {/* Glow effect when hovering */}
      {isHovering && (
        <pointLight 
          position={[0, 3, 0]} 
          color={color} 
          intensity={10} 
          distance={8}
        />
      )}
    </group>
  );
};

export const CropCircles = () => {
  return (
    <group>
      {/* <CropCircle 
        position={[10, 0, -5]} 
        projectId="ecommerce" 
        label="E-commerce" 
        color="#ff6b6b"
      /> */}
      <CropCircle 
        position={[18, 0, 5]} 
        projectId="saas" 
        label="Mapas" 
        color="#4ecdc4"
      />
      <CropCircle 
        position={[12, 0, 12]} 
        projectId="mobile" 
        label="Projetos" 
        color="#ffe66d"
      />
    </group>
  );
};
