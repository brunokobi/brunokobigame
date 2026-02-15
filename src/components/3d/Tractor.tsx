import { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// --- COMPONENTE DE RODA REALISTA (COM GARRAS) ---
const RealisticWheel = ({ position, radius, width, isRear }: { position: [number, number, number], radius: number, width: number, isRear: boolean }) => {
  
  // Materiais da roda
  const matRubber = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#151515", roughness: 0.9, metalness: 0.1, flatShading: false // Borracha escura e fosca
  }), []);
  const matRimSteel = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#eeeeee", roughness: 0.4, metalness: 0.6 // Aço pintado de branco/creme
  }), []);
  const matLugNuts = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#333333", roughness: 0.3, metalness: 0.8 // Parafusos escuros
  }), []);

  // Geração das garras do pneu (Treads)
  const numTreads = isRear ? 24 : 16; // Mais garras atrás
  const treads = useMemo(() => {
    const items = [];
    for (let i = 0; i < numTreads; i++) {
      const angle = (i / numTreads) * Math.PI * 2;
      items.push(
        <group key={i} rotation={[angle, 0, 0]}>
            {/* O "dente" do pneu, ligeiramente inclinado */}
           <mesh position={[0, radius - 0.05, 0]} rotation={[0, 0.2, 0]}> 
             <boxGeometry args={[width * 0.8, 0.15, 0.08]} />
             <primitive object={matRubber} />
           </mesh>
        </group>
      );
    }
    return items;
  }, [radius, width, numTreads, matRubber]);

  return (
    <group position={position}>
      {/* Carcaça Principal do Pneu */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.95, radius * 0.95, width, 32]} />
        <primitive object={matRubber} />
      </mesh>

      {/* As Garras do Pneu */}
      <group rotation={[0, 0, Math.PI / 2]}>
          {treads}
      </group>

      {/* Aro da Roda (Rim) - Com profundidade */}
      <group rotation={[0, 0, Math.PI / 2]}>
          {/* Centro Afundado */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[radius * 0.5, radius * 0.55, 0.1, 24]} />
            <primitive object={matRimSteel} />
          </mesh>
          {/* Borda Externa */}
          <mesh position={[0, -0.02, 0]}>
            <torusGeometry args={[radius * 0.55, 0.05, 12, 32]} />
            <primitive object={matRimSteel} />
          </mesh>

          {/* Parafusos da Roda (Lug Nuts) */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2;
              const dist = radius * 0.25;
              return (
                  <mesh key={i} position={[Math.sin(angle)*dist, 0.15, Math.cos(angle)*dist]}>
                      <cylinderGeometry args={[0.04, 0.04, 0.1, 6]} />
                      <primitive object={matLugNuts} />
                  </mesh>
              )
          })}
      </group>

      {/* Cubo do Eixo */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, width + 0.2, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.5} />
      </mesh>
    </group>
  );
};

