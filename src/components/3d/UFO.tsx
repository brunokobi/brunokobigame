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
  const { isAbducting, setAbducting } = useGameStore();
  
  // Criamos um objeto alvo para a luz seguir a nave
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

    // Pequena animação de rotação lenta no próprio eixo visual para dar vida
    const time = state.clock.getElapsedTime();
    
    const { KeyW, KeyA, KeyS, KeyD } = keysPressed.current;
    let x = 0;
    let z = 0;

     // Keyboard controls
    if (KeyW) z -= 1;
    if (KeyS) z += 1;
    if (KeyA) x -= 1;
    if (KeyD) x += 1;

     // Mobile joystick controls (add to keyboard input)
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
      <group>
        {/* --- CORPO PRINCIPAL --- */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.5, 0.3, 16]} />
          <meshStandardMaterial 
            color="#d0d0d0" 
            metalness={0.9} 
            roughness={0.1} 
            // Adicionei um leve brilho no metal para não ficar preto à noite
            emissive="#222222" 
          />
        </mesh>

        {/* --- CÚPULA DE VIDRO (Mais brilhante) --- */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#00ff88" 
            transparent 
            opacity={0.8}
            emissive="#00ff88"
            emissiveIntensity={2} // Aumentei a intensidade do brilho
            toneMapped={false}    // Faz o brilho "estourar" um pouco (Glow effect)
          />
        </mesh>

        {/* --- ANEL DE LUZES GIRATÓRIAS --- */}
        {/* Adiciona 8 pequenas luzes ao redor do disco */}
        {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 1.3; // Raio um pouco maior que o corpo
            const z = Math.sin(angle) * 1.3;
            return (
                <group key={i} position={[x, -0.1, z]}>
                    <mesh>
                        <sphereGeometry args={[0.08]} />
                        <meshStandardMaterial 
                            color="#00ffff" 
                            emissive="#00ffff" 
                            emissiveIntensity={10} // Brilho neon forte
                            toneMapped={false} 
                        />
                    </mesh>
                    {/* Luz real que ilumina o metal da nave ao redor */}
                    <pointLight distance={1} intensity={2} color="#00ffff" />
                </group>
            );
        })}

        {/* --- LUZ DO MOTOR (Constant Engine Glow) --- */}
        {/* Uma luz que fica sempre ligada embaixo, iluminando o chão suavemente */}
        <pointLight 
            position={[0, -0.5, 0]} 
            intensity={3} 
            distance={8} 
            color="#00ff88" 
            decay={2}
        />

        {/* --- LUZ DE ABDUÇÃO (SpotLight Forte) --- */}
        
        {/* Alvo invisível */}
        <primitive object={lightTarget} position={[0, -5, 0]} />

        {/* O Holofote principal */}
        <SpotLight
          position={[0, -0.3, 0]}
          target={lightTarget}
          angle={0.6}
          penumbra={0.4}
          intensity={isAbducting ? 100 : 0} // Aumentei para 100 para ficar bem forte
          color="#00ff88"
          castShadow
          distance={30}
          attenuation={5}
          anglePower={5}
        />
        
        {/* Cone Visual Transparente */}
        {isAbducting && (
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
             <coneGeometry args={[2, 5, 32, 1, true]} />
             <meshBasicMaterial 
                color="#00ff88" 
                transparent 
                opacity={0.3} // Um pouco mais visível
                side={THREE.DoubleSide} 
                depthWrite={false}
             />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
};