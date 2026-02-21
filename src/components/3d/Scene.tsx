import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Stars, PerspectiveCamera, OrbitControls, Cloud, Environment, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// Importação dos seus componentes externos
import { UFO } from './UFO';
import { Ground } from './Ground'; 
import { Barn } from './Barn';
import { HoloCubes } from './HoloCubes';
import { TechCows } from './TechCows';
import { Antenna } from './Antenna';
import { Moon } from './Moon';
import { Scoreboard3D } from './Scoreboard3D'; 

// --- IMPORTAÇÃO DO E.T. ---
import { ETBikeVoxel } from './ETBikeVoxel'; 

/* =========================================
   COMPONENTE: E.T. VOADOR (EASTER EGG ANIMADO)
   ========================================= */
const FlyingET = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Pega o tempo decorrido desde que a cena carregou
    const t = state.clock.getElapsedTime();

    // Duração da transição para ambos os voos
    const duracaoTransicao = 30;

    // Tempos de início para os dois voos
    const inicioVoo1 = 15;
    const fimVoo1 = inicioVoo1 + duracaoTransicao; // 45s

    // 1 minuto e 58 segundos são 118 segundos (60 + 58)
    const inicioVoo2 = 118;
    const fimVoo2 = inicioVoo2 + duracaoTransicao; // 148s

    let isFlying = false;
    let progress = 0;

    // Checa em qual janela de tempo estamos
    if (t >= inicioVoo1 && t <= fimVoo1) {
      isFlying = true;
      progress = (t - inicioVoo1) / duracaoTransicao;
    } else if (t >= inicioVoo2 && t <= fimVoo2) {
      isFlying = true;
      progress = (t - inicioVoo2) / duracaoTransicao;
    }

    // Se estiver no momento de voar, aplica a animação
    if (isFlying) {
      // Move do eixo X=120 (direita invisível) para X=-120 (esquerda invisível)
      const startX = 120;
      const endX = -120;
      const currentX = startX + (endX - startX) * progress;

      // Altura Y: Sobe no meio da tela (arco) e tem um pequeno balanço (seno)
      // Ajustei o arco para ser um pouco mais suave devido à transição mais longa
      const arcHeight = Math.sin(progress * Math.PI) * 15; 
      const floatEffect = Math.sin(t * 4) * 0.5;
      const currentY = 25 + arcHeight + floatEffect;

      // Eixo Z: Profundidade (atrás das pedras)
      const currentZ = -75;

      groupRef.current.position.set(currentX, currentY, currentZ);
      groupRef.current.visible = true;

      // Inclina a frente da bike suavemente com o movimento
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.05;
    } else {
      // Fora dessas duas janelas de tempo, ele fica invisível
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Escala multiplicada por 2.5 para dar pra ver de longe.
        Rotação no eixo Y ajustada para a bicicleta encarar a esquerda (-X) 
      */}
      <group rotation={[0, -Math.PI / 1.5, 0]} scale={[2.5, 2.5, 2.5]}>
        <ETBikeVoxel />
      </group>
    </group>
  );
};

/* =========================================
   COMPONENTE: ESTRADA COM MEIO-FIO (CURBS)
   ========================================= */
const Road = () => {
  const LENGTH = 500; 
  const WIDTH = 7; 
  const CURB_WIDTH = 0.5; 
  const CURB_HEIGHT = 0.15; 

  const stripePositions = useMemo(() => {
    const arr = [];
    for (let i = -LENGTH / 2; i < LENGTH / 2; i += 20) arr.push(i); 
    return arr;
  }, []);

  return (
    <group position={[0, 0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshStandardMaterial color="#222222" roughness={0.9} metalness={0.1} />
      </mesh>
      <Instances range={stripePositions.length}>
        <planeGeometry args={[0.15, 3]} /> 
        <meshBasicMaterial color="#ccbb55" /> 
        {stripePositions.map((z, i) => (
          <Instance key={i} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>
      <mesh position={[-WIDTH / 2 - CURB_WIDTH / 2, CURB_HEIGHT / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[CURB_WIDTH, CURB_HEIGHT, LENGTH]} />
        <meshStandardMaterial color="#999999" roughness={0.8} />
      </mesh>
      <mesh position={[WIDTH / 2 + CURB_WIDTH / 2, CURB_HEIGHT / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[CURB_WIDTH, CURB_HEIGHT, LENGTH]} />
        <meshStandardMaterial color="#999999" roughness={0.8} />
      </mesh>
    </group>
  );
};

/* =========================================
   COMPONENTE: PLANTAÇÃO DE MILHO OTIMIZADA
   ========================================= */
const CornField = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const COUNT = 600; 
  const SIZE = 40;   

  const cornData = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SIZE;
      const z = (Math.random() - 0.5) * SIZE;
      const height = 1.8 + Math.random(); 
      const rotationY = Math.random() * Math.PI * 2;
      temp.push({ x, z, height, rotationY });
    }
    return temp;
  }, []);

  const plantsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (plantsRef.current) {
      const t = state.clock.getElapsedTime();
      plantsRef.current.rotation.z = Math.sin(t * 0.5) * 0.02; 
      plantsRef.current.rotation.x = Math.cos(t * 0.3) * 0.02; 
    }
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial color="#1a120b" roughness={1} />
      </mesh>
      <group ref={plantsRef}>
        <Instances range={COUNT}>
          <cylinderGeometry args={[0.04, 0.08, 1, 6]} />
          <meshStandardMaterial color="#4a6b36" roughness={0.8} />
          {cornData.map((data, i) => (
            <Instance key={`stalk-${i}`} position={[data.x, data.height / 2, data.z]} scale={[1, data.height, 1]} rotation={[0, data.rotationY, 0]} />
          ))}
        </Instances>
        <Instances range={COUNT}>
          <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
          <meshStandardMaterial color="#eec643" roughness={0.6} />
          {cornData.map((data, i) => (
            <Instance key={`cob-${i}`} position={[data.x + Math.sin(data.rotationY) * 0.15, data.height * 0.6, data.z + Math.cos(data.rotationY) * 0.15]} rotation={[0.5, data.rotationY, 0.5]} />
          ))}
        </Instances>
      </group>
    </group>
  );
};

/* =========================================
   COMPONENTE: TRATOR
   ========================================= */
const Tractor = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
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
   COMPONENTE: HORIZONTE ROCHOSO
   ========================================= */
const RockyHorizon = () => {
  const rocks = useMemo(() => {
    const items = [];
    const count = 120;
    const minRadius = 90;
    const maxRadius = 180;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      const isBackground = z < -50;
      const isFarRight = x > 80 && z < 10;

      if (!isBackground && !isFarRight) continue;

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
      <group position={[0, 20, -80]}>
         <Cloud opacity={0.2} speed={0.1} segments={10} color="#8899aa" />
      </group>
    </group>
  );
};

/* =========================================
   CONTEÚDO DA CENA PRINCIPAL
   ========================================= */
/* =========================================
   CONTEÚDO DA CENA PRINCIPAL
   ========================================= */
const SceneContent = () => {
  // 1. Criamos uma referência para controlar a câmera
  const controlsRef = useRef<any>(null);

  // 2. Animamos a câmera baseada no mesmo tempo do E.T.
  useFrame((state) => {
    if (!controlsRef.current) return;
    
    const t = state.clock.getElapsedTime();
    let isETFlying = false;

    // Janelas de tempo exatas do voo do E.T. (15s->45s e 1m58s->2m28s)
    if ((t >= 15 && t <= 45) || (t >= 118 && t <= 148)) {
      isETFlying = true;
    }

    // Se o E.T. estiver voando, o alvo da câmera sobe para Y = 12 (olha para o céu)
    // Se não, volta para Y = 0 (olha para o chão/centro)
    const desiredTargetY = isETFlying ? 12 : 0;
    
    // O THREE.MathUtils.lerp faz a transição ser super suave, como uma cutscene
    controlsRef.current.target.y = THREE.MathUtils.lerp(
      controlsRef.current.target.y, 
      desiredTargetY, 
      0.015 // Velocidade da subida/descida da câmera (quanto menor, mais suave)
    );
    
    // Atualiza o controle para aplicar a mudança
    controlsRef.current.update();
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 25, 55]} fov={55} />
      
      {/* 3. Colocamos o ref no OrbitControls */}
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        minDistance={15} 
        maxDistance={80} 
        maxPolarAngle={Math.PI / 2.05} 
        target={[0, 0, 0]} 
      />

      <ambientLight intensity={0.6} color="#666677" />
      <directionalLight position={[-50, 60, -50]} intensity={4.0} color="#cceeff" castShadow shadow-bias={-0.0001} />
      <pointLight position={[50, 30, 50]} intensity={1.5} color="#aa88cc" distance={100} decay={2} />
      <hemisphereLight skyColor="#223344" groundColor="#050510" intensity={1} />

      <Environment preset="night" blur={0.6} background={false} />
      <fogExp2 attach="fog" args={['#101025', 0.008]} /> 
      <Stars radius={120} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      <Moon />
      <RockyHorizon />

      {/* --- EASTER EGG INSERIDO AQUI NA CENA --- */}
      <FlyingET />

      <Scoreboard3D position={[38, 8.5, 25]} rotation={[0, -0.5, 0]} />

      <Physics gravity={[0, -9.81, 0]}>
        <Road />
        <UFO /> 
        <Ground /> 

        <group position={[-25, 0, 0]}>
           <group position={[-5, 0, -20]}> 
             <CornField />
           </group>
           <Tractor position={[0, 0, -2]} rotation={[0, 0.5, 0]} />
           <group position={[5, 0, 10]}>
             <TechCows />
           </group>
        </group>

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
          toneMappingExposure: 1.8 
        }}
        style={{ background: '#101025' }} 
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};