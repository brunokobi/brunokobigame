import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// PALETA DE CORES JOHN DEERE 
// ==========================================
const JD_GREEN = "#367c2b";
const JD_YELLOW = "#ffde00";
const TIRE_BLACK = "#1a1a1a"; 
const METAL_BLACK = "#1a1a1a";
const GLASS_COLOR = "#88ccff";
const LIGHT_OFF_WHITE = "#ffffff";

const materials = {
  greenPaint: new THREE.MeshStandardMaterial({ color: JD_GREEN, roughness: 0.25, metalness: 0.15 }),
  yellowPaint: new THREE.MeshStandardMaterial({ color: JD_YELLOW, roughness: 0.3, metalness: 0.1 }),
  tireRubber: new THREE.MeshStandardMaterial({ color: TIRE_BLACK, roughness: 0.8, flatShading: false }),
  blackMetal: new THREE.MeshStandardMaterial({ color: METAL_BLACK, roughness: 0.8, metalness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ color: GLASS_COLOR, roughness: 0.05, metalness: 0.9, opacity: 0.4, transparent: true, side: THREE.DoubleSide }),
  lightLens: new THREE.MeshStandardMaterial({ color: LIGHT_OFF_WHITE, emissive: LIGHT_OFF_WHITE, emissiveIntensity: 1.0 }),
  redLight: new THREE.MeshStandardMaterial({ color: "#ff0000", emissive: "#ff0000", emissiveIntensity: 1.0 }),
};

// ==========================================
// SUB-COMPONENTE: RODA SIMPLES
// ==========================================
const TractorWheel = ({ radius, width, position }: any) => {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <primitive object={materials.tireRubber} />
      </mesh>
    </group>
  );
};


