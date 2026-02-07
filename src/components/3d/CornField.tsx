import { useMemo, useRef } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CornField = ({ position = [0, 0, 0] }) => {
  const COUNT = 400; // Quantidade de pés de milho
  const AREA_SIZE = 25; // Tamanho da área da plantação

  // Gera posições aleatórias para o milho
  const stalks = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * AREA_SIZE;
      const z = (Math.random() - 0.5) * AREA_SIZE;
      const height = 1.5 + Math.random() * 1; // Altura variada
      const rot = Math.random() * Math.PI;
      temp.push({ x, z, height, rot });
    }
    return temp;
  }, []);

  // Animação suave (vento)
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group position={position} ref={ref}>
      {/* Marcador de terra arada */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[AREA_SIZE, AREA_SIZE]} />
        <meshStandardMaterial color="#3a2a1a" roughness={1} />
      </mesh>

      {/* --- HASTES VERDES --- */}
      <Instances range={COUNT}>
        <cylinderGeometry args={[0.05, 0.1, 1, 5]} /> {/* Geometria Simples */}
        <meshStandardMaterial color="#44aa44" roughness={0.8} />
        
        {stalks.map((data, i) => (
          <Instance
            key={`stalk-${i}`}
            position={[data.x, data.height / 2, data.z]}
            scale={[1, data.height, 1]}
            rotation={[0, data.rot, 0]}
          />
        ))}
      </Instances>

      {/* --- ESPIGAS AMARELAS (Detalhe) --- */}
      <Instances range={COUNT}>
        <sphereGeometry args={[0.15, 4, 4]} /> {/* Low poly corn cob */}
        <meshStandardMaterial color="#ddcc00" emissive="#aa8800" emissiveIntensity={0.2} />
        
        {stalks.map((data, i) => (
           // Coloca a espiga perto do topo
          <Instance
            key={`cob-${i}`}
            position={[data.x, data.height * 0.8, data.z]}
            scale={[1, 1.5, 1]}
            rotation={[0.5, data.rot, 0]}
          />
        ))}
      </Instances>
    </group>
  );
};