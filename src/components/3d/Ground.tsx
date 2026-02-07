import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Ground = () => {
  // 1. Carrega a textura
  const grassTexture = useTexture('/textures/grass.jpg');

  // 2. Configura a repetição
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  return (
    // 'colliders={false}' desliga a geração automática (que falha em planos)
    <RigidBody type="fixed" friction={2} colliders={false}>
      
      {/* --- A CORREÇÃO MÁGICA --- */}
      {/* Cria um bloco físico invisível abaixo do chão.
          args=[x, y, z] são "meias-medidas". 
          100 = 200m de largura
          1 = 2m de altura (espessura)
      */}
      <CuboidCollider args={[100, 1, 100]} position={[0, -1, 0]} /> 

      {/* O plano visual (o que você vê) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#88cc88" // Ajustei levemente para ficar menos neon
          roughness={1}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  );
};