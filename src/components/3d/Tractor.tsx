import { useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const Tractor = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.5, 1.5, 2.5]} position={[0, 1.5, 0]} />
        
        {/* --- CORPO (Chassi Vermelho) --- */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.8, 1, 3.5]} />
          <meshStandardMaterial color="#cc0000" roughness={0.3} />
        </mesh>

        {/* --- CABINE (Vidro e Teto) --- */}
        <group position={[0, 2.2, 0.5]}>
           {/* Estrutura */}
           <mesh castShadow>
             <boxGeometry args={[1.6, 1.5, 1.8]} />
             <meshStandardMaterial color="#aa0000" />
           </mesh>
           {/* Vidro (Azulado Brilhante) */}
           <mesh position={[0, 0.2, 0.91]}>
             <planeGeometry args={[1.4, 1]} />
             <meshStandardMaterial color="#88ccff" emissive="#446688" emissiveIntensity={0.5} roughness={0.1} />
           </mesh>
        </group>

        {/* --- RODAS TRASEIRAS (Grandes) --- */}
        {[-1.1, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 1, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[1, 1, 0.6, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
            {/* Calota Amarela */}
            <mesh position={[0, 0.31, 0]}>
                <circleGeometry args={[0.5, 16]} />
                <meshStandardMaterial color="#ddcc00" />
            </mesh>
          </mesh>
        ))}

        {/* --- RODAS DIANTEIRAS (Pequenas) --- */}
        {[-1, 1].map((x, i) => (
          <mesh key={i} position={[x, 0.6, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
             {/* Calota Amarela */}
             <mesh position={[0, 0.21, 0]}>
                <circleGeometry args={[0.3, 16]} />
                <meshStandardMaterial color="#ddcc00" />
            </mesh>
          </mesh>
        ))}

        {/* --- ESCAPAMENTO (Chaminé) --- */}
        <mesh position={[0.6, 2.5, -1.2]}>
          <cylinderGeometry args={[0.1, 0.1, 1.5]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>

        {/* --- FARÓIS (Headlights) --- */}
        <group position={[0, 1.2, -1.8]}>
           {/* Esquerdo */}
           <mesh position={[-0.5, 0, 0]}>
             <boxGeometry args={[0.3, 0.3, 0.1]} />
             <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={1} />
             <spotLight 
                position={[0, 0, -0.5]} 
                angle={0.5} 
                penumbra={0.5} 
                intensity={5} 
                distance={20} 
                color="#ffffaa" 
                castShadow
                target-position={[0, -2, -10]}
             />
           </mesh>
           {/* Direito */}
           <mesh position={[0.5, 0, 0]}>
             <boxGeometry args={[0.3, 0.3, 0.1]} />
             <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={1} />
             <spotLight 
                position={[0, 0, -0.5]} 
                angle={0.5} 
                penumbra={0.5} 
                intensity={5} 
                distance={20} 
                color="#ffffaa" 
                castShadow
                target-position={[10, 10, -10]}
             />
           </mesh>
        </group>

      </RigidBody>
    </group>
  );
};