// ==========================================
// COMPONENTE PRINCIPAL DO TRATOR
// ==========================================
// MUDANÇA AQUI: scale = 0.75 (Trator em 3/4 do tamanho original)
export const TractorGreen = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.75 }: any) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false}>
        
        {/* O colisor físico escala junto automaticamente */}
        <CuboidCollider 
            args={[1.6 * scale, 2.4 * scale, 3.2 * scale]} 
            position={[0, 2.4 * scale, 0]} 
        />

        {/* Agrupamos toda a parte visual e aplicamos a escala nela */}
        <group scale={scale}>
            {/* ================= CHASSI E MOTOR ================= */}
            <group position={[0, 1.4, 0]}>
            
            <group position={[0, -0.2, 0.5]}>
                <RoundedBox args={[1.1, 1.2, 4.0]} radius={0.05} castShadow>
                    <primitive object={materials.blackMetal} />
                </RoundedBox>
                {[-1.2, 0, 1.2].map(z => (
                    <mesh key={z} position={[0.6, 0, z]} rotation={[0, 0, Math.PI/2]}>
                        <cylinderGeometry args={[0.2, 0.2, 1.4, 16]} />
                        <primitive object={materials.blackMetal} />
                    </mesh>
                ))}
            </group>
            
            <group position={[0, -0.4, 2.8]}>
                <mesh rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.15, 0.15, 2.6, 16]} />
                    <primitive object={materials.blackMetal} />
                </mesh>
                <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.4, 0.6, 0.4]}/><primitive object={materials.blackMetal} /></mesh>
            </group>

            <group position={[0, 0.8, 1.5]}>
                <RoundedBox args={[1.4, 1.1, 2.8]} radius={0.15} castShadow>
                    <primitive object={materials.greenPaint} />
                </RoundedBox>
                
                <mesh position={[0.71, 0.2, 0]}><boxGeometry args={[0.02, 0.1, 2.5]} /><primitive object={materials.yellowPaint} /></mesh>
                <mesh position={[-0.71, 0.2, 0]}><boxGeometry args={[0.02, 0.1, 2.5]} /><primitive object={materials.yellowPaint} /></mesh>

                <group position={[0, -0.1, 1.41]}>
                    <mesh><planeGeometry args={[1.2, 0.9]} /><meshStandardMaterial color="#050505" roughness={0.9} /></mesh>
                    <mesh position={[-0.4, 0.3, 0.01]}><boxGeometry args={[0.3, 0.15, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                    <mesh position={[0.4, 0.3, 0.01]}><boxGeometry args={[0.3, 0.15, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                    <spotLight position={[0, 0.3, 0.1]} angle={0.6} penumbra={0.4} intensity={20} distance={30} color={"#ffffee"} castShadow target-position={[0, -1, 10]} />
                </group>
            </group>

            <group position={[0, 0.2, 3.1]}>
                <RoundedBox args={[1.0, 0.7, 0.5]} radius={0.05} castShadow>
                <primitive object={materials.greenPaint} />
                </RoundedBox>
                {[-0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35, 0.45].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0.26]}>
                    <boxGeometry args={[0.08, 0.65, 0.1]} />
                    <primitive object={materials.greenPaint} />
                    </mesh>
                ))}
            </group>

            <group position={[0.8, 1.8, 0.8]}>
                <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.15, 0.15, 1.0, 16]}/><meshStandardMaterial color="#333" roughness={0.9}/></mesh>
                <mesh castShadow><cylinderGeometry args={[0.08, 0.08, 2.5, 16]} /><primitive object={materials.blackMetal} /></mesh>
                <mesh position={[0, 1.25, -0.1]} rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.3, 16]} /><primitive object={materials.blackMetal} /></mesh>
            </group>
            </group>


            {/* ================= CABINE ================= */}
            <group position={[0, 2.9, -1.2]}>
                
                <group position={[0, -0.5, 0.5]}>
                    <RoundedBox args={[0.8, 0.2, 0.8]} position={[0, 0, -0.2]}><primitive object={materials.blackMetal} /></RoundedBox>
                    <RoundedBox args={[0.8, 0.9, 0.2]} position={[0, 0.5, -0.5]} rotation={[-0.1, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
                    <mesh position={[0, 0.5, 0.8]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.05, 0.08, 0.6]} /><primitive object={materials.blackMetal} /></mesh>
                    <mesh position={[0, 0.7, 0.6]} rotation={[2.0, 0, 0]}><torusGeometry args={[0.3, 0.05, 16, 32]} /><primitive object={materials.blackMetal} /></mesh>
                </group>

                <group castShadow>
                    <mesh position={[-0.8, 0.8, 1.2]}> <boxGeometry args={[0.12, 1.6, 0.12]} /> <primitive object={materials.greenPaint} /> </mesh>
                    <mesh position={[0.8, 0.8, 1.2]}>  <boxGeometry args={[0.12, 1.6, 0.12]} /> <primitive object={materials.greenPaint} /> </mesh>
                    
                    <mesh position={[-0.8, 0.8, 0]}> <boxGeometry args={[0.1, 1.6, 0.1]} /> <primitive object={materials.blackMetal} /> </mesh>
                    <mesh position={[0.8, 0.8, 0]}>  <boxGeometry args={[0.1, 1.6, 0.1]} /> <primitive object={materials.blackMetal} /> </mesh>

                    <mesh position={[-0.8, 0.8, -1.2]}><boxGeometry args={[0.15, 1.6, 0.15]} /> <primitive object={materials.greenPaint} /> </mesh>
                    <mesh position={[0.8, 0.8, -1.2]}> <boxGeometry args={[0.15, 1.6, 0.15]} /> <primitive object={materials.greenPaint} /> </mesh>
                </group>

                <group position={[0, 1.65, 0]}>
                    <RoundedBox args={[1.9, 0.25, 2.8]} radius={0.08} castShadow>
                        <primitive object={materials.greenPaint} />
                    </RoundedBox>
                    <mesh position={[0, 0.2, 0.8]}>
                        <cylinderGeometry args={[0.2, 0.25, 0.2, 16]} />
                        <primitive object={materials.yellowPaint} />
                    </mesh>
                    
                    <group position={[0, 0, 1.4]}>
                        <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                        <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.lightLens} /></mesh>
                    </group>
                    <group position={[0, 0, -1.4]}>
                        <mesh position={[-0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.redLight} /></mesh>
                        <mesh position={[0.6, 0, 0]}><boxGeometry args={[0.25, 0.1, 0.05]} /><primitive object={materials.redLight} /></mesh>
                    </group>
                </group>
                
                <group>
                    <mesh position={[0, 0.8, 1.25]} rotation={[0.05, 0, 0]}> <boxGeometry args={[1.5, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh>
                    <mesh position={[0, 0.8, -1.25]}> <boxGeometry args={[1.5, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh>
                    <mesh position={[-0.82, 0.8, 0]} rotation={[0, Math.PI/2, 0]}> <boxGeometry args={[2.4, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh>
                    <mesh position={[0.82, 0.8, 0]} rotation={[0, Math.PI/2, 0]}> <boxGeometry args={[2.4, 1.5, 0.02]} /> <primitive object={materials.glass} /> </mesh>
                </group>

                <group position={[-1.2, -1.0, 0.5]}>
                    <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.4, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                    <mesh position={[0.1, 0.2, 0]}><boxGeometry args={[0.3, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                    <mesh position={[0.2, -0.2, 0]}><boxGeometry args={[0.2, 0.05, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                </group>
                
                {[-1, 1].map((side, i) => (
                    <group key={i} position={[side * 0.9, 1.0, 1.3]} rotation={[0, side * -0.2, 0]}>
                        <mesh position={[side * 0.4, 0, 0]} rotation={[0, 0, side * 1.57]}><cylinderGeometry args={[0.03, 0.03, 0.8]} /><primitive object={materials.blackMetal} /></mesh>
                        <mesh position={[side * 0.8, 0.2, 0]}><boxGeometry args={[0.2, 0.5, 0.05]} /><primitive object={materials.blackMetal} /></mesh>
                    </group>
                ))}
            </group>


            {/* ================= RODAS SIMPLES ================= */}
            <TractorWheel position={[-1.3, 1.8, -1.5]} radius={1.8} width={0.9} />
            <TractorWheel position={[1.3, 1.8, -1.5]} radius={1.8} width={0.9} />

            <TractorWheel position={[-1.2, 1.1, 2.8]} radius={1.1} width={0.65} />
            <TractorWheel position={[1.2, 1.1, 2.8]} radius={1.1} width={0.65} />

            {/* ================= PARA-LAMAS (FENDERS) ================= */}
            <group position={[0, 3.2, -1.5]}>
                <RoundedBox args={[1.2, 0.1, 2.4]} radius={0.05} position={[-1.3, 0, 0]} rotation={[0.1, 0, 0]} castShadow><primitive object={materials.greenPaint} /></RoundedBox>
                <RoundedBox args={[1.2, 0.1, 2.4]} radius={0.05} position={[1.3, 0, 0]} rotation={[0.1, 0, 0]} castShadow><primitive object={materials.greenPaint} /></RoundedBox>
            </group>
            
            <group position={[0, 2.4, 2.8]}>
                <RoundedBox args={[0.7, 0.05, 1.4]} radius={0.02} position={[-1.2, 0, 0]} rotation={[0.1, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
                <RoundedBox args={[0.7, 0.05, 1.4]} radius={0.02} position={[1.2, 0, 0]} rotation={[0.1, 0, 0]}><primitive object={materials.blackMetal} /></RoundedBox>
            </group>
        </group>

      </RigidBody>
    </group>
  );
};