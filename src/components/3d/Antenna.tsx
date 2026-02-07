import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Edges } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

// --- COMPONENTE VOXEL MELHORADO ---
const Voxel = ({ position, color }: { position: [number, number, number], color: string }) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} flatShading={true} />
    <Edges color="#000000" threshold={15} scale={1.0} renderOrder={1000}>
       <meshBasicMaterial transparent opacity={0.3} />
    </Edges>
  </mesh>
);

export const Antenna = () => {
  const { openModal } = useGameStore();
  const towerRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (towerRef.current) {
       const step = Math.floor(time * 4); 
       const targetRotation = step * (Math.PI / 16); 
       towerRef.current.rotation.y = THREE.MathUtils.lerp(towerRef.current.rotation.y, targetRotation, 0.1);
    }

    if (blinkRef.current) {
      blinkRef.current.intensity = Math.floor(time * 4) % 2 === 0 ? 5 : 0;
    }
  });

  const handleContact = () => {
    openModal('contact');
  };

  const C_BASE = "#555555";
  const C_DISH = "#DDDDDD";
  const C_SUPPORT = "#333333";
  const C_ACTIVE = "#FF3333";
  const C_LIGHT = "#33FFFF";

  return (
    // AJUSTE DE POSIÇÃO: Movi de X=5 para X=-5 (Mais para a esquerda)
    <group position={[-5, 0.5, -20]}>
      
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2.5, 1, 2.5]} position={[0, 0.5, 0]} />
        <CuboidCollider args={[2, 6, 2]} position={[0, 6, 0]} />

        {/* --- BASE DE PEDRA --- */}
        <group position={[0, 0, 0]}>
            {[-2, -1, 0, 1, 2].map(x => 
                [-2, -1, 0, 1, 2].map(z => (
                    <Voxel key={`b1-${x}-${z}`} position={[x, 0, z]} color={C_BASE} />
                ))
            )}
             {[-1, 0, 1].map(x => 
                [-1, 0, 1].map(z => (
                    <Voxel key={`b2-${x}-${z}`} position={[x, 1, z]} color={C_BASE} />
                ))
            )}
        </group>

        {/* --- TORRE GIRATÓRIA --- */}
        <group ref={towerRef} position={[0, 2, 0]}>
            
            {/* Pilar Central Grosso */}
            {[0, 1, 2, 3].map(y => (
                <group key={`pole-${y}`} position={[0, y, 0]}>
                    <Voxel position={[0, 0, 0]} color={C_SUPPORT} />
                    {y === 0 && (
                        <>
                            <Voxel position={[1, 0, 0]} color={C_SUPPORT} />
                            <Voxel position={[-1, 0, 0]} color={C_SUPPORT} />
                            <Voxel position={[0, 0, 1]} color={C_SUPPORT} />
                            <Voxel position={[0, 0, -1]} color={C_SUPPORT} />
                        </>
                    )}
                </group>
            ))}
            
            {/* Cabeça do Motor */}
            <group position={[0, 4, 0]}>
                 {[-1, 0, 1].map(x => 
                    [-1, 0, 1].map(z => (
                        <Voxel key={`eng-${x}-${z}`} position={[x, 0, z]} color={C_BASE} />
                    ))
                )}
            </group>


            {/* --- PRATO (Tigela) --- */}
            <group ref={dishRef} position={[0, 5, 0]} rotation={[-Math.PI / 4, 0, 0]}> 
                
                <Voxel position={[0, 0, 0]} color={C_DISH} />
                
                <Voxel position={[1, 0, 0]} color={C_DISH} />
                <Voxel position={[-1, 0, 0]} color={C_DISH} />
                <Voxel position={[0, 1, 0]} color={C_DISH} />
                <Voxel position={[0, -1, 0]} color={C_DISH} />

                <group position={[0, 0, 1]}>
                    <Voxel position={[2, 0, 0]} color={C_DISH} />
                    <Voxel position={[-2, 0, 0]} color={C_DISH} />
                    <Voxel position={[0, 2, 0]} color={C_DISH} />
                    <Voxel position={[0, -2, 0]} color={C_DISH} />
                    <Voxel position={[1, 1, 0]} color={C_DISH} />
                    <Voxel position={[-1, 1, 0]} color={C_DISH} />
                    <Voxel position={[1, -1, 0]} color={C_DISH} />
                    <Voxel position={[-1, -1, 0]} color={C_DISH} />
                </group>

                 <group position={[0, 0, 2]}>
                    {[-3, -2, -1, 0, 1, 2, 3].map(x => 
                        [-3, -2, -1, 0, 1, 2, 3].map(y => {
                            const dist = Math.sqrt(x*x + y*y);
                            if (dist > 2.5 && dist < 3.8) {
                                return <Voxel key={`rim-${x}-${y}`} position={[x, y, 0]} color={C_DISH} />
                            }
                            return null;
                        })
                    )}
                 </group>
                
                {/* --- RECEPTOR --- */}
                <group position={[0, 0, 1]}>
                    <Voxel position={[0, 0, 0]} color={C_SUPPORT} />
                    <Voxel position={[0, 0, 1]} color={C_SUPPORT} />
                    <Voxel position={[0, 0, 2]} color={C_SUPPORT} />
                    
                    <Voxel position={[0, 0, 3]} color={C_ACTIVE} />
                    
                    <group position={[0, 0, 4]}>
                        <Voxel position={[0, 0, 0]} color={C_LIGHT} />
                        <pointLight ref={blinkRef} distance={8} decay={2} color={C_LIGHT} />
                    </group>
                </group>

            </group>

        </group>

      </RigidBody>

      <RigidBody type="fixed" sensor>
        <CuboidCollider args={[6, 8, 6]} position={[0, 4, 0]} onIntersectionEnter={handleContact} />
      </RigidBody>

      <Text
        position={[0, 14, 0]}
        fontSize={2}
        color={C_LIGHT}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        CONTATO
      </Text>
    </group>
  );
};