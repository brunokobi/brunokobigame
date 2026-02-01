import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

const MOVE_SPEED = 8;
const MAX_VELOCITY = 15;

export const UFO = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const { isAbducting, setAbducting } = useGameStore();
  
  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = true;
      }
      if (e.code === 'Space') {
        setAbducting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key as keyof typeof keysPressed.current] = false;
      }
      if (e.code === 'Space') {
        setAbducting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAbducting]);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const { w, a, s, d } = keysPressed.current;
    const force = { x: 0, y: 0, z: 0 };

    if (w) force.z -= MOVE_SPEED;
    if (s) force.z += MOVE_SPEED;
    if (a) force.x -= MOVE_SPEED;
    if (d) force.x += MOVE_SPEED;

    // Apply movement forces
    rigidBodyRef.current.applyImpulse(force, true);

    // Limit velocity
    const vel = rigidBodyRef.current.linvel();
    const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
    if (speed > MAX_VELOCITY) {
      const scale = MAX_VELOCITY / speed;
      rigidBodyRef.current.setLinvel(
        { x: vel.x * scale, y: vel.y, z: vel.z * scale },
        true
      );
    }

    // Keep UFO at fixed height
    const pos = rigidBodyRef.current.translation();
    if (pos.y < 3 || pos.y > 5) {
      rigidBodyRef.current.setTranslation(
        { x: pos.x, y: 4, z: pos.z },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 4, 0]}
      linearDamping={2}
      angularDamping={10}
      enabledRotations={[false, false, false]}
      mass={1}
    >
      <group>
        {/* UFO Body - Main Disk */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.5, 0.3, 16]} />
          <meshStandardMaterial 
            color="#c0c0c0" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>

        {/* UFO Top Dome */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#00ff88" 
            transparent 
            opacity={0.6}
            emissive="#00ff88"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* UFO Bottom Ring */}
        <mesh position={[0, -0.2, 0]}>
          <torusGeometry args={[1.3, 0.08, 8, 24]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88"
            emissiveIntensity={isAbducting ? 2 : 0.5}
          />
        </mesh>

        {/* Lights around the UFO */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 1.1, -0.1, Math.sin(angle) * 1.1]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial 
                color="#00ff88" 
                emissive="#00ff88"
                emissiveIntensity={isAbducting ? 3 : 1}
              />
            </mesh>
          );
        })}

        {/* Abduction Beam Light */}
        <SpotLight
          ref={spotLightRef}
          position={[0, -0.3, 0]}
          angle={0.5}
          penumbra={0.5}
          intensity={isAbducting ? 50 : 0}
          color="#00ff88"
          castShadow
          distance={20}
        />

        {/* Abduction Beam Cone (visible when abducting) */}
        {isAbducting && (
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2, 5, 16, 1, true]} />
            <meshBasicMaterial 
              color="#00ff88" 
              transparent 
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
};
