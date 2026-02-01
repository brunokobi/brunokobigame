import { useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/gameStore';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const Barn = () => {
  const { openModal } = useGameStore();
  const entered = useRef(false);

  // Materiais reutilizáveis
  const barnRed = new THREE.MeshStandardMaterial({ color: "#7c2e2e", roughness: 0.9 });
  const woodTrim = new THREE.MeshStandardMaterial({ color: "#e0d3af", roughness: 0.8 });
  const roofDark = new THREE.MeshStandardMaterial({ color: "#2d2d2d", roughness: 0.6 });
  const doorWood = new THREE.MeshStandardMaterial({ color: "#4a3c31", roughness: 0.9 });
  const windowLight = new THREE.MeshStandardMaterial({ 
    color: "#ffaa44", 
    emissive: "#ffaa44", 
    emissiveIntensity: 3 
  });

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
      <RigidBody type="fixed" colliders="cuboid">
        
        {/* === ESTRUTURA PRINCIPAL === */}
        
        {/* Fundação */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[8.2, 1, 6.2]} />
          <meshStandardMaterial color="#555555" roughness={1} />
        </mesh>

        {/* Paredes Principais */}
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <boxGeometry args={[8, 4, 6]} />
          <primitive object={barnRed} />
        </mesh>

        {/* Vigas/Acabamento (Trim) */}
        <mesh position={[-3.9, 3, 2.9]}>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <primitive object={woodTrim} />
        </mesh>
        <mesh position={[3.9, 3, 2.9]}>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <primitive object={woodTrim} />
        </mesh>
        <mesh position={[-3.9, 3, -2.9]}>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <primitive object={woodTrim} />
        </mesh>
        <mesh position={[3.9, 3, -2.9]}>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <primitive object={woodTrim} />
        </mesh>

        {/* === TELHADO === */}
        <group position={[0, 5, 0]}>
            {/* Telhado Esquerdo */}
            <mesh castShadow position={[-2.2, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[4.5, 0.2, 6.4]} />
                <primitive object={roofDark} />
            </mesh>
             {/* Telhado Direito */}
             <mesh castShadow position={[2.2, 1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[4.5, 0.2, 6.4]} />
                <primitive object={roofDark} />
            </mesh>
            
             {/* Preenchimento central do telhado */}
             <mesh position={[0, 1, 0]} rotation={[0, 0, Math.PI/4]}>
                <boxGeometry args={[4, 4, 5.8]} />
                <primitive object={barnRed} />
            </mesh>
        </group>

        {/* === PORTA E JANELAS === */}

        {/* Porta Principal */}
        <group position={[0, 2, 3.01]}>
             <mesh castShadow>
                <boxGeometry args={[2.5, 3.5, 0.2]} />
                <primitive object={doorWood} />
            </mesh>
            {/* Detalhe em X */}
            <mesh position={[0, 0, 0.11]} rotation={[0, 0, 0.9]}>
                <boxGeometry args={[0.2, 3.8, 0.05]} />
                <primitive object={woodTrim} />
            </mesh>
            <mesh position={[0, 0, 0.11]} rotation={[0, 0, -0.9]}>
                <boxGeometry args={[0.2, 3.8, 0.05]} />
                <primitive object={woodTrim} />
            </mesh>
             {/* Moldura */}
             <mesh position={[0, 1.8, 0.1]}>
                <boxGeometry args={[2.7, 0.2, 0.1]} />
                <primitive object={woodTrim} />
            </mesh>
        </group>

        {/* Janela Loft */}
        <group position={[0, 6.5, 3.01]}>
             <mesh>
                <boxGeometry args={[1.2, 1.2, 0.1]} />
                <primitive object={windowLight} />
             </mesh>
             <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.1, 1.2, 0.05]} />
                <primitive object={woodTrim} />
             </mesh>
             <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[1.2, 0.1, 0.05]} />
                <primitive object={woodTrim} />
             </mesh>
        </group>

        {/* Janelas Laterais */}
        {[-2.5, 2.5].map((x, i) => (
             <group key={i} position={[x, 3, 3.01]}>
                <mesh>
                    <boxGeometry args={[1, 1.5, 0.1]} />
                    <primitive object={windowLight} />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                    <boxGeometry args={[1.2, 0.15, 0.1]} /> 
                    <primitive object={woodTrim} />
                </mesh>
             </group>
        ))}

        {/* Luz interna */}
        <pointLight 
          position={[0, 3, 0]} 
          color="#ffaa44" 
          intensity={10} 
          distance={20}
          decay={2}
        />
      </RigidBody>

      {/* Sensor */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider 
          args={[3, 3, 3]} 
          position={[0, 1.5, 6]} 
          onIntersectionEnter={handleEnter}
          onIntersectionExit={handleExit}
        />
      </RigidBody>

      {/* Placa Flutuante (Corrigida: sem a prop 'font') */}
      <Text
        position={[0, 9.2, 0]} 
        fontSize={1}
        color="#00ff88"
        // font="/fonts/Inter-Bold.woff"  <-- REMOVIDO PARA EVITAR ERRO
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        SOBRE MIM
      </Text>
    </group>
  );
};