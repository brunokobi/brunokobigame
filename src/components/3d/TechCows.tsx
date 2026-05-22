import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import { ufoPositionRef } from '@/store/ufoPositionRef';
import * as THREE from 'three';

// --- Materiais Globais Reutilizáveis (Otimização de Performance) ---
const cowWhite = new THREE.MeshStandardMaterial({ color: "#f0f0f0", roughness: 0.8 });
const cowBlack = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9 });
const cowPink = new THREE.MeshStandardMaterial({ color: "#ffb7b2", roughness: 0.5 });
const cowHorn = new THREE.MeshStandardMaterial({ color: "#ddd", roughness: 0.6 });

// --- Interface das Propriedades ---
interface TechCowProps {
  position: [number, number, number];
  skillId: string;
  skillName: string;
}

// --- Componente da Vaca Individual ---
const TechCow = ({ position, skillId, skillName }: TechCowProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const cowGroupRef = useRef<THREE.Group>(null);
  const cowBodyRef = useRef<THREE.Mesh>(null);
  const glowSphereRef = useRef<THREE.Mesh>(null);

  // Seletores granulares — evita re-renders quando outras partes do store mudam
  const isAbducting = useGameStore(state => state.isAbducting);
  const skills = useGameStore(state => state.skills);
  const collectSkill = useGameStore(state => state.collectSkill);
  const abductCow = useGameStore(state => state.abductCow);

  const [isCollected, setIsCollected] = useState(false);
  // isGlowing só muda nas bordas (progresso cruza 0) — não causa re-renders por frame
  const [isGlowing, setIsGlowing] = useState(false);
  const [randomOffset] = useState(() => Math.random() * 100);

  // Refs para valores atualizados por frame — sem setState, sem re-renders
  const abductionProgressRef = useRef(0);
  const hasPlayedAbductionSoundRef = useRef(false);

  const skill = skills.find(s => s.id === skillId);
  const isAlreadyCollected = skill?.collected || false;
  const isHidden = isCollected || isAlreadyCollected;

  // --- Cria a instância de áudio apenas UMA vez ---
  const cowAudio = useMemo(() => {
    const audio = new Audio('/sounds/cow.mp3');
    audio.volume = 0.1;
    return audio;
  }, []);

  // --- DETECTOR DE RESET (RESPAWN) ---
  useEffect(() => {
    if (!isAlreadyCollected && isCollected) {
      setIsCollected(false);
      setIsGlowing(false);
      abductionProgressRef.current = 0;
      hasPlayedAbductionSoundRef.current = false;

      // Reseta visuais diretamente via refs
      if (cowGroupRef.current) cowGroupRef.current.scale.setScalar(1);
      if (cowBodyRef.current) {
        (cowBodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
      }
      if (glowSphereRef.current) glowSphereRef.current.visible = false;

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

  const playCowSound = () => {
    if (cowAudio.paused) {
      cowAudio.play().catch(() => {});
    }
  };

  useFrame((state, delta) => {
    if (isHidden || !rigidBodyRef.current) return;

    const currentPos = rigidBodyRef.current.translation();

    if (currentPos.y < -10) {
      rigidBodyRef.current.setTranslation({ x: position[0], y: 5, z: position[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const { x: ux, z: uz } = ufoPositionRef;
    const dist = Math.sqrt(
      Math.pow(currentPos.x - ux, 2) +
      Math.pow(currentPos.z - uz, 2)
    );

    const isUnderBeam = dist < 3 && isAbducting;

    if (isUnderBeam) {
      if (!hasPlayedAbductionSoundRef.current) {
        playCowSound();
        hasPlayedAbductionSoundRef.current = true;
      }

      const prevProgress = abductionProgressRef.current;
      abductionProgressRef.current = Math.min(prevProgress + delta * 0.8, 1);
      const progress = abductionProgressRef.current;

      // Muta meshes diretamente — zero re-renders por frame
      if (cowGroupRef.current) cowGroupRef.current.scale.setScalar(1 - progress * 0.3);
      if (cowBodyRef.current) {
        (cowBodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = (1 + progress * 2) * 0.3;
      }
      if (glowSphereRef.current) {
        if (prevProgress === 0) {
          glowSphereRef.current.visible = true;
          setIsGlowing(true); // Dispara apenas uma vez na borda
        }
        (glowSphereRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + progress * 0.2;
      }

      const liftForce = 0.6 + progress * 1.5;
      rigidBodyRef.current.setLinvel({ x: 0, y: liftForce * 5, z: 0 }, true);

      const pullX = (ux - currentPos.x) * 2;
      const pullZ = (uz - currentPos.z) * 2;
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
      if (abductionProgressRef.current === 0) {
        hasPlayedAbductionSoundRef.current = false;
      }

      if (abductionProgressRef.current > 0) {
        abductionProgressRef.current = Math.max(abductionProgressRef.current - delta * 2, 0);
        const progress = abductionProgressRef.current;

        if (cowGroupRef.current) cowGroupRef.current.scale.setScalar(1 - progress * 0.3);
        if (cowBodyRef.current) {
          (cowBodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
            progress > 0 ? (1 + progress * 2) * 0.3 : 0;
        }
        if (glowSphereRef.current && progress === 0) {
          glowSphereRef.current.visible = false;
          setIsGlowing(false); // Dispara apenas uma vez na borda
        }
      } else {
        const time = state.clock.getElapsedTime();
        if (currentPos.y < 2.0 && currentPos.y > 0 && Math.sin(time * 2 + randomOffset) > 0.98) {
          rigidBodyRef.current.applyImpulse({ x: 0, y: 2, z: 0 }, true);
        }
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={isHidden ? [0, -500, 0] : position}
      mass={1}
      lockRotations={true}
      linearDamping={1}
      angularDamping={1}
      colliders={false}
      ccd={false}
    >
      <group ref={cowGroupRef} visible={!isHidden}>
        {/* Esfera de brilho — sempre renderizada, controlada via ref (sem conditional render) */}
        <mesh ref={glowSphereRef} position={[0, 0.6, 0]} visible={false}>
          <sphereGeometry args={[1.2, 8, 8]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>

        {/* Corpo */}
        <mesh ref={cowBodyRef} castShadow receiveShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[0.7, 0.6, 1.1]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.8} emissive="#00ff88" emissiveIntensity={0} />
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
          color={isGlowing ? "#00ff88" : "white"}
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
