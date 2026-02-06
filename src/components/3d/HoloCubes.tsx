import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import type { ProjectId } from '@/store/gameStore';
import * as THREE from 'three';

/* =========================================
   CUBO DE PROJETOS — "CONFIDENTIAL 51"
   ========================================= */
const ProjectsCube = ({ position }: { position: [number, number, number] }) => {
  const { isAbducting, openProject } = useGameStore();
  const [isHovering, setIsHovering] = useState(false);
  const cubeRef = useRef<THREE.Group>(null);
  const folderRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.15;
    }
    if (folderRef.current) {
      const t = state.clock.getElapsedTime();
      folderRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    }
  });

  useFrame(() => {
    if (isHovering && isAbducting) {
      openProject('mobile' as ProjectId);
    }
  });

  const glowColor = '#ff4444';
  const edgeGlow = isHovering ? 0.8 : 0.3;

  return (
    <group position={position}>
      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[2, 3.5, 6]} />
        <meshStandardMaterial color="#1a0a0a" roughness={1} />
      </mesh>

      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.8}>
        <group ref={cubeRef} position={[0, 4, 0]}>
          {/* Glass cube shell */}
          <mesh>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial
              color="#aabbcc"
              transparent
              opacity={0.08}
              roughness={0}
              metalness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glass cube edges (wireframe) */}
          <mesh>
            <boxGeometry args={[2.52, 2.52, 2.52]} />
            <meshBasicMaterial
              color={glowColor}
              wireframe
              transparent
              opacity={edgeGlow}
            />
          </mesh>

          {/* Manila Folder inside */}
          <group ref={folderRef} scale={0.7}>
            {/* Folder body */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[1.8, 0.15, 1.4]} />
              <meshStandardMaterial 
                color="#d4a853" 
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            {/* Folder tab */}
            <mesh position={[-0.4, 0.12, -0.55]}>
              <boxGeometry args={[0.7, 0.15, 0.3]} />
              <meshStandardMaterial color="#c89840" roughness={0.8} />
            </mesh>
            {/* Folder flap (open) */}
            <mesh position={[0, 0.15, 0]} rotation={[-0.15, 0, 0]}>
              <boxGeometry args={[1.78, 0.05, 1.38]} />
              <meshStandardMaterial color="#c89840" roughness={0.8} />
            </mesh>

            {/* CONFIDENTIAL stamp text */}
            <Text
              position={[0, 0.2, 0.01]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.22}
              color="#cc2222"
              anchorX="center"
              anchorY="middle"
            >
              CONFIDENTIAL
            </Text>
            <Text
              position={[0, 0.21, 0.35]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.45}
              color="#111111"
              anchorX="center"
              anchorY="middle"
            >
              51
            </Text>
          </group>
        </group>
      </Float>

      {/* Label */}
      <Text
        position={[0, 7, 0]}
        fontSize={0.55}
        color="#ff6666"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        PROJETOS
      </Text>

      {/* Instruction */}
      {isHovering && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.35}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          Segure ESPAÇO
        </Text>
      )}

      {/* Sensor */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider
          args={[3, 5, 3]}
          position={[0, 3, 0]}
          onIntersectionEnter={() => setIsHovering(true)}
          onIntersectionExit={() => setIsHovering(false)}
        />
      </RigidBody>

      {/* Hover glow */}
      {isHovering && (
        <pointLight position={[0, 4, 0]} color={glowColor} intensity={15} distance={10} />
      )}
    </group>
  );
};

/* =========================================
   CUBO DE MAPA — GLOBO TERRESTRE
   ========================================= */
const MapCube = ({ position }: { position: [number, number, number] }) => {
  const { isAbducting, openProject } = useGameStore();
  const [isHovering, setIsHovering] = useState(false);
  const cubeRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.15;
    }
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.3;
    }
  });

  useFrame(() => {
    if (isHovering && isAbducting) {
      openProject('saas' as ProjectId);
    }
  });

  const glowColor = '#4488ff';
  const edgeGlow = isHovering ? 0.8 : 0.3;

  return (
    <group position={position}>
      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[2, 3.5, 6]} />
        <meshStandardMaterial color="#0a0a1a" roughness={1} />
      </mesh>

      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.8}>
        <group ref={cubeRef} position={[0, 4, 0]}>
          {/* Glass cube shell */}
          <mesh>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial
              color="#aabbdd"
              transparent
              opacity={0.08}
              roughness={0}
              metalness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glass cube edges (wireframe) */}
          <mesh>
            <boxGeometry args={[2.52, 2.52, 2.52]} />
            <meshBasicMaterial
              color={glowColor}
              wireframe
              transparent
              opacity={edgeGlow}
            />
          </mesh>

          {/* Globe inside */}
          <mesh ref={globeRef} scale={0.85}>
            {/* Earth sphere */}
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#1a4488"
              emissive="#0a2244"
              emissiveIntensity={0.5}
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>

          {/* Continents overlay (simplified with a ring and patches) */}
          <mesh ref={globeRef} scale={0.86}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#22aa55"
              transparent
              opacity={0.4}
              wireframe
              wireframeLinewidth={2}
            />
          </mesh>

          {/* Inner glow of globe */}
          <pointLight
            position={[0, 0, 0]}
            color="#4488ff"
            intensity={2}
            distance={3}
          />
        </group>
      </Float>

      {/* Label */}
      <Text
        position={[0, 7, 0]}
        fontSize={0.55}
        color="#6699ff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        MAPA
      </Text>

      {/* Instruction */}
      {isHovering && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.35}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          Segure ESPAÇO
        </Text>
      )}

      {/* Sensor */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider
          args={[3, 5, 3]}
          position={[0, 3, 0]}
          onIntersectionEnter={() => setIsHovering(true)}
          onIntersectionExit={() => setIsHovering(false)}
        />
      </RigidBody>

      {/* Hover glow */}
      {isHovering && (
        <pointLight position={[0, 4, 0]} color={glowColor} intensity={15} distance={10} />
      )}
    </group>
  );
};

/* =========================================
   EXPORT
   ========================================= */
export const HoloCubes = () => {
  return (
    <group>
      <ProjectsCube position={[-12, 0, 8]} />
      <MapCube position={[12, 0, 8]} />
    </group>
  );
};
