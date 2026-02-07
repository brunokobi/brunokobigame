import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import type { ProjectId } from '@/store/gameStore';
import * as THREE from 'three';

/* =========================================
   ITEM 1: PROJETOS (Pasta)
   ========================================= */
const ProjectsCube = ({ position }: { position: [number, number, number] }) => {
  const { isAbducting, openProject } = useGameStore();
  const [isHovering, setIsHovering] = useState(false);
  const folderGroupRef = useRef<THREE.Group>(null);
  const glowColor = '#ff4444';

  useFrame((state, delta) => {
    if (folderGroupRef.current) {
      folderGroupRef.current.rotation.y += delta * 0.5;
    }
  });

  useFrame(() => {
    if (isHovering && isAbducting) {
      openProject('mobile' as ProjectId);
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[1.5, 3, 32]} />
        <meshStandardMaterial color="#1a0a0a" roughness={1} opacity={0.5} transparent />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group ref={folderGroupRef} position={[0, 4, 0]} scale={1.5}> 
          {/* Pasta */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.8, 0.15, 1.4]} />
            <meshStandardMaterial color="#d4a853" roughness={0.8} metalness={0.1} emissive={isHovering ? "#d4a853" : "#000000"} emissiveIntensity={isHovering ? 0.2 : 0} />
          </mesh>
          <mesh position={[-0.4, 0.12, -0.55]}>
            <boxGeometry args={[0.7, 0.15, 0.3]} />
            <meshStandardMaterial color="#c89840" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[1.78, 0.05, 1.38]} />
            <meshStandardMaterial color="#c89840" roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
          <Text position={[0, 0.2, 0.01]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.22} color="#cc2222" anchorX="center" anchorY="middle">CONFIDENTIAL</Text>
          <Text position={[0, 0.21, 0.35]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.45} color="#111111" anchorX="center" anchorY="middle">51</Text>
        </group>
      </Float>

      <Text position={[0, 7, 0]} fontSize={0.55} color="#ff6666" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
        PROJETOS
      </Text>

      {isHovering && (
        <Text position={[0, 2, 0]} fontSize={0.35} color="#ffaa44" anchorX="center" anchorY="middle">
          Segure ESPAÇO
        </Text>
      )}

      <RigidBody type="fixed" sensor>
        <CuboidCollider args={[2, 4, 2]} position={[0, 3, 0]} onIntersectionEnter={() => setIsHovering(true)} onIntersectionExit={() => setIsHovering(false)} />
      </RigidBody>

      {isHovering && <pointLight position={[0, 4, 0]} color={glowColor} intensity={10} distance={8} />}
    </group>
  );
};

/* =========================================
   ITEM 2: MAPA (Globo)
   ========================================= */
const MapCube = ({ position }: { position: [number, number, number] }) => {
  const { isAbducting, openProject } = useGameStore();
  const [isHovering, setIsHovering] = useState(false);
  const globeRef = useRef<THREE.Group>(null);
  const glowColor = '#4488ff';

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.3;
    }
  });

  useFrame(() => {
    if (isHovering && isAbducting) {
      openProject('saas' as ProjectId);
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[1.5, 3, 32]} />
        <meshStandardMaterial color="#0a0a1a" roughness={1} opacity={0.5} transparent />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group ref={globeRef} position={[0, 4, 0]} scale={1.3}>
          {/* Globo */}
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#1a4488" emissive="#0a2244" emissiveIntensity={0.5} roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh scale={1.02}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={isHovering ? "#44ff88" : "#22aa55"} transparent opacity={0.4} wireframe wireframeLinewidth={isHovering ? 3 : 2} />
          </mesh>
          <pointLight position={[0, 0, 0]} color="#4488ff" intensity={3} distance={4} />
        </group>
      </Float>

      <Text position={[0, 7, 0]} fontSize={0.55} color="#6699ff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
        MAPA
      </Text>

      {isHovering && (
        <Text position={[0, 2, 0]} fontSize={0.35} color="#ffaa44" anchorX="center" anchorY="middle">
          Segure ESPAÇO
        </Text>
      )}

      <RigidBody type="fixed" sensor>
        <CuboidCollider args={[2, 4, 2]} position={[0, 3, 0]} onIntersectionEnter={() => setIsHovering(true)} onIntersectionExit={() => setIsHovering(false)} />
      </RigidBody>

      {isHovering && <pointLight position={[0, 4, 0]} color={glowColor} intensity={12} distance={8} />}
    </group>
  );
};

/* =========================================
   EXPORT FINAL
   ========================================= */
export const HoloCubes = () => {
  return (
    <group>
      {/* Movi 10 unidades para a direita (X positivo) para limpar a área das vacas.
         - Projetos: 8, 0, 8
         - Mapa: 18, 0, 8 
      */}
      <ProjectsCube position={[8, 0, 8]} />
      <MapCube position={[18, 0, 8]} />
    </group>
  );
};