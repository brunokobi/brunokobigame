import { useRef, useState } from 'react';
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

  // Animação de "balanço" idle para a vaca parecer viva
  const [randomOffset] = useState(() => Math.random() * 100);

  const skill = skills.find(s => s.id === skillId);
  const isAlreadyCollected = skill?.collected || false;

  useFrame((state) => {
    if (!rigidBodyRef.current || isCollected || isAlreadyCollected) return;

    // Lógica de abdução (Mantida original)
    if (isBeingAbducted && isAbducting) {
      // Girar enquanto sobe
      rigidBodyRef.current.applyTorqueImpulse({ x: 0, y: 0.1, z: 0 }, true);
      rigidBodyRef.current.applyImpulse({ x: 0, y: 0.8, z: 0 }, true);
      
      const pos = rigidBodyRef.current.translation();
      if (pos.y > 6) { // Aumentei um pouco a altura de coleta
        collectSkill(skillId);
        setIsCollected(true);
      }
    } else {
      // Pequeno pulinho aleatório quando está no chão (Idle animation)
      const time = state.clock.getElapsedTime();
      if (Math.sin(time * 2 + randomOffset) > 0.98 && rigidBodyRef.current.translation().y < 1) {
         rigidBodyRef.current.applyImpulse({ x: 0, y: 1, z: 0 }, true);
      }
    }
  });

  if (isCollected || isAlreadyCollected) return null;

  // Materiais reutilizáveis
  const cowWhite = new THREE.MeshStandardMaterial({ color: "#f0f0f0", roughness: 0.8 });
  const cowBlack = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9 });
  const cowPink = new THREE.MeshStandardMaterial({ color: "#ffb7b2", roughness: 0.5 });
  const cowHorn = new THREE.MeshStandardMaterial({ color: "#ddd", roughness: 0.6 });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      mass={1}
      lockRotations={!isBeingAbducted} // Impede a vaca de tombar sozinha, libera na abdução
      linearDamping={1}
      angularDamping={1}
      colliders={false} // Vamos definir o colisor manualmente
    >
      <group>
        {/* --- CORPO PRINCIPAL --- */}
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[0.7, 0.6, 1.1]} />
          <primitive object={cowWhite} />
        </mesh>

        {/* Manchas no corpo (Cubos pretos sobrepostos) */}
        <mesh position={[0.36, 0.6, 0.2]}>
          <boxGeometry args={[0.05, 0.4, 0.4]} />
          <primitive object={cowBlack} />
        </mesh>
        <mesh position={[-0.36, 0.7, -0.3]}>
          <boxGeometry args={[0.05, 0.3, 0.3]} />
          <primitive object={cowBlack} />
        </mesh>

        {/* Ubere (Detalhe rosa embaixo) */}
        <mesh position={[0, 0.3, 0.1]}>
           <boxGeometry args={[0.3, 0.1, 0.3]} />
           <primitive object={cowPink} />
        </mesh>

        {/* --- CABEÇA --- */}
        <group position={[0, 1.1, 0.7]}>
            {/* Cranio */}
            <mesh castShadow>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <primitive object={cowWhite} />
            </mesh>
            {/* Focinho Rosa */}
            <mesh position={[0, -0.1, 0.21]}>
                <boxGeometry args={[0.42, 0.15, 0.05]} />
                <primitive object={cowPink} />
            </mesh>
            {/* Olhos */}
            <mesh position={[0.12, 0.05, 0.21]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.12, 0.05, 0.21]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color="black" />
            </mesh>
            {/* Chifres */}
            <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.04, 0.15, 8]} />
                <primitive object={cowHorn} />
            </mesh>
            <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.04, 0.15, 8]} />
                <primitive object={cowHorn} />
            </mesh>
            {/* Orelhas */}
            <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.1, 0.05, 0.1]} />
                <primitive object={cowWhite} />
            </mesh>
            <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.1, 0.05, 0.1]} />
                <primitive object={cowWhite} />
            </mesh>
        </group>

        {/* --- PATAS --- */}
        {[
          [0.2, 0.3, 0.4],
          [-0.2, 0.3, 0.4],
          [0.2, 0.3, -0.4],
          [-0.2, 0.3, -0.4],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            {/* Perna */}
            <mesh castShadow position={[0, 0, 0]}>
               <boxGeometry args={[0.15, 0.6, 0.15]} />
               <primitive object={cowWhite} />
            </mesh>
            {/* Casco Preto */}
            <mesh position={[0, -0.3, 0]}>
               <boxGeometry args={[0.16, 0.1, 0.16]} />
               <primitive object={cowBlack} />
            </mesh>
          </group>
        ))}

        {/* Cauda */}
        <mesh position={[0, 0.8, -0.6]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <primitive object={cowWhite} />
        </mesh>

        {/* --- INTERFACE --- */}
        <Text
          position={[0, 1.8, 0]} // Subi o texto para não bater nos chifres
          fontSize={0.4}
          color="#00ff88"
          outlineWidth={0.02}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {skillName}
        </Text>

        {/* Colisor de física */}
        <CuboidCollider 
          args={[0.5, 0.6, 0.8]} 
          position={[0, 0.6, 0]}
          density={2}
        />

        {/* Sensor de Abdução */}
        <CuboidCollider 
          args={[0.8, 1, 1]} 
          position={[0, 0.6, 0]}
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
    { id: 'react', name: 'React', position: [-5, 2, 5] as [number, number, number] },
    { id: 'typescript', name: 'TypeScript', position: [-8, 2, 8] as [number, number, number] },
    { id: 'nodejs', name: 'Node.js', position: [-3, 2, 10] as [number, number, number] },
    { id: 'python', name: 'Python', position: [-10, 2, 3] as [number, number, number] },
    { id: 'aws', name: 'AWS', position: [5, 2, 15] as [number, number, number] },
    { id: 'docker', name: 'Docker', position: [-7, 2, 15] as [number, number, number] },
    { id: 'graphql', name: 'GraphQL', position: [0, 2, 18] as [number, number, number] },
    { id: 'postgresql', name: 'PostgreSQL', position: [-12, 2, 12] as [number, number, number] },
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
}