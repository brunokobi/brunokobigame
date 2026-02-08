import { useMemo, useRef } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CornField = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const COUNT = 1000; // Aumentei para criar uma "parede" de milho
  const AREA_SIZE = 30; // Área um pouco maior

  // Paleta de cores para variar os tons de verde (realismo)
  const greenPalette = useMemo(() => [
    new THREE.Color('#2f4f2f'), // Verde escuro (base)
    new THREE.Color('#446633'), // Verde médio
    new THREE.Color('#557744'), // Verde claro
    new THREE.Color('#668855'), // Verde seco
  ], []);

  // Gera os dados de cada pé de milho
  const stalks = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * AREA_SIZE;
      const z = (Math.random() - 0.5) * AREA_SIZE;
      
      // Altura mais variada (entre 1.6m e 2.8m)
      const height = 1.6 + Math.random() * 1.2; 
      const rot = Math.random() * Math.PI * 2;
      
      // Escolhe uma cor aleatória da paleta
      const color = greenPalette[Math.floor(Math.random() * greenPalette.length)];
      
      // Variação de espessura
      const scaleW = 0.8 + Math.random() * 0.4;

      temp.push({ x, z, height, rot, color, scaleW });
    }
    return temp;
  }, [greenPalette]);

  // Ref apenas para as plantas (para o vento não mover o chão)
  const plantsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (plantsRef.current) {
      const time = state.clock.elapsedTime;
      // Vento mais complexo (soma de seno e cosseno para parecer orgânico)
      plantsRef.current.rotation.x = Math.sin(time * 0.5) * 0.02 + Math.cos(time * 1.5) * 0.005;
      plantsRef.current.rotation.z = Math.cos(time * 0.3) * 0.02 + Math.sin(time * 1.2) * 0.005;
    }
  });

  return (
    <group position={position}>
      {/* 1. CHÃO (Fixo, não se move com o vento) */}
      {/* Mudei para uma cor de terra mais escura e úmida */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[AREA_SIZE, AREA_SIZE]} />
        <meshStandardMaterial color="#2b1d0e" roughness={1} />
      </mesh>

      {/* Grupo das Plantas (Sofre ação do vento) */}
      <group ref={plantsRef}>
        
        {/* --- CAULES (InstancedMesh para performance) --- */}
        <Instances range={COUNT}>
          <cylinderGeometry args={[0.03, 0.06, 1, 5]} />
          <meshStandardMaterial roughness={0.8} />
          
          {stalks.map((data, i) => (
            <Instance
              key={`stalk-${i}`}
              position={[data.x, data.height / 2, data.z]}
              scale={[data.scaleW, data.height, data.scaleW]}
              rotation={[0, data.rot, 0]}
              color={data.color} // Aplica a cor variada
            />
          ))}
        </Instances>

        {/* --- FOLHAS (Simuladas com cones achatados para dar volume) --- */}
        {/* Isso adiciona a silhueta irregular típica do milho sem pesar muito */}
        <Instances range={COUNT}>
          <coneGeometry args={[0.3, 0.8, 4]} /> 
          <meshStandardMaterial side={THREE.DoubleSide} roughness={0.8} />
          {stalks.map((data, i) => (
             <Instance
               key={`leaf-${i}`}
               position={[data.x, data.height * 0.6, data.z]}
               scale={[1, 1, 0.1]} // Achatado para parecer folha
               rotation={[0.5, data.rot, 0]}
               color={data.color}
             />
          ))}
        </Instances>

        {/* --- ESPIGAS (Capsules em vez de esferas) --- */}
        <Instances range={COUNT}>
          <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
          <meshStandardMaterial color="#eecfa1" /> {/* Cor de palha/milho seco */}
          
          {stalks.map((data, i) => (
            <Instance
              key={`cob-${i}`}
              position={[data.x, data.height * 0.75, data.z]}
              scale={[1, 1, 1]}
              // Rotação para a espiga "pendurar" um pouco
              rotation={[0.6, data.rot, 0.2]} 
            />
          ))}
        </Instances>
      </group>
    </group>
  );
};