import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Stars, PerspectiveCamera, OrbitControls, Cloud, Environment, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { UFO } from './UFO';
import { Ground } from './Ground';
import { Barn } from './Barn';
import { HoloCubes } from './HoloCubes';
import { TechCows } from './TechCows';
import { Antenna } from './Antenna';
import { Moon } from './Moon';

/* =========================================
   COMPONENTE: ESTRADA RURAL (ESTREITA E REALISTA)
   ========================================= */
const Road = () => {
  const LENGTH = 500; 
  const WIDTH = 7; // Estreita (era 14)
  
  const stripePositions = useMemo(() => {
    const arr = [];
    // Espaçamento maior (20m) típico de estradas rurais simples
    for (let i = -LENGTH / 2; i < LENGTH / 2; i += 20) arr.push(i); 
    return arr;
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Asfalto Velho e Áspero */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshStandardMaterial 
            color="#222222"      // Cinza chumbo
            roughness={0.9}      // Bem áspero
            metalness={0.1}      // Pouco reflexo
        />
      </mesh>

      {/* Faixas Centrais (Amarelo queimado e finas) */}
      <Instances range={stripePositions.length}>
        <planeGeometry args={[0.15, 3]} /> 
        <meshBasicMaterial color="#ccbb55" opacity={0.7} transparent /> 
        {stripePositions.map((z, i) => (
          <Instance key={i} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>
    </group>
  );
};

/* =========================================
   COMPONENTE: PLANTAÇÃO DE MILHO
   ========================================= */
const CornField = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const COUNT = 400; 
  const SIZE = 25; 

  const stalks = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SIZE;
      const z = (Math.random() - 0.5) * SIZE;
      const h = 1.5 + Math.random() * 1.5; 
      const rot = Math.random() * Math.PI;
      temp.push({ x, z, h, rot });
    }
    return temp;
  }, []);

  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
  });

  return (
    <group position={position} rotation={rotation as any} ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial color="#221100" roughness={1} />
      </mesh>
      <Instances range={COUNT}>
        <cylinderGeometry args={[0.05, 0.1, 1, 5]} />
        <meshStandardMaterial color="#336633" roughness={0.8} />
        {stalks.map((data, i) => (
          <Instance key={i} position={[data.x, data.h / 2, data.z]} scale={[1, data.h, 1]} rotation={[0, data.rot, 0]} />
        ))}
      </Instances>
      <Instances range={COUNT}>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color="#ccaa00" />
        {stalks.map((data, i) => (
          <Instance key={i} position={[data.x, data.h * 0.7, data.z]} rotation={[0.5, data.rot, 0]} />
        ))}
      </Instances>
    </group>
  );
};

/* =========================================
   COMPONENTE: TRATOR
   ========================================= */
const Tractor = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation as any}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.5, 2, 2.5]} position={[0, 2, 0]} />
        <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[1.8, 1, 3.5]} /><meshStandardMaterial color="#aa0000" roughness={0.2} /></mesh>
        <group position={[0, 2.2, 0.5]}>
           <mesh castShadow><boxGeometry args={[1.6, 1.5, 1.8]} /><meshStandardMaterial color="#880000" /></mesh>
           <mesh position={[0, 0.2, 0.91]}><planeGeometry args={[1.4, 1]} /><meshStandardMaterial color="#88ccff" emissive="#446688" emissiveIntensity={0.5} /></mesh>
        </group>
        {[-1.1, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 1, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[1, 1, 0.6, 16]} />
            <meshStandardMaterial color="#111111" />
            <mesh position={[0, 0.31, 0]}><circleGeometry args={[0.5, 16]} /><meshStandardMaterial color="#ddcc00" /></mesh>
          </mesh>
        ))}
        {[-1, 1].map((x, i) => (
          <mesh key={i} position={[x, 0.6, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
            <meshStandardMaterial color="#111111" />
            <mesh position={[0, 0.21, 0]}><circleGeometry args={[0.3, 16]} /><meshStandardMaterial color="#ddcc00" /></mesh>
          </mesh>
        ))}
        <group position={[0, 1.2, -1.8]}>
           {[-0.5, 0.5].map((x, i) => (
             <group key={i} position={[x, 0, 0]}>
               <mesh><boxGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="#ffffaa" emissive="#ffffaa" /></mesh>
               <spotLight position={[0, 0, -0.1]} angle={0.6} penumbra={0.4} intensity={8} distance={25} color="#ffffaa" castShadow target-position={[x, -2, -15]} />
             </group>
           ))}
        </group>
      </RigidBody>
    </group>
  );
};

