import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

export const Antenna = () => {
  const { openModal } = useGameStore();
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Animação Complexa de Rastreamento
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // 1. A Torre toda gira no eixo Y (Azimute)
    if (rotatingGroupRef.current) {
      rotatingGroupRef.current.rotation.y = Math.sin(time * 0.1) * 0.3; 
    }

    // 2. O Prato inclina no eixo X (Elevação)
    if (dishRef.current) {
       // Offset de inclinação para parecer que está olhando para o céu
      dishRef.current.rotation.x = -Math.PI / 4 + Math.sin(time * 0.15) * 0.1; 
    }

    // Luz piscando
    if (lightRef.current) {
      lightRef.current.intensity = Math.sin(time * 4) > 0 ? 3 : 0;
    }
  });

  const handleContact = () => {
    openModal('contact');
  };

  // Materiais
  const concreteMat = new THREE.MeshStandardMaterial({ color: "#444444", roughness: 0.9 });
  const trussMat = new THREE.MeshStandardMaterial({ color: "#eeeeee", metalness: 0.3, roughness: 0.4 }); // Branco industrial
  const dishMat = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.1, roughness: 0.3, side: THREE.DoubleSide });
  const mechMat = new THREE.MeshStandardMaterial({ color: "#222222", metalness: 0.8, roughness: 0.5 }); // Metal escuro para mecanismos

  return (
    <group position={[20, 0, -20]}>
      <RigidBody type="fixed" colliders={false}>
        
        {/* --- COLISORES SIMPLIFICADOS --- */}
        <CuboidCollider args={[2, 0.5, 2]} position={[0, 0.5, 0]} /> {/* Base */}
        <CuboidCollider args={[1.5, 4, 1.5]} position={[0, 4, 0]} /> {/* Torre */}
        <CylinderCollider args={[2, 2.5]} position={[0, 9, 0]} rotation={[Math.PI/4, 0, 0]} /> {/* Prato aproximado */}

        {/* --- VISUAL --- */}

        {/* 1. Fundação de Concreto (Laje) */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[5, 1, 5]} />
          <primitive object={concreteMat} />
        </mesh>

        {/* 2. Grupo Rotativo (Azimute) - A torre inteira gira */}
        <group ref={rotatingGroupRef}>
            
            {/* Estrutura da Torre (4 Pernas / Treliça) */}
            <group position={[0, 1, 0]}>
                {/* Pernas inclinadas */}
                {[45, 135, 225, 315].map((angle) => {
                    const rad = angle * (Math.PI / 180);
                    return (
                        <mesh key={angle} position={[Math.sin(rad) * 1.5, 3, Math.cos(rad) * 1.5]} 
                              rotation={[0.15, rad, 0]}> 
                            <cylinderGeometry args={[0.2, 0.4, 6, 4]} />
                            <primitive object={trussMat} />
                        </mesh>
                    );
                })}
                {/* Travessas em X (Simplificadas como anéis) */}
                {[2, 4, 6].map((y, i) => (
                    <mesh key={i} position={[0, y, 0]} rotation={[Math.PI/2, Math.PI/4, 0]}>
                         {/* Usando Torus para simular a cinta da treliça */}
                        <torusGeometry args={[1.2 - (i * 0.1), 0.1, 4, 4]} />
                        <primitive object={trussMat} />
                    </mesh>
                ))}
            </group>

            {/* Plataforma Superior / Casa de Máquinas */}
            <mesh position={[0, 7.5, 0]} castShadow>
                <boxGeometry args={[3, 1.5, 3]} />
                <primitive object={trussMat} />
            </mesh>
            
            {/* Eixo de Elevação (Onde o prato prende) */}
            <mesh position={[0, 8.5, 0]}>
                <boxGeometry args={[1.5, 2, 1.5]} />
                <primitive object={mechMat} />
            </mesh>

            {/* 3. O PRATO E SISTEMA ÓPTICO (Elevação) */}
            <group ref={dishRef} position={[0, 9, 0]}>
                
                {/* Estrutura Traseira (Backing Structure) - Dá peso ao prato */}
                <mesh position={[0, 0, -1]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[1, 2, 1.5, 8]} />
                    <primitive object={trussMat} />
                </mesh>
                
                {/* Contrapeso */}
                <mesh position={[0, -1, -1.5]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <primitive object={mechMat} />
                </mesh>

                {/* O Prato Principal Parbólico */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[4, 32, 16, 0, Math.PI * 2, 0, 1.0]} />
                    <primitive object={dishMat} />
                </mesh>

                {/* Tripé do Sub-refletor (Quadripod na verdade) */}
                {[45, 135, 225, 315].map((angle) => {
                    const rad = angle * (Math.PI / 180);
                    return (
                        <mesh key={angle} position={[0, 0, 0]} rotation={[0, 0, rad]}>
                             <mesh position={[0, 1.8, 1.5]} rotation={[0.6, 0, 0]}>
                                <cylinderGeometry args={[0.05, 0.05, 4.5, 4]} />
                                <primitive object={trussMat} />
                             </mesh>
                        </mesh>
                    );
                })}

                {/* Sub-refletor (O "Olho" no centro) */}
                <group position={[0, 0, 3.5]}>
                    <mesh castShadow rotation={[Math.PI/2, 0, 0]}>
                         <cylinderGeometry args={[0.5, 0.2, 0.5, 16]} />
                         <primitive object={mechMat} />
                    </mesh>
                    {/* Luz de status no receptor */}
                    <mesh position={[0, 0, -0.3]}>
                        <sphereGeometry args={[0.2]} />
                        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
                    </mesh>
                </group>

            </group> {/* Fim do Prato */}

            {/* Luz de Aviação no topo da torre fixa */}
            <mesh position={[1.2, 7.8, 1.2]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} />
            </mesh>
            <pointLight ref={lightRef} position={[1.2, 8, 1.2]} color="#ff0000" distance={10} decay={2} />

        </group> {/* Fim do Grupo Rotativo */}

      </RigidBody>

      {/* Sensor de Interação */}
      <RigidBody type="fixed" sensor>
        <CuboidCollider 
          args={[5, 6, 5]} 
          position={[0, 3, 0]}
          onIntersectionEnter={handleContact}
        />
      </RigidBody>

      {/* Texto Holográfico */}
      <Text
        position={[0, 14, 0]}
        fontSize={1}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        Contato
      </Text>
    </group>
  );
};