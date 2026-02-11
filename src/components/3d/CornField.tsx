import { useMemo, useRef } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CornFieldMinecraft = ({ position = [0, 0, 0] as [number, number, number] }) => {
  // Reduzi um pouco a contagem e a área para o grid ficar mais evidente
  const COUNT = 400;
  const AREA_SIZE = 24;

  // Paleta de cores estilo Minecraft (mais saturadas e simples)
  const minecraftPalette = {
    dirtDark: '#3A2414',  // Cor da terra arada
    stalkGreen: '#376E12', // Verde padrão do bloco de planta
    leafGreen: '#4C8C23',  // Um verde ligeiramente diferente para as folhas
    cobYellow: '#D4AF37', // Amarelo ouro/milho
  };

  // Gera os dados das plantas, forçando-as a "encaixar" em um grid de blocos
  const cornData = useMemo(() => {
    const temp = [];
    const usedPositions = new Set(); // Para evitar duas plantas no mesmo bloco

    let attempts = 0;
    while (temp.length < COUNT && attempts < COUNT * 5) {
      attempts++;
      // Gera posições inteiras (grid)
      const gridX = Math.floor((Math.random() - 0.5) * AREA_SIZE);
      const gridZ = Math.floor((Math.random() - 0.5) * AREA_SIZE);
      const posKey = `${gridX},${gridZ}`;

      if (usedPositions.has(posKey)) continue;
      usedPositions.add(posKey);

      // Altura em "blocos" (2 ou 3 blocos de altura)
      const heightBlocks = Math.random() > 0.6 ? 3 : 2;
      // Rotação em 90 graus apenas (estilo bloco)
      const rotY = (Math.floor(Math.random() * 4) * Math.PI) / 2;

      temp.push({ x: gridX, z: gridZ, heightBlocks, rotY });
    }
    return temp;
  }, []);

  // Processa os dados para criar as peças individuais (blocos) de cada planta
  const { stemParts, leafParts, cobParts } = useMemo(() => {
    const stems = [];
    const leaves = [];
    const cobs = [];

    cornData.forEach((plant) => {
      const { x, z, rotY, heightBlocks } = plant;
      const blockSize = 0.8; // Tamanho base do bloco da planta (um pouco menor que 1x1 para dar espaço)

      // --- Blocos do Caule (Empilhados) ---
      for (let i = 0; i < heightBlocks; i++) {
        stems.push({
          // Posição Y sobe 1 unidade por bloco
          position: [x, i + 0.5, z],
          // O caule é um pilar mais fino
          scale: [blockSize * 0.3, 1, blockSize * 0.3],
          rotation: [0, rotY, 0]
        });
      }

      // --- Blocos das Folhas (Achatados nas laterais) ---
      // Adiciona folhas no bloco do meio
      leaves.push({
         // Deslocado para o lado e achatado
        position: [x + blockSize * 0.3, 1.2, z],
        scale: [blockSize * 0.8, 0.1, blockSize * 0.3],
        rotation: [0, rotY, 0.2] // Leve inclinação
      });
       leaves.push({
        position: [x - blockSize * 0.3, 1.6, z],
        scale: [blockSize * 0.8, 0.1, blockSize * 0.3],
        rotation: [0, rotY, -0.2]
      });

      // --- Bloco da Espiga (Amarelo) ---
      // Adiciona uma espiga se a planta for alta
      if (heightBlocks >= 2) {
        cobs.push({
          position: [x, 1.5, z + blockSize * 0.2],
          scale: [0.2, 0.4, 0.2], // Bloco pequeno e vertical
          rotation: [0.1, rotY, 0]
        });
      }
    });

    return { stemParts: stems, leafParts: leaves, cobParts: cobs };
  }, [cornData]);

  const plantsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (plantsRef.current) {
      const time = state.clock.elapsedTime;
      // Vento mais rígido e "travado" para combinar com os blocos
      const windStrength = 0.03;
      plantsRef.current.rotation.x = Math.sin(time * 1.5) * windStrength;
      plantsRef.current.rotation.z = Math.cos(time * 1.2) * windStrength * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* 1. CHÃO (Um grande bloco achatado para simular a terra arada) */}
      {/* Importante: flatShading={true} para o visual de blocos */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[AREA_SIZE + 2, 1, AREA_SIZE + 2]} />
        <meshStandardMaterial color={minecraftPalette.dirtDark} roughness={1} flatShading={true} />
      </mesh>

      {/* Grupo das Plantas (Move-se rigidamente com o vento) */}
      <group ref={plantsRef}>

        {/* --- Instâncias dos Caules (Troncos Verdes) --- */}
        <Instances range={stemParts.length}>
          <boxGeometry args={[1, 1, 1]} /> {/* Geometria base é sempre um cubo */}
          <meshStandardMaterial color={minecraftPalette.stalkGreen} roughness={0.8} flatShading={true} />
          {stemParts.map((data, i) => (
            <Instance key={`stem-${i}`} position={data.position} scale={data.scale} rotation={data.rotation} />
          ))}
        </Instances>

        {/* --- Instâncias das Folhas (Blocos Achatados) --- */}
        <Instances range={leafParts.length}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={minecraftPalette.leafGreen} roughness={0.8} flatShading={true} side={THREE.DoubleSide} />
          {leafParts.map((data, i) => (
             <Instance key={`leaf-${i}`} position={data.position} scale={data.scale} rotation={data.rotation} />
          ))}
        </Instances>

         {/* --- Instâncias das Espigas (Blocos Amarelos) --- */}
         <Instances range={cobParts.length}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={minecraftPalette.cobYellow} roughness={0.5} flatShading={true} />
          {cobParts.map((data, i) => (
             <Instance key={`cob-${i}`} position={data.position} scale={data.scale} rotation={data.rotation} />
          ))}
        </Instances>

      </group>
    </group>
  );
};