import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text, Instances, Instance } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';
import * as THREE from 'three';

// --- CONFIGURAÇÃO ---
const VOXEL_SIZE = 0.25; // Resolução alta

// --- CORES (Palette) ---
const COLORS = {
  BASE: "#444444",
  DISH_OUT: "#EEEEEE",
  DISH_IN: "#CCCCCC",
  SUPPORT: "#222222",
  ACTIVE: "#FF3333",
  LIGHT: "#00FFFF"
};

// --- COMPONENTE GERENCIADOR DE INSTÂNCIAS ---
// Renderiza milhares de cubos com apenas 1 draw call por cor
const VoxelInstances = ({ data, color, roughness = 0.5, emissive = false }: any) => {
  if (!data || data.length === 0) return null;

  return (
    <Instances range={data.length}>
      <boxGeometry args={[VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE]} />
      <meshStandardMaterial 
        color={color} 
        roughness={roughness} 
        metalness={0.2}
        flatShading={true} // Dá o visual de bloco sem precisar de bordas pesadas
        emissive={emissive ? color : undefined}
        emissiveIntensity={emissive ? 2 : 0}
      />
      {data.map((pos: [number, number, number], i: number) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
};

export const Antenna = () => {
  const { openModal } = useGameStore();
  const towerRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // --- GERAÇÃO MATEMÁTICA OTIMIZADA ---
  // Separa os dados por cor para usar Instancing
  const { dishData, baseData, towerData } = useMemo(() => {
    
    // Arrays para guardar posições de cada cor
    const collections: any = {
      dishOut: [], dishIn: [], base: [], support: [], active: [], light: []
    };

    // 1. BASE
    const size = 2.5;
    for(let x = -size; x <= size; x+= VOXEL_SIZE) {
        for(let z = -size; z <= size; z+= VOXEL_SIZE) {
            if (Math.abs(x) + Math.abs(z) < size * 1.8) {
                collections.base.push([x, 0, z]);
                if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) {
                    collections.base.push([x, VOXEL_SIZE, z]);
                }
            }
        }
    }

    // 2. PARABÓLICA (DISH)
    const radius = 3.5;
    for (let x = -radius; x <= radius; x += VOXEL_SIZE) {
      for (let y = -radius; y <= radius; y += VOXEL_SIZE) {
        const dist = Math.sqrt(x * x + y * y);
        if (dist <= radius) {
          const z = Math.pow(dist, 2) * 0.15;
          const pos = [x, y, z];
          
          if (dist > radius - 0.4) collections.dishOut.push([x, y, z + VOXEL_SIZE]); // Borda
          else if (dist > 2) collections.dishOut.push(pos); // Parte externa
          else collections.dishIn.push(pos); // Miolo
        }
      }
    }

    // 3. TORRE E RECEPTOR
    // Pilar Central
    for(let i=0; i<16; i++) {
        const y = i * VOXEL_SIZE * 2;
        collections.support.push([0.4, y, 0.4], [-0.4, y, 0.4], [0.4, y, -0.4], [-0.4, y, -0.4]);
        if (i % 2 === 0) collections.support.push([0, y, 0]); // Treliça interna
    }
    // Receptor (Ponta)
    for(let i=0; i<10; i++) collections.support.push([0, 0, i * VOXEL_SIZE]);
    // Ponta Ativa
    collections.active.push([0, 0, 2.5], [VOXEL_SIZE, 0, 2.5], [-VOXEL_SIZE, 0, 2.5], [0, VOXEL_SIZE, 2.5], [0, -VOXEL_SIZE, 2.5]);
    collections.light.push([0, 0, 2.5 + VOXEL_SIZE]);

    return { 
      dishData: { out: collections.dishOut, in: collections.dishIn, support: collections.support, active: collections.active, light: collections.light },
      baseData: collections.base,
      towerData: collections.support
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (towerRef.current) towerRef.current.rotation.y = Math.sin(time * 0.2) * 0.5 + time * 0.1;
    if (blinkRef.current) blinkRef.current.intensity = Math.sin(time * 8) > 0.8 ? 8 : 0;
  });

  // Cursor
  const handlePointerOver = () => { setHovered(true); document.body.style.cursor = 'pointer'; };
  const handlePointerOut = () => { setHovered(false); document.body.style.cursor = 'auto'; };
  const handleClick = (e: any) => { e.stopPropagation(); openModal('contact'); };

  return (
    <group position={[-5, 0, -20]}>
      
      <RigidBody 
        type="fixed" 
        colliders={false}
        onClick={handleClick}
        onPointerEnter={handlePointerOver}
        onPointerLeave={handlePointerOut}
      >
        <CuboidCollider args={[3, 1, 3]} position={[0, 0.5, 0]} />
        <CuboidCollider args={[1, 5, 1]} position={[0, 5, 0]} />

        {/* --- RENDERIZAÇÃO OTIMIZADA (INSTANCING) --- */}
        
        {/* 1. BASE (Estática) */}
        <group position={[0, 0.2, 0]}>
           <VoxelInstances data={baseData} color={COLORS.BASE} />
        </group>

        {/* 2. TORRE E PRATO (Móveis) */}
        <group ref={towerRef} position={[0, 1, 0]}>
            
            {/* Pilar Central */}
            <VoxelInstances data={towerData} color={COLORS.SUPPORT} />

            {/* Prato Giratório */}
            <group ref={dishRef} position={[0, 5, 0]} rotation={[-Math.PI / 4, 0, 0]}>
                <VoxelInstances data={dishData.out} color={COLORS.DISH_OUT} />
                <VoxelInstances data={dishData.in} color={COLORS.DISH_IN} />
                
                {/* Receptor na ponta do prato */}
                <group position={[0, 0, 1]}>
                    {/* Reutilizando lógica de voxels, mas reposicionando via grupo */}
                    <VoxelInstances data={dishData.support.slice(-10)} color={COLORS.SUPPORT} /> 
                    
                    <group position={[0, 0, 2.5]}>
                         <VoxelInstances data={dishData.active} color={hovered ? "#FFFF00" : COLORS.ACTIVE} emissive={true} />
                         <VoxelInstances data={dishData.light} color={COLORS.LIGHT} emissive={true} />
                         <pointLight ref={blinkRef} distance={15} decay={2} color={COLORS.LIGHT} position={[0, 0, 0.5]} />
                    </group>
                </group>
            </group>
        </group>

      </RigidBody>

      <Text
        position={[0, 10, 0]}
        fontSize={1}
        color={hovered ? "#FFFF00" : COLORS.LIGHT}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        CONTATO
      </Text>
    </group>
  );
};