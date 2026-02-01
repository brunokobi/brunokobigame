import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

const MOVE_FORCE = 15;
const MAX_VELOCITY = 12;
const UFO_HEIGHT = 4;

export const UFO = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { isAbducting, setAbducting } = useGameStore();
  
  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        movement.current.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        movement.current.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        movement.current.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        movement.current.right = true;
        break;
      case 'Space':
        e.preventDefault();
        setAbducting(true);
        break;
    }
  }, [setAbducting]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        movement.current.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        movement.current.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        movement.current.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        movement.current.right = false;
        break;
      case 'Space':
        setAbducting(false);
        break;
    }
  }, [setAbducting]);

  useEffect(() => {
    // Add listeners to document for better capture
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Focus window to ensure keyboard events are captured
    window.focus();
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const { forward, backward, left, right } = movement.current;
    
    // Calculate force direction
    const forceX = (right ? 1 : 0) - (left ? 1 : 0);
    const forceZ = (backward ? 1 : 0) - (forward ? 1 : 0);

    // Apply forces if any movement keys are pressed
    if (forceX !== 0 || forceZ !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(forceX * forceX + forceZ * forceZ);
      const normalizedX = (forceX / length) * MOVE_FORCE;
      const normalizedZ = (forceZ / length) * MOVE_FORCE;
      
      rigidBodyRef.current.applyImpulse(
        { x: normalizedX, y: 0, z: normalizedZ },
        true
      );
    }

    // Limit velocity
    const vel = rigidBodyRef.current.linvel();
    const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
    if (speed > MAX_VELOCITY) {
      const scale = MAX_VELOCITY / speed;
      rigidBodyRef.current.setLinvel(
        { x: vel.x * scale, y: 0, z: vel.z * scale },
        true
      );
    }

    // Keep UFO at fixed height
    const pos = rigidBodyRef.current.translation();
    if (Math.abs(pos.y - UFO_HEIGHT) > 0.1) {
      rigidBodyRef.current.setTranslation(
        { x: pos.x, y: UFO_HEIGHT, z: pos.z },
        true
      );
      rigidBodyRef.current.setLinvel(
        { x: vel.x, y: 0, z: vel.z },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, UFO_HEIGHT, 0]}
      linearDamping={1.5}
      angularDamping={10}
      enabledRotations={[false, false, false]}
      mass={1}
      gravityScale={0}
      lockTranslations={false}
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
        {isAbducting && (
          <spotLight
            position={[0, -0.3, 0]}
            angle={0.5}
            penumbra={0.5}
            intensity={50}
            color="#00ff88"
            castShadow
            distance={20}
            target-position={[0, -10, 0]}
          />
        )}

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

        {/* Point light for glow effect */}
        <pointLight 
          position={[0, 0, 0]} 
          color="#00ff88" 
          intensity={isAbducting ? 5 : 2} 
          distance={10}
        />
      </group>
    </RigidBody>
  );
};
