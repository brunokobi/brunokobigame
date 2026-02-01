import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { UFO } from './UFO';
import { Ground } from './Ground';
import { Barn } from './Barn';
import { CropCircles } from './CropCircles';
import { TechCows } from './TechCows';
import { Antenna } from './Antenna';

const SceneContent = () => {
  return (
    <>
      {/* Fixed Camera looking at the scene */}
      <PerspectiveCamera makeDefault position={[0, 30, 35]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.6}
        color="#8888ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Moon light */}
      <pointLight 
        position={[-30, 40, -30]} 
        intensity={1} 
        color="#aaaaff" 
        distance={100}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 25, 90]} />

      {/* Starry sky */}
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0.5}
        fade
      />

      {/* Physics World */}
      <Physics gravity={[0, -9.81, 0]}>
        <UFO />
        <Ground />
        <Barn />
        <CropCircles />
        <TechCows />
        <Antenna />
      </Physics>
    </>
  );
};

export const Scene = () => {
  // Ensure the canvas can receive keyboard events
  useEffect(() => {
    const handleClick = () => {
      window.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-full"
      tabIndex={0}
      onFocus={() => window.focus()}
    >
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
        }}
        style={{ background: '#0a0a1a' }}
        tabIndex={-1}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};
