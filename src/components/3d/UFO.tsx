import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { mobileJoystickState } from '@/components/ui/MobileControls';

const MOVE_SPEED = 12;
const MAX_TILT = 0.15; 

export const UFO = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const shipGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  const { isAbducting, setAbducting, setUfoPosition } = useGameStore();
  
  const [lightTarget] = useState(() => new THREE.Object3D());
  const keysPressed = useRef({ KeyW: false, KeyA: false, KeyS: false, KeyD: false });

  useEffect(() => {
    lightTarget.position.set(0, -10, 0);
  }, [lightTarget]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) keysPressed.current[e.code as keyof typeof keysPressed.current] = true;
      if (e.code === 'Space') setAbducting(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keysPressed.current) keysPressed.current[e.code as keyof typeof keysPressed.current] = false;
      if (e.code === 'Space') setAbducting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAbducting]);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !shipGroupRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. INPUT E VELOCIDADE
    const { KeyW, KeyA, KeyS, KeyD } = keysPressed.current;
    let x = 0;
    let z = 0;

    if (KeyW) z -= 1;
    if (KeyS) z += 1;
    if (KeyA) x -= 1;
    if (KeyD) x += 1;

    // Joystick Mobile
    x += mobileJoystickState.x;
    z += mobileJoystickState.y;

    // Normalização do vetor
    if (x !== 0 || z !== 0) {
      const length = Math.sqrt(x * x + z * z);
      if (length > 1) { 
        x /= length; 
        z /= length; 
      }
    }

    const velocityX = x * MOVE_SPEED;
    const velocityZ = z * MOVE_SPEED;

    // Aplica a velocidade linear
    rigidBodyRef.current.setLinvel({ x: velocityX, y: 0, z: velocityZ }, true);

    // Atualiza posição na store
    const currentPos = rigidBodyRef.current.translation();
    setUfoPosition(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));

    // 2. ANIMAÇÕES VISUAIS
    const targetTiltX = z * MAX_TILT;
    const targetTiltZ = -x * MAX_TILT;

    shipGroupRef.current.rotation.x = THREE.MathUtils.lerp(shipGroupRef.current.rotation.x, targetTiltX + Math.sin(time * 1.5) * 0.02, 0.1);
    shipGroupRef.current.rotation.z = THREE.MathUtils.lerp(shipGroupRef.current.rotation.z, targetTiltZ + Math.cos(time * 1.2) * 0.02, 0.1);
    shipGroupRef.current.position.y = Math.sin(time * 2) * 0.1;

    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 2;
    }

    if (beamRef.current && isAbducting) {
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(time * 15) * 0.1;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      name="player"
      type="dynamic"
      position={[0, 4, 0]}
      gravityScale={0}
      lockRotations={true}
      linearDamping={2}
      colliders="hull" 
      // --- CORREÇÕES PARA COLISÃO INSTANTÂNEA ---
      ccd={true}         // Ativa detecção contínua (evita que o UFO pule o frame da colisão)
      canSleep={false}   // Impede que o corpo entre em "sleep mode" (sempre ativo)
    >
      <group ref={shipGroupRef}>
        
        {/* CORPO PRINCIPAL */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[1.8, 0.8, 0.5, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} envMapIntensity={1} />
        </mesh>
        
        {/* CÚPULA DE VIDRO */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#aaddff" roughness={0} metalness={0.1} transmission={0.6} thickness={1} opacity={0.8} transparent emissive="#001133" />
        </mesh>

        {/* LUZES */}
        <group ref={ringRef} position={[0, -0.1, 0]}>
          {[...Array(8)].map((_, i) => {
             const angle = (i / 8) * Math.PI * 2;
             return (
               <mesh key={i} position={[Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6]}>
                 <sphereGeometry args={[0.08]} />
                 <meshBasicMaterial color="#00ffcc" toneMapped={false} />
                 <pointLight distance={1} intensity={2} color="#00ffcc" decay={2} />
               </mesh>
             )
          })}
        </group>

        {/* MOTOR */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.1, 0.2, 16]} />
          <meshBasicMaterial color="#ffaa00" toneMapped={false} />
          <pointLight distance={5} intensity={5} color="#ffaa00" />
        </mesh>

        <primitive object={lightTarget} position={[0, -10, 0]} />
        <SpotLight
          position={[0, -0.4, 0]}
          target={lightTarget}
          angle={0.5}
          penumbra={0.5}
          intensity={isAbducting ? 200 : 0}
          color="#00ffcc"
          castShadow
          distance={20}
          attenuation={5}
          anglePower={4}
        />
        {isAbducting && (
          <mesh ref={beamRef} position={[0, -3.5, 0]}>
            <cylinderGeometry args={[0.4, 2.5, 7, 32, 1, true]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
};