/* =========================================
   HORIZONTE ROCHOSO (AJUSTADO: FUNDO + DIREITA DISTANTE)
   ========================================= */
const RockyHorizon = () => {
  const rocks = useMemo(() => {
    const items = [];
    const count = 120; // Reduzi de 200 para 120 para ficar menos denso
    const minRadius = 90; // Aumentei o raio mínimo para afastar mais
    const maxRadius = 180;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      // --- LÓGICA DE FILTRO (REFINADA) ---
      // Aceita se:
      // 1. Estiver no Fundo Profundo (Z < -50)
      // 2. OU Estiver BEM na Direita (X > 80) e um pouco recuada (Z < 10)
      //    Isso garante que "apenas um pouco" apareça na direita, bem longe.
      const isBackground = z < -50;
      const isFarRight = x > 80 && z < 10;

      if (!isBackground && !isFarRight) {
        continue; // Pula a pedra se não for fundo nem direita distante
      }

      // Variação de tamanho
      const scaleW = 15 + Math.random() * 20; 
      const scaleH = 20 + Math.random() * 30; 
      
      items.push({ 
        pos: [x, -5, z], 
        scale: [scaleW, scaleH, scaleW], 
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] 
      });
    }
    return items;
  }, []);

  return (
    <group>
      {rocks.map((rock: any, i) => (
        <mesh key={i} position={rock.pos} rotation={rock.rot as any} scale={rock.scale}>
          <dodecahedronGeometry args={[1, 0]} /> 
          <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} flatShading={true} />
        </mesh>
      ))}
      
      {/* Nuvens ao fundo para dar acabamento */}
      <group position={[0, 20, -80]}>
         <Cloud opacity={0.2} speed={0.1} segments={10} color="#8899aa" width={60} depth={10} />
      </group>
    </group>
  );
};

/* =========================================
   CONTEÚDO DA CENA
   ========================================= */
const SceneContent = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 25, 55]} fov={55} />
      <OrbitControls enablePan={false} minDistance={15} maxDistance={80} maxPolarAngle={Math.PI / 2.05} target={[0, 0, 0]} />

      <ambientLight intensity={0.1} color="#444455" />
      <directionalLight position={[-50, 40, -50]} intensity={2.5} color="#aaddff" castShadow shadow-bias={-0.0001} />
      <spotLight position={[50, 20, 50]} intensity={1} color="#aa88cc" angle={1} penumbra={1} />
      <Environment preset="night" blur={0.6} background={false} />
      <fogExp2 attach="fog" args={['#050510', 0.012]} /> 
      <Stars radius={120} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      <Moon />
      <RockyHorizon />

      <Physics gravity={[0, -9.81, 0]}>
        
        {/* ESTRADA NOVA (ESTREITA) */}
        <Road />
        <UFO />
        <Ground />

        {/* LADO ESQUERDO: ZONA RURAL */}
        <group position={[-25, 0, 0]}>
           <group position={[-5, 0, -20]}> 
             <CornField />
           </group>
           <Tractor position={[0, 0, -2]} rotation={[0, 0.5, 0]} />
           <group position={[5, 0, 10]}>
             <TechCows />
           </group>
        </group>

        {/* LADO DIREITO: ZONA TECH */}
        {/* Antena mantida em X=6 (colada no celeiro) */}
        <group position={[25, 0, 0]}>
           
           <group position={[0, 0, -5]} rotation={[0, -0.2, 0]}>
             <Barn />
           </group>

           <group position={[6, 0, -5]} rotation={[0, -0.6, 0]}>
             <Antenna />
           </group>

           <group position={[0, 0, 10]}>
             <group position={[-13, 0, 0]}> 
                <HoloCubes /> 
             </group>
           </group>

        </group>

      </Physics>
    </>
  );
};

export const Scene = () => {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: '#050510' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};