import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { UFO } from './UFO';
import { Ground } from './Ground';
import { Barn } from './Barn';
import { HoloCubes } from './HoloCubes';
import { TechCows } from './TechCows';
import { Antenna } from './Antenna';
import { Moon } from './Moon';
import { Clouds } from './Clouds';

const SceneContent = () => {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 25, 30]} fov={60} />
      <OrbitControls 
        enablePan={false}
        minDistance={15}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* === LIGHTING — Dramatic Moonlit Night === */}
      
      {/* Soft ambient fill — deep blue tint */}
      <ambientLight intensity={0.25} color="#6677aa" />
      
      {/* Main directional (moonlight) — silver-blue, strong shadows */}
      <directionalLight 
        position={[-20, 30, -30]} 
        intensity={1.5}
        color="#aabbdd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Secondary fill from opposite side — warm purple */}
      <directionalLight 
        position={[20, 15, 20]} 
        intensity={0.4}
        color="#8866aa"
      />

      {/* Hemisphere light for natural sky/ground color bleed */}
      <hemisphereLight 
        args={['#334466', '#1a2211', 0.3]}
      />

      {/* === ATMOSPHERE === */}
      
      {/* Deep blue-purple fog */}
      <fog attach="fog" args={['#0d0d1a', 35, 120]} />

      {/* Starry sky — more stars, more depth */}
      <Stars 
        radius={100} 
        depth={60} 
        count={5000} 
        factor={4} 
        saturation={0.3}
        fade
      />

      {/* Celestial objects */}
      <Moon />
      <Clouds />

      {/* === PHYSICS WORLD === */}
      <Physics gravity={[0, -9.81, 0]} debug={false}>
        <UFO />
        <Ground />
        <Barn />
        <HoloCubes />
        <TechCows />
        <Antenna />
      </Physics>
    </>
  );
};

export const Scene = () => {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
        }}
        style={{ background: '#060610' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};
