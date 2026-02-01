import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

interface TechCowProps {
  position: [number, number, number];
  skillId: string;
  skillName: string;
}

const TechCow = ({ position, skillId, skillName }: TechCowProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { isAbducting, skills, collectSkill } = useGameStore();
  const [isBeingAbducted, setIsBeingAbducted] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const skill = skills.find(s => s.id === skillId);
  const isAlreadyCollected = skill?.collected || false;

  // Apply upward force when being abducted
  useFrame(() => {
    if (!rigidBodyRef.current || isCollected || isAlreadyCollected) return;

    if (isBeingAbducted && isAbducting) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 2, z: 0 }, true);
      
      const pos = rigidBodyRef.current.translation();
      if (pos.y > 3.5) {
        collectSkill(skillId);
        setIsCollected(true);
      }
    }
  });

  if (isCollected || isAlreadyCollected) return null;

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      mass={0.5}
      linearDamping={2}
      angularDamping={5}
    >
      <group>
        {/* Cow Body */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.6, 1.2]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>

        {/* Cow Spots */}
        <mesh position={[0.3, 0.5, 0.2]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, 0.4, -0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>

        {/* Cow Head */}
        <mesh castShadow position={[0, 0.5, 0.7]}>
          <boxGeometry args={[0.4, 0.4, 0.3]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.12, 0.55, 0.86]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.12, 0.55, 0.86]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Legs */}
        {[
          [0.25, 0, 0.4],
          [-0.25, 0, 0.4],
          [0.25, 0, -0.4],
          [-0.25, 0, -0.4],
        ].map((pos, i) => (
          <mesh key={i} castShadow position={pos as [number, number, number]}>
            <boxGeometry args={[0.15, 0.4, 0.15]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
          </mesh>
        ))}

        {/* Tech Label */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          {skillName}
        </Text>

        {/* Collision sensor for abduction */}
        <CuboidCollider 
          args={[0.6, 0.5, 0.8]} 
          position={[0, 0.4, 0]}
          sensor
          onIntersectionEnter={() => setIsBeingAbducted(true)}
          onIntersectionExit={() => setIsBeingAbducted(false)}
        />
      </group>
    </RigidBody>
  );
};

export const TechCows = () => {
  const cowData = [
    { id: 'react', name: 'React', position: [-5, 0.5, 5] as [number, number, number] },
    { id: 'typescript', name: 'TypeScript', position: [-8, 0.5, 8] as [number, number, number] },
    { id: 'nodejs', name: 'Node.js', position: [-3, 0.5, 10] as [number, number, number] },
    { id: 'python', name: 'Python', position: [-10, 0.5, 3] as [number, number, number] },
    { id: 'aws', name: 'AWS', position: [5, 0.5, 15] as [number, number, number] },
    { id: 'docker', name: 'Docker', position: [-7, 0.5, 15] as [number, number, number] },
    { id: 'graphql', name: 'GraphQL', position: [0, 0.5, 18] as [number, number, number] },
    { id: 'postgresql', name: 'PostgreSQL', position: [-12, 0.5, 12] as [number, number, number] },
  ];

  return (
    <group>
      {cowData.map((cow) => (
        <TechCow
          key={cow.id}
          position={cow.position}
          skillId={cow.id}
          skillName={cow.name}
        />
      ))}
    </group>
  );
};