// --- COMPONENTE PRINCIPAL DO TRATOR ---
export const Tractor = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
  
  // MATERIAIS REALISTAS
  const mats = useMemo(() => ({
    // Vermelho Agrícola: um pouco de brilho, mas com "casca de laranja" (rugosidade média)
    paintRed: new THREE.MeshStandardMaterial({ color: "#c41e3a", roughness: 0.3, metalness: 0.2, envMapIntensity: 0.5 }),
    // Metal do chassi/motor: Escuro, oleoso, metálico
    chassisMetal: new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.6, metalness: 0.8 }),
    // Vidro: Transparente, reflexivo
    glass: new THREE.MeshStandardMaterial({ color: "#aaddff", roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
    // Plástico preto/borrachas (para detalhes da cabine)
    blackTrim: new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.8 }),
    // Luzes
    lightLens: new THREE.MeshStandardMaterial({ color: "#ffffcc", roughness: 0.2, metalness: 0.5, transparent: true, opacity: 0.8 }),
    lightEmissive: new THREE.MeshStandardMaterial({ color: "#ffffaa", emissive: "#ffffaa", emissiveIntensity: 3, toneMapped: false }),
    tailLight: new THREE.MeshStandardMaterial({ color: "#ff0000", emissive: "#ff0000", emissiveIntensity: 1.5 }),
  }), []);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        {/* Collider principal ajustado para a nova forma */}
        <CuboidCollider args={[1.6, 1.8, 2.8]} position={[0, 1.8, 0]} />
        
        {/* ================= ESTRUTURA INFERIOR ================= */}
        {/* Bloco do Motor e Chassi (Usando RoundedBox para bordas suaves de metal fundido) */}
        <group position={[0, 1.1, 0.2]}>
            <RoundedBox args={[1.3, 1.0, 4.2]} radius={0.05} smoothness={4} castShadow>
                <primitive object={mats.chassisMetal} />
            </RoundedBox>
            {/* Detalhes laterais do motor (Aletas de refrigeração simuladas) */}
            {[-1, 0, 1].map(z => (
                <group key={z} position={[0, 0, z - 1]}>
                    <mesh position={[0.66, 0, 0]}>
                        <boxGeometry args={[0.05, 0.8, 0.6]} />
                        <primitive object={mats.chassisMetal} />
                    </mesh>
                    <mesh position={[-0.66, 0, 0]}>
                        <boxGeometry args={[0.05, 0.8, 0.6]} />
                        <primitive object={mats.chassisMetal} />
                    </mesh>
                </group>
            ))}
        </group>

        {/* Eixo Dianteiro Detalhado */}
        <group position={[0, 0.8, -2]}>
             <mesh rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.12, 0.12, 2.2, 16]} />
                <primitive object={mats.chassisMetal} />
             </mesh>
             {/* Pivôs de direção */}
             <mesh position={[1, 0, 0]}>
                 <boxGeometry args={[0.3, 0.4, 0.3]} />
                 <primitive object={mats.chassisMetal} />
             </mesh>
             <mesh position={[-1, 0, 0]}>
                 <boxGeometry args={[0.3, 0.4, 0.3]} />
                 <primitive object={mats.chassisMetal} />
             </mesh>
        </group>


        {/* ================= CAPÔ (HOOD) E GRADE ================= */}
        <group position={[0, 2.05, -1.3]}>
            {/* Capô principal suavizado */}
            <RoundedBox args={[1.4, 1.2, 2.4]} radius={0.1} smoothness={8} castShadow>
                <primitive object={mats.paintRed} />
            </RoundedBox>
            
            {/* Nariz do Capô (Mais estreito na frente) */}
            <group position={[0, -0.1, -1.3]}>
                 <RoundedBox args={[1.3, 1.0, 0.4]} radius={0.08} smoothness={4} castShadow>
                    <primitive object={mats.paintRed} />
                </RoundedBox>
            </group>

            {/* Grade Frontal Detalhada */}
            <group position={[0, -0.1, -1.51]}>
                {/* Moldura da grade */}
                 <mesh>
                    <planeGeometry args={[1.1, 0.8]} />
                    <meshStandardMaterial color="#111" roughness={0.5} />
                </mesh>
                {/* Barras horizontais da grade */}
                {[-0.3, -0.15, 0, 0.15, 0.3].map((y, i) => (
                    <mesh key={i} position={[0, y, 0.02]}>
                        <boxGeometry args={[1.0, 0.05, 0.02]} />
                        <meshStandardMaterial color="#333" metalness={0.8} />
                    </mesh>
                ))}
                 {/* Logo Central */}
                 <mesh position={[0, 0.1, 0.04]}>
                     <circleGeometry args={[0.1, 16]} />
                     <meshStandardMaterial color="#silver" metalness={1} roughness={0.2} />
                 </mesh>
            </group>
        </group>


        {/* ================= CABINE REALISTA ================= */}
        <group position={[0, 2.9, 1.3]}>
           
           {/* Estrutura ROPS (Roll Over Protection Structure) - Pilares mais finos */}
           <group castShadow>
               {/* Pilares Traseiros */}
               <mesh position={[-0.8, 0, 0.9]}> <boxGeometry args={[0.15, 2, 0.15]} /> <primitive object={mats.paintRed} /> </mesh>
               <mesh position={[0.8, 0, 0.9]}>  <boxGeometry args={[0.15, 2, 0.15]} /> <primitive object={mats.paintRed} /> </mesh>
               {/* Pilares Dianteiros */}
               <mesh position={[-0.8, 0, -0.9]}> <boxGeometry args={[0.12, 2, 0.12]} /> <primitive object={mats.paintRed} /> </mesh>
               <mesh position={[0.8, 0, -0.9]}>  <boxGeometry args={[0.12, 2, 0.12]} /> <primitive object={mats.paintRed} /> </mesh>
               
               {/* Teto Suavizado */}
               <group position={[0, 1.05, 0]}>
                    <RoundedBox args={[1.9, 0.15, 2.3]} radius={0.05} smoothness={4} castShadow receiveShadow>
                         <meshStandardMaterial color="#eeeeee" roughness={0.4} />
                    </RoundedBox>
               </group>
           </group>

           {/* Vidros com "Borracha" em volta */}
           <group>
               {/* Para-brisa Dianteiro */}
               <mesh position={[0, 0, -0.88]}>
                   <boxGeometry args={[1.55, 1.9, 0.05]} />
                   <primitive object={mats.glass} />
               </mesh>
               {/* Vidro Traseiro */}
               <mesh position={[0, 0, 0.88]}>
                   <boxGeometry args={[1.55, 1.9, 0.05]} />
                   <primitive object={mats.glass} />
               </mesh>
               {/* Vidros Laterais */}
               <mesh position={[-0.78, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[1.75, 1.9, 0.05]} />
                   <primitive object={mats.glass} />
               </mesh>
               <mesh position={[0.78, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                   <boxGeometry args={[1.75, 1.9, 0.05]} />
                   <primitive object={mats.glass} />
               </mesh>
           </group>

           {/* Interior Básico Detalhado */}
           <group position={[0, -0.8, 0.3]}>
               {/* Banco */}
               <RoundedBox args={[0.9, 0.2, 0.9]} radius={0.1} smoothness={4} position={[0, 0.1, 0]}>
                   <meshStandardMaterial color="#333" roughness={1} />
               </RoundedBox>
               <RoundedBox args={[0.9, 1.0, 0.2]} radius={0.1} smoothness={4} position={[0, 0.6, 0.4]} rotation={[-0.2, 0, 0]}>
                   <meshStandardMaterial color="#333" roughness={1} />
               </RoundedBox>
               
               {/* Coluna de Direção e Volante */}
               <group position={[0, 0.4, -1.0]}>
                    <mesh rotation={[0.5, 0, 0]}>
                        <cylinderGeometry args={[0.06, 0.08, 0.8]} />
                        <primitive object={mats.blackTrim} />
                    </mesh>
                    <mesh position={[0, 0.45, -0.2]} rotation={[1.8, 0, 0]}>
                        <torusGeometry args={[0.35, 0.06, 12, 32]} />
                        <primitive object={mats.blackTrim} />
                    </mesh>
               </group>
           </group>

           {/* Detalhes Externos da Cabine */}
           {/* Degraus (Steps) Lado Esquerdo */}
           <group position={[-1.1, -1.5, 0.5]}>
                <mesh position={[0, 0, 0]}> <boxGeometry args={[0.4, 0.05, 0.8]} /> <primitive object={mats.chassisMetal} /> </mesh>
                <mesh position={[0.1, 0.5, 0]}> <boxGeometry args={[0.3, 0.05, 0.8]} /> <primitive object={mats.chassisMetal} /> </mesh>
                {/* Suporte dos degraus */}
                <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, 0.2]}> <boxGeometry args={[0.05, 1.2, 0.05]} /> <primitive object={mats.chassisMetal} /> </mesh>
           </group>
           
           {/* Espelhos Retrovisores */}
           {[-1, 1].map((side, i) => (
               <group key={i} position={[side * 1.1, 0.8, -0.9]} rotation={[0, side * -0.3, 0]}>
                   {/* Haste */}
                   <mesh position={[side * -0.1, 0, 0]} rotation={[0, 0, side * 0.5]}>
                       <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                       <primitive object={mats.blackTrim} />
                   </mesh>
                   {/* Espelho */}
                   <RoundedBox position={[side * 0.1, 0.2, 0]} args={[0.2, 0.4, 0.05]} radius={0.02}>
                       <primitive object={mats.blackTrim} />
                   </RoundedBox>
                   {/* Superfície reflexiva */}
                   <mesh position={[side * 0.1, 0.2, 0.03]}>
                       <planeGeometry args={[0.18, 0.38]} />
                       <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
                   </mesh>
               </group>
           ))}
        </group>


        {/* ================= RODAS REALISTAS ================= */}
        {/* Traseiras (Grandes, com mais garras) */}
        <RealisticWheel position={[-1.1, 1.25, 1.8]} radius={1.25} width={0.75} isRear={true} />
        <RealisticWheel position={[1.1, 1.25, 1.8]} radius={1.25} width={0.75} isRear={true} />

        {/* Dianteiras (Pequenas, menos garras) */}
        <RealisticWheel position={[-1.1, 0.85, -2.0]} radius={0.85} width={0.55} isRear={false} />
        <RealisticWheel position={[1.1, 0.85, -2.0]} radius={0.85} width={0.55} isRear={false} />


        {/* ================= PARA-LAMAS (FENDERS) ================= */}
        {/* Traseiros - Curvados (Simulados com múltiplas caixas rotacionadas) */}
        {[-1, 1].map((side, i) => (
            <group key={i} position={[side * 1.0, 2.6, 1.8]}>
                {/* Topo */}
                <RoundedBox args={[0.85, 0.08, 1.2]} radius={0.04} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
                    <primitive object={mats.paintRed} />
                </RoundedBox>
                {/* Parte traseira inclinada */}
                <RoundedBox args={[0.85, 0.08, 1.0]} radius={0.04} position={[0, -0.3, 1.0]} rotation={[-0.5, 0, 0]}>
                    <primitive object={mats.paintRed} />
                </RoundedBox>
            </group>
        ))}
        
        {/* Dianteiros - Menores, rotacionam com a roda (aqui estáticos para simplificar) */}
        {[-1, 1].map((side, i) => (
            <group key={i} position={[side * 1.1, 1.8, -2.0]}>
                 <RoundedBox args={[0.6, 0.05, 1.4]} radius={0.02} rotation={[0.1, 0, 0]}>
                    <primitive object={mats.blackTrim} />
                </RoundedBox>
            </group>
        ))}


        {/* ================= DETALHES FINAIS ================= */}
        
        {/* Escapamento (Chaminé) Detalhado */}
        <group position={[0.7, 3.0, -1.6]}>
           {/* Base com proteção térmica */}
           <mesh position={[0, -0.5, 0]}>
             <cylinderGeometry args={[0.12, 0.12, 1.2]} />
             <meshStandardMaterial color="#555" roughness={0.7} /> {/* Metal perfurado simulado */}
           </mesh>
           {/* Tubo principal */}
           <mesh castShadow>
             <cylinderGeometry args={[0.08, 0.08, 2.2]} />
             <primitive object={mats.chassisMetal} />
           </mesh>
           {/* Curva no topo (Rain cap) */}
           <group position={[0, 1.1, 0]} rotation={[0, 0, -0.2]}>
                <mesh rotation={[0.5, 0, 0]} position={[0, 0.1, -0.05]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.4]} />
                     <primitive object={mats.chassisMetal} />
                </mesh>
           </group>
        </group>
        
        {/* Filtro de Ar (Do outro lado do capô) */}
        <group position={[-0.7, 2.5, -1.8]}>
            <mesh>
                <cylinderGeometry args={[0.15, 0.15, 0.6]} />
                <primitive object={mats.blackTrim} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2]} />
                <primitive object={mats.blackTrim} />
            </mesh>
        </group>


        {/* ================= ILUMINAÇÃO (Com lentes físicas) ================= */}
        
        {/* Faróis Dianteiros no Capô */}
        <group position={[0, 2.1, -2.55]}>
           {[-0.6, 0.6].map((x, i) => (
               <group key={i} position={[x, 0, 0]}>
                   {/* Carcaça do farol */}
                   <mesh rotation={[1.57, 0, 0]}>
                      <cylinderGeometry args={[0.18, 0.15, 0.2, 16]} />
                      <primitive object={mats.blackTrim} />
                   </mesh>
                   {/* Lente de vidro */}
                   <mesh rotation={[1.57, 0, 0]} position={[0, 0, -0.11]}>
                      <circleGeometry args={[0.14, 16]} />
                      <primitive object={mats.lightLens} />
                   </mesh>
                   {/* O emissor de luz (brilho) */}
                   <mesh rotation={[1.57, 0, 0]} position={[0, 0, -0.12]}>
                      <circleGeometry args={[0.12, 16]} />
                      <primitive object={mats.lightEmissive} />
                   </mesh>
                   {/* A luz real */}
                   <spotLight angle={0.5} penumbra={0.4} intensity={10} distance={30} color="#ffffdd" castShadow target-position={[x, 0, -15]} />
               </group>
           ))}
        </group>

        {/* Luzes de Trabalho no Teto da Cabine (Dianteiras e Traseiras) */}
        <group position={[0, 4.05, 1.3]}>
            {/* Dianteiras */}
            {[-0.7, 0.7].map((x, i) => (
                <mesh key={`front-${i}`} position={[x, 0, -1.15]}>
                    <boxGeometry args={[0.25, 0.15, 0.1]} />
                    <primitive object={mats.lightEmissive} />
                    <spotLight angle={0.6} penumbra={0.5} intensity={5} distance={15} color="#ffffaa" target-position={[x, -5, -10]} />
                </mesh>
            ))}
             {/* Traseiras (Vermelhas/Freio) */}
            {[-0.7, 0.7].map((x, i) => (
                <mesh key={`rear-${i}`} position={[x, 0, 1.15]}>
                    <boxGeometry args={[0.25, 0.15, 0.1]} />
                    <primitive object={mats.tailLight} />
                </mesh>
            ))}
        </group>

      </RigidBody>
    </group>
  );
};