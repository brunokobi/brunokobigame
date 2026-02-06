import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Ground = () => {
  // 1. Carrega a textura que está na pasta public/textures/
  const grassTexture = useTexture('/textures/grass.jpg');

  // 2. Configura a repetição (Tiling)
  // Isso é crucial para chão, senão a imagem de grama fica esticada e borrada
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20); // Repete a imagem 20 vezes em cada eixo
  
  // Opcional: Ajusta cores da textura para não ficar muito brilhante
  // grassTexture.encoding = THREE.sRGBEncoding; // (Dependendo da versão do Three)

  return (
    <RigidBody type="fixed" friction={1}>
      {/* O plano do chão */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[200, 200]} />
        
        {/* Usamos MeshStandardMaterial para grama (opaco, reage à luz) */}
        <meshStandardMaterial 
          map={grassTexture}
          color="#99dd99"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </RigidBody>
  );
};