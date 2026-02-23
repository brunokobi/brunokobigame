import { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// PALETA DE CORES JOHN DEERE 
// ==========================================
const JD_GREEN = "#367c2b";
const JD_YELLOW = "#ffde00";
const TIRE_BLACK = "#151515"; // Mais escuro
const METAL_BLACK = "#1a1a1a";
const GLASS_COLOR = "#88ccff";
const LIGHT_OFF_WHITE = "#ffffff";

// Materiais otimizados
const materials = {
  greenPaint: new THREE.MeshStandardMaterial({ color: JD_GREEN, roughness: 0.25, metalness: 0.15 }),
  yellowPaint: new THREE.MeshStandardMaterial({ color: JD_YELLOW, roughness: 0.3, metalness: 0.1 }),
  tireRubber: new THREE.MeshStandardMaterial({ color: TIRE_BLACK, roughness: 1.0, flatShading: false }),
  blackMetal: new THREE.MeshStandardMaterial({ color: METAL_BLACK, roughness: 0.8, metalness: 0.5 }),
  silverMetal: new THREE.MeshStandardMaterial({ color: "#888", roughness: 0.4, metalness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({ color: GLASS_COLOR, roughness: 0.05, metalness: 0.9, opacity: 0.4, transparent: true, side: THREE.DoubleSide }),
  lightLens: new THREE.MeshStandardMaterial({ color: LIGHT_OFF_WHITE, emissive: LIGHT_OFF_WHITE, emissiveIntensity: 1.0 }),
  redLight: new THREE.MeshStandardMaterial({ color: "#ff0000", emissive: "#ff0000", emissiveIntensity: 1.0 }),
};

// ==========================================
// SUB-COMPONENTE: RODA SUPER DETALHADA
// ==========================================
const TractorWheel = ({ radius, width, isRear, position, rotation }: any) => {
  const treadCount = isRear ? 24 : 16; 
  const rimRadius = radius * 0.55;

  const treads = useMemo(() => {
    const items = [];
    for (let i = 0; i < treadCount; i++) {
      const angle = (i / treadCount) * Math.PI * 2;
      items.push({
        position: [0, Math.sin(angle) * radius, Math.cos(angle) * radius],
        // As garras nos tratores fazem um "V". Alternamos o ângulo.
        rotation: [angle + 0.1, (i % 2 === 0 ? 0.3 : -0.3), 0], 
      });
    }
    return items;
  }, [radius, treadCount]);

  return (
    <group position={position} rotation={rotation}>
      {/* Pneu Central */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.96, radius * 0.96, width, 32]} />
        <primitive object={materials.tireRubber} />
      </mesh>

      {/* Garras em "V" */}
      <Instances>
        {/* Garras mais finas e altas */}
        <boxGeometry args={[width * 0.45, radius * 0.18, radius * 0.08]} />
        <primitive object={materials.tireRubber} />
        {treads.map((data, i) => {
            // Desloca metade das garras para a esquerda e metade para a direita para formar o V
            const xOffset = i % 2 === 0 ? width * 0.22 : -width * 0.22;
            return <Instance key={i} position={[xOffset, data.position[1], data.position[2]]} rotation={data.rotation as any} />
        })}
      </Instances>

      {/* Aro Metálico Amarelo Complexo */}
      <group rotation={[0, 0, Math.PI / 2]}>
          {/* Prato do aro */}
          <mesh position={[0, -width*0.1, 0]}>
            <cylinderGeometry args={[rimRadius, rimRadius * 0.8, 0.1, 32]} />
            <primitive object={materials.yellowPaint} />
          </mesh>
          {/* Borda do aro */}
          <mesh position={[0, width*0.48, 0]}>
             <torusGeometry args={[rimRadius, 0.04, 16, 32]} />
             <primitive object={materials.yellowPaint} />
          </mesh>
          {/* Cubo central de aço */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[rimRadius * 0.25, rimRadius * 0.3, width + 0.15, 16]} />
            <primitive object={materials.blackMetal} />
          </mesh>
          {/* Parafusos */}
          {[0,1,2,3,4,5,6,7].map((i) => {
              const a = (i/8)*Math.PI*2;
              const d = rimRadius * 0.4;
              return (
                  <mesh key={i} position={[Math.sin(a)*d, width*0.3, Math.cos(a)*d]}>
                      <cylinderGeometry args={[0.03, 0.03, 0.1, 6]} />
                      <primitive object={materials.silverMetal} />
                  </mesh>
              )
          })}
      </group>
    </group>
  );
};


// ==========================================
// COMPONENTE PRINCIPAL DO TRATOR
// ==========================================
export const TractorGreen = ({ position = [0, 0, 0], rotation = [0, 0, 0] }: any) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.6, 2.4, 3.2]} position={[0, 2.4, 0]} />

        {/* ================= CHASSI E MOTOR ================= */}
        <group position={[0, 1.4, 0]}>
          
          {/* Motor / Transmissão (Detalhes Mecânicos) */}
          <group position={[0, -0.2, 0.5]}>
              <RoundedBox args={[1.1, 1.2, 4.0]} radius={0.05} castShadow>
                <primitive object={materials.blackMetal} />
              </RoundedBox>
              {/* Cilindros/Filtros simulados nas laterais */}
              {[-1.2, 0, 1.2].map(z => (
                  <mesh key={z} position={[0.6, 0, z]} rotation={[0, 0, Math.PI/2]}>
                      <cylinderGeometry args={[0.2, 0.2, 1.4, 16]} />
                      <primitive object={materials.blackMetal} />
                  </mesh>
              ))}
          </group>
          
          {/* Eixo Dianteiro e Suspensão */}
          <group position={[0, -0.4, 2.8]}>
              <mesh rotation={[0, 0, Math.PI/2]}>
                  <cylinderGeometry args={[0.15, 0.15, 2.6, 16]} />
                  <primitive object={materials.blackMetal} />
              </mesh>
              <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.4, 0.6, 0.4]}/><primitive object={materials.blackMetal} /></mesh>
          </group>

          {/* CAPÔ (Hood) */}
          <group position={[0, 0.8, 1.5]}>
              {/* Peça principal do capô */}
              <RoundedBox args={[1.4, 1.1, 2.8]} radius={0.15} castShadow>
                <primitive object={materials.greenPaint} />
              </RoundedBox>
              
              {/* A FAIXA AMARELA LATERAL (Assinatura John Deere) */}
              <mesh position={[0.71, 0.2, 0]}><boxGeometry args={[0.02, 0.1, 2.5]} /><primitive object={materials.yellowPaint} /></mesh>
              <mesh position={[-0.71, 0.2, 0]}><boxGeometry args={[0.02, 0.1, 2.5]} /><primitive object={materials.yellowPaint} /></mesh>

              {/* Grade Frontal (Preta com moldura verde) */}
              <group position={[0, -0.1, 1.41]}>
                  <mesh><planeGeometry args={[1.2, 0.9]} /><meshStandardMaterial color="#050505" roughness={0.9} /></mesh>
                  {/* Faróis integrados na grade */}
                  <mesh position={[-0.4, 0.3, 0.01]}><boxGeometry args={[0.3, 0.15, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                  <mesh position={[0.4, 0.3, 0.01]}><boxGeometry args={[0.3, 0.15, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                  <spotLight position={[0, 0.3, 0.1]} angle={0.6} penumbra={0.4} intensity={20} distance={30} color={"#ffffee"} castShadow target-position={[0, -1, 10]} />
              </group>
          </group>

          {/* Pesos Frontais Detalhados */}
          <group position={[0, 0.2, 3.1]}>
             <RoundedBox args={[1.0, 0.7, 0.5]} radius={0.05} castShadow>
               <primitive object={materials.greenPaint} />
             </RoundedBox>
             {/* Fatias dos pesos (10 fatias) */}
             {[-0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35, 0.45].map((x, i) => (
                <mesh key={i} position={[x, 0, 0.26]}>
                   <boxGeometry args={[0.08, 0.65, 0.1]} />
                   <primitive object={materials.greenPaint} />
                </mesh>
             ))}
          </group>

          {/* Escapamento (Chaminé vertical) */}
          <group position={[0.8, 1.8, 0.8]}>
            <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.15, 0.15, 1.0, 16]}/><meshStandardMaterial color="#333" roughness={0.9}/></mesh>
            <mesh castShadow><cylinderGeometry args={[0.08, 0.08, 2.5, 16]} /><primitive object={materials.blackMetal} /></mesh>
            <mesh position={[0, 1.25, -0.1]} rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.3, 16]} /><primitive object={materials.blackMetal} /></mesh>
          </group>
        </group>


        {/* ================= CABINE SUPER DETALHADA ================= */}
        <group position={[0, 2.9, -1.2]}>
            
            {/* Interior Básico (Para ser visto pelo vidro) */}
            <group position={[0, -0.5, 0.5]}>
                {/* Banco */}
                <RoundedBox args={[0.8, 0.2, 0.8]} position={[0, 0, -0.2]}><primitive object={materials.blackMetal} /></RoundedBox>
                <RoundedBox args={[0.8, 0.9, 0.2]} position={[0, 0.5, -0.5]} rotation={[-0.1, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
                {/* Painel/Volante */}
                <mesh position={[0, 0.5, 0.8]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.08, 0.6]} /><primitive object={materials.blackMetal} /></mesh>
                <mesh position={[0, 0.7, 0.6]} rotation={[2.0, 0, 0]}><torusGeometry args={[0.3, 0.05, 16, 32]} /><primitive object={materials.blackMetal} /></mesh>
            </group>

            {/* Estrutura Verde (Rollcage) */}
            <group castShadow>
                {/* 6 Pilares para visual moderno */}
                <mesh position={[-0.8, 0.8, 1.2]}> <boxGeometry args={[0.12, 1.6, 0.12]} /> <primitive object={materials.greenPaint} /> </mesh>
                <mesh position={[0.8, 0.8, 1.2]}>  <boxGeometry args={[0.12, 1.6, 0.12]} /> <primitive object={materials.greenPaint} /> </mesh>
                
                <mesh position={[-0.8, 0.8, 0]}> <boxGeometry args={[0.1, 1.6, 0.1]} /> <primitive object={materials.blackMetal} /> </mesh>
                <mesh position={[0.8, 0.8, 0]}>  <boxGeometry args={[0.1, 1.6, 0.1]} /> <primitive object={materials.blackMetal} /> </mesh>

                <mesh position={[-0.8, 0.8, -1.2]}><boxGeometry args={[0.15, 1.6, 0.15]} /> <primitive object={materials.greenPaint} /> </mesh>
                <mesh position={[0.8, 0.8, -1.2]}> <boxGeometry args={[0.15, 1.6, 0.15]} /> <primitive object={materials.greenPaint} /> </mesh>
            </group>

            {/* Teto Verde com receptor GPS Amarelo */}
            <group position={[0, 1.65, 0]}>
                <RoundedBox args={[1.9, 0.25, 2.8]} radius={0.08} castShadow>
                    <primitive object={materials.greenPaint} />
                </RoundedBox>
                {/* O "Chapéu" do GPS John Deere StarFire */}
                <mesh position={[0, 0.2, 0.8]}>
                    <cylinderGeometry args={[0.2, 0.25, 0.2, 16]} />
                    <primitive object={materials.yellowPaint} />
                </mesh>
                
                {/* Luzes de Serviço (Worklights) */}
                <group position={[0, 0, 1.4]}>
                    <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                    <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                </group>
                <group position={[0, 0, -1.4]}>
                    <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.redLight} /></mesh>
                    <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.redLight} /></mesh>
                </group>
            </group>
            
            {/* Vidros */}
            <group>
                <mesh position={[0, 0.8, 1.25]} rotation={[0.05, 0, 0]}> <boxGeometry args={[1.5, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh> {/* Pára-brisa curvo */}
                <mesh position={[0, 0.8, -1.25]}> <boxGeometry args={[1.5, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh> {/* Traseiro */}
                <mesh position={[-0.82, 0.8, 0]} rotation={[0, Math.PI/2, 0]}> <boxGeometry args={[2.4, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh> {/* Porta Esq */}
                <mesh position={[0.82, 0.8, 0]} rotation={[0, Math.PI/2, 0]}> <boxGeometry args={[2.4, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh> {/* Porta Dir */}
            </group>

             {/* Degraus e Retrovisores */}
             <group position={[-1.2, -1.0, 0.5]}>
                <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.4, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                <mesh position={[0.1, 0.2, 0]}><boxGeometry args={[0.3, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                <mesh position={[0.2, -0.2, 0]}><boxGeometry args={[0.2, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
             </group>
             
             {/* Retrovisores longos */}
             {[-1, 1].map((side, i) => (
                 <group key={i} position={[side * 0.9, 1.0, 1.3]} rotation={[0, side * -0.2, 0]}>
                     <mesh position={[side * 0.4, 0, 0]} rotation={[0, 0, side * 1.57]}><cylinderGeometry args={[0.03, 0.03, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                     <mesh position={[side * 0.8, 0.2, 0]}><boxGeometry args={[0.2, 0.5, 0.05]} /><primitive object={materials.blackMetal} /></mesh>
                 </group>
             ))}
        </group>


        {/* ================= RODAS ================= */}
        {/* Traseiras - Gigantes */}
        <TractorWheel position={[-1.3, 1.8, -1.5]} rotation={[0, 0, Math.PI / 2]} radius={1.8} width={0.9} isRear={true} />
        <TractorWheel position={[1.3, 1.8, -1.5]} rotation={[0, 0, Math.PI / 2]} radius={1.8} width={0.9} isRear={true} />

        {/* Dianteiras */}
        <TractorWheel position={[-1.2, 1.1, 2.8]} rotation={[0, 0, Math.PI / 2]} radius={1.1} width={0.65} isRear={false} />
        <TractorWheel position={[1.2, 1.1, 2.8]} rotation={[0, 0, Math.PI / 2]} radius={1.1} width={0.65} isRear={false} />

        {/* ================= PARA-LAMAS (FENDERS) ================= */}
        {/* Para-lamas Traseiros Verdes Grandes */}
        <group position={[0, 3.2, -1.5]}>
            <RoundedBox args={[1.2, 0.1, 2.4]} radius={0.05} position={[-1.3, 0, 0]} rotation={[0.1, 0, 0]} castShadow><primitive object={materials.greenPaint} /></RoundedBox>
            <RoundedBox args={[1.2, 0.1, 2.4]} radius={0.05} position={[1.3, 0, 0]} rotation={[0.1, 0, 0]} castShadow><primitive object={materials.greenPaint} /></RoundedBox>
        </group>
        
        {/* Para-lamas Dianteiros Pretos Pequenos */}
        <group position={[0, 2.3, 2.8]}>
            <RoundedBox args={[0.8, 0.05, 1.6]} radius={0.02} position={[-1.2, 0, 0]} rotation={[0.2, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
            <RoundedBox args={[0.8, 0.05, 1.6]} radius={0.02} position={[1.2, 0, 0]} rotation={[0.2, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
        </group>

      </RigidBody>
    </group>
  );
};