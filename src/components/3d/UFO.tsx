import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { mobileJoystickState } from '@/components/ui/MobileControls';

const MOVE_SPEED = 12;

export const UFO = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshGroupRef = useRef<THREE.Group>(null);
  const { isAbducting, setAbducting } = useGameStore();
  
  const [lightTarget] = useState(() => new THREE.Object3D());

  const keysPressed = useRef({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  });

  useEffect(() => {
    lightTarget.position.set(0, -5, 0); 
  }, [lightTarget]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) {
        keysPressed.current[e.code as keyof typeof keysPressed.current] = true;
      }
      if (e.code === 'Space') setAbducting(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) {
        keysPressed.current[e.code as keyof typeof keysPressed.current] = false;
      }
      if (e.code === 'Space') setAbducting(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAbducting]);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // === ORGANIC HOVERING MOTION ===
    if (meshGroupRef.current) {
      // Gentle bobbing up/down
      meshGroupRef.current.position.y = Math.sin(time * 1.2) * 0.15;
      // Subtle tilting
      meshGroupRef.current.rotation.x = Math.sin(time * 0.8) * 0.03;
      meshGroupRef.current.rotation.z = Math.cos(time * 0.6) * 0.04;
      // Slow yaw drift
      meshGroupRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
    }

    const { KeyW, KeyA, KeyS, KeyD } = keysPressed.current;
    let x = 0;
    let z = 0;

    if (KeyW) z -= 1;
    if (KeyS) z += 1;
    if (KeyA) x -= 1;
    if (KeyD) x += 1;

    x += mobileJoystickState.x;
    z += mobileJoystickState.y;
 
    if (x !== 0 || z !== 0) {
      const length = Math.sqrt(x * x + z * z);
      if (length > 1) {
        x /= length;
        z /= length;
      }
    }

    rigidBodyRef.current.setLinvel({
      x: x * MOVE_SPEED,
      y: 0, 
      z: z * MOVE_SPEED
    }, true);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 4, 0]}
      gravityScale={0}
      lockRotations={true}
      canSleep={false}
      linearDamping={0.5}
      angularDamping={0}
      colliders="hull"
    >
      <group ref={meshGroupRef}>
        {/* --- CORPO PRINCIPAL (Futuristic metallic disc) --- */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.5, 0.3, 24]} />
          <meshStandardMaterial 
            color="#c0c8d8" 
            metalness={0.95} 
            roughness={0.05} 
            emissive="#1a2233"
            envMapIntensity={2}
          />
        </mesh>

        {/* Upper ring detail */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[1.1, 0.06, 8, 24]} />
          <meshStandardMaterial 
            color="#4466aa" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#223355"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* --- CÚPULA DE VIDRO (Brighter, more visible) --- */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#00ff88" 
            transparent 
            opacity={0.6}
            emissive="#00ff88"
            emissiveIntensity={2.5}
            toneMapped={false}
            roughness={0}
            metalness={0.1}
          />
        </mesh>

        {/* --- ANEL DE LUZES GIRATÓRIAS --- */}
        {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const lx = Math.cos(angle) * 1.35;
            const lz = Math.sin(angle) * 1.35;
            return (
                <group key={i} position={[lx, -0.1, lz]}>
                    <mesh>
                        <sphereGeometry args={[0.06]} />
                        <meshStandardMaterial 
                            color="#66ddff" 
                            emissive="#66ddff" 
                            emissiveIntensity={12}
                            toneMapped={false} 
                        />
                    </mesh>
                    <pointLight distance={1.2} intensity={1.5} color="#66ddff" />
                </group>
            );
        })}

        {/* --- PROPULSION GLOW (Heat distortion effect) --- */}
        {/* Central engine light — always on */}
        <pointLight 
            position={[0, -0.5, 0]} 
            intensity={4} 
            distance={10} 
            color="#00cc66" 
            decay={2}
        />

        {/* Heat shimmer rings under the ship */}
        {[0.6, 0.9, 1.2].map((radius, i) => (
          <mesh key={i} position={[0, -0.3 - i * 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 8, 24]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent 
              opacity={0.15 - i * 0.04}
            />
          </mesh>
        ))}

        {/* --- ABDUÇÃO (SpotLight + Cone Visual) --- */}
        <primitive object={lightTarget} position={[0, -5, 0]} />

        <SpotLight
          position={[0, -0.3, 0]}
          target={lightTarget}
          angle={0.6}
          penumbra={0.4}
          intensity={isAbducting ? 120 : 0}
          color="#00ff88"
          castShadow
          distance={30}
          attenuation={5}
          anglePower={5}
        />
        
        {/* Visual cone */}
        {isAbducting && (
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
             <coneGeometry args={[2, 5, 32, 1, true]} />
             <meshBasicMaterial 
                color="#00ff88" 
                transparent 
                opacity={0.25}
                side={THREE.DoubleSide} 
                depthWrite={false}
             />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
};
