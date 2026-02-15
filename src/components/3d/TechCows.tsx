import { useRef, useState, useEffect, useMemo } from 'react'; // Adicione useMemo
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

// --- Interface das Propriedades ---
interface TechCowProps {
  position: [number, number, number];
  skillId: string;
  skillName: string;
}

// --- Componente da Vaca Individual ---
const TechCow = ({ position, skillId, skillName }: TechCowProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  
  const { isAbducting, skills, ufoPosition, collectSkill, abductCow } = useGameStore();
  
  const [isCollected, setIsCollected] = useState(false);
  const [abductionProgress, setAbductionProgress] = useState(0);
  const [randomOffset] = useState(() => Math.random() * 100);
  const [hasPlayedAbductionSound, setHasPlayedAbductionSound] = useState(false);

  const skill = skills.find(s => s.id === skillId);
  const isAlreadyCollected = skill?.collected || false;

  const isHidden = isCollected || isAlreadyCollected;

  // --- CORREÇÃO 1: Criar a instância de áudio apenas UMA vez ---
  const cowAudio = useMemo(() => {
    const audio = new Audio('/sounds/cow.mp3');
    audio.volume = 0.1; // Volume ajustado conforme seu código
    return audio;
  }, []);

  // --- DETECTOR DE RESET (RESPAWN) ---
  useEffect(() => {
    if (!isAlreadyCollected && isCollected) {
       setIsCollected(false);
       setAbductionProgress(0);
       setHasPlayedAbductionSound(false);

       if (rigidBodyRef.current) {
         rigidBodyRef.current.setTranslation({ x: position[0], y: 5, z: position[2] }, true);
         rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
         rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
       }
    }
  }, [isAlreadyCollected, isCollected, position]);

  // --- SONS ---
  const playCompleteSound = () => {
    const audio = new Audio('/sounds/complete.wav'); 
    audio.volume = 0.6; 
    audio.play().catch(() => {});
  };

  // --- CORREÇÃO 2: Só toca se não estiver tocando ---
  const playCowSound = () => {
    // A propriedade .paused é true se o áudio parou ou acabou.
    // Se for false, significa que ainda está tocando, então ignoramos o play.
    if (cowAudio.paused) {
        cowAudio.play().catch(() => {});
    }
  };

  useFrame((state, delta) => {
    if (isHidden || !rigidBodyRef.current || !ufoPosition) return;

    const currentPos = rigidBodyRef.current.translation();

    if (currentPos.y < -10) {
        rigidBodyRef.current.setTranslation({ x: position[0], y: 5, z: position[2] }, true);
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        return;
    }

    const dist = Math.sqrt(
      Math.pow(currentPos.x - ufoPosition.x, 2) + 
      Math.pow(currentPos.z - ufoPosition.z, 2)
    );

    const isUnderBeam = dist < 3 && isAbducting;

    if (isUnderBeam) {
       // --- TOCA O SOM DA VACA (MUUU) ---
       if (!hasPlayedAbductionSound) {
           playCowSound();
           setHasPlayedAbductionSound(true); 
       }

       setAbductionProgress(prev => Math.min(prev + delta * 0.8, 1));
       
       const liftForce = 0.6 + abductionProgress * 1.5; 
       rigidBodyRef.current.setLinvel({ x: 0, y: liftForce * 5, z: 0 }, true);
       
       const pullX = (ufoPosition.x - currentPos.x) * 2;
       const pullZ = (ufoPosition.z - currentPos.z) * 2;
       rigidBodyRef.current.applyImpulse({ x: pullX * delta, y: 0, z: pullZ * delta }, true);
       rigidBodyRef.current.applyTorqueImpulse({ x: 0, y: 0.2, z: 0 }, true);
       
       if (currentPos.y > 6) {
         playCompleteSound();

         if (collectSkill) collectSkill(skillId);
         else if (abductCow) abductCow();
         
         setIsCollected(true);
         rigidBodyRef.current.setTranslation({ x: 0, y: -500, z: 0 }, true);
       }

    } else {
       // Reseta o estado para permitir tocar de novo no futuro,
       // mas a proteção dentro de playCowSound impede que toque IMEDIATAMENTE se ainda estiver rolando.
       if (abductionProgress === 0) {
           setHasPlayedAbductionSound(false);
       }
       
       if (abductionProgress > 0) {
          setAbductionProgress(prev => Math.max(prev - delta * 2, 0));
       } else {
          const time = state.clock.getElapsedTime();
          if (currentPos.y < 2.0 && currentPos.y > 0 && Math.sin(time * 2 + randomOffset) > 0.98) {
            rigidBodyRef.current.applyImpulse({ x: 0, y: 2, z: 0 }, true);
          }
       }
    }
  });

  // Materiais (sem alterações)
  const cowWhite = new THREE.MeshStandardMaterial({ color: "#f0f0f0", roughness: 0.8 });
  const cowBlack = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9 });
  const cowPink = new THREE.MeshStandardMaterial({ color: "#ffb7b2", roughness: 0.5 });
  const cowHorn = new THREE.MeshStandardMaterial({ color: "#ddd", roughness: 0.6 });
  const glowIntensity = abductionProgress > 0 ? 1 + abductionProgress * 2 : 0;
  const cowScale = 1 - abductionProgress * 0.3;

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={isHidden ? [0, -500, 0] : position}
      mass={1}
      lockRotations={abductionProgress < 0.1}
      linearDamping={1}
      angularDamping={1}
      colliders={false}
      ccd={true} 
    >
        <group scale={cowScale} visible={!isHidden}>
          {abductionProgress > 0 && (
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshBasicMaterial color="#00ff88" transparent opacity={0.1 + abductionProgress * 0.2} side={THREE.BackSide} />
            </mesh>
          )}

          {/* Corpo */}
          <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
              <boxGeometry args={[0.7, 0.6, 1.1]} />
              <meshStandardMaterial color="#f0f0f0" roughness={0.8} emissive="#00ff88" emissiveIntensity={glowIntensity * 0.3}/>
          </mesh>
        
          <mesh position={[0.36, 0.6, 0.2]}><boxGeometry args={[0.05, 0.4, 0.4]} /><primitive object={cowBlack} /></mesh>
          <mesh position={[-0.36, 0.7, -0.3]}><boxGeometry args={[0.05, 0.3, 0.3]} /><primitive object={cowBlack} /></mesh>
        
          {/* Cabeça */}
          <group position={[0, 1.1, 0.7]}>
              <mesh castShadow><boxGeometry args={[0.4, 0.4, 0.4]} /><primitive object={cowWhite} /></mesh>
              <mesh position={[0, -0.1, 0.21]}><boxGeometry args={[0.42, 0.15, 0.05]} /><primitive object={cowPink} /></mesh>
              <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.04, 0.15, 8]} /><primitive object={cowHorn} /></mesh>
              <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.3]}><coneGeometry args={[0.04, 0.15, 8]} /><primitive object={cowHorn} /></mesh>
          </group>
        
          {/* Pernas */}
          <mesh position={[0.2, 0.3, 0.4]}><boxGeometry args={[0.15, 0.6, 0.15]} /><primitive object={cowWhite} /></mesh>
          <mesh position={[-0.2, 0.3, 0.4]}><boxGeometry args={[0.15, 0.6, 0.15]} /><primitive object={cowWhite} /></mesh>
          <mesh position={[0.2, 0.3, -0.4]}><boxGeometry args={[0.15, 0.6, 0.15]} /><primitive object={cowWhite} /></mesh>
          <mesh position={[-0.2, 0.3, -0.4]}><boxGeometry args={[0.15, 0.6, 0.15]} /><primitive object={cowWhite} /></mesh>

          <Text
            position={[0, 1.8, 0]} 
            fontSize={0.4}
            color={abductionProgress > 0 ? "#00ff88" : "white"}
            outlineWidth={0.02}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {skillName}
          </Text>

          <CuboidCollider 
            args={[0.5, 0.6, 0.8]} 
            position={[0, 0.6, 0]}
            density={2}
          />
        </group>
    </RigidBody>
  );
};

// --- Componente Principal (Lista de Vacas) ---
export const TechCows = () => {
  const cowData = [
    { id: 'react', name: 'React', position: [-5, 5, 5] as [number, number, number] },
    { id: 'typescript', name: 'TypeScript', position: [-8, 5, 8] as [number, number, number] },
    { id: 'nodejs', name: 'Node.js', position: [-3, 5, 10] as [number, number, number] },
    { id: 'python', name: 'Python', position: [-10, 5, 3] as [number, number, number] },
    { id: 'aws', name: 'AWS', position: [5, 5, 15] as [number, number, number] },
    { id: 'docker', name: 'Docker', position: [-7, 5, 15] as [number, number, number] },
    { id: 'php', name: 'PHP', position: [0, 5, 18] as [number, number, number] },
    { id: 'postgresql', name: 'PostgreSQL', position: [-12, 5, 12] as [number, number, number] },
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