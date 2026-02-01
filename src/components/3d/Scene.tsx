import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Stars, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { UFO } from './UFO';
import { Ground } from './Ground';
import { Barn } from './Barn';
import { CropCircles } from './CropCircles';
import { TechCows } from './TechCows';
import { Antenna } from './Antenna';

const SceneContent = () => {
  return (
    <>
      {/* Camera following UFO area */}
      <PerspectiveCamera makeDefault position={[0, 25, 30]} fov={60} />
      <OrbitControls 
        enablePan={false}
        minDistance={15}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.5}
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
        intensity={0.8} 
        color="#aaaaff" 
        distance={100}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 20, 80]} />

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
      <Physics gravity={[0, -9.81, 0]} debug={false}>
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
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
        }}
        style={{ background: '#fdfdfd' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};
