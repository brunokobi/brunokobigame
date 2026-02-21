import { useGameStore } from '@/store/gameStore';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const ETBikeVoxel = () => {
  const { openModal } = useGameStore(); 

  // ==========================================
  // MATERIAIS (Cores no estilo Voxel/Minecraft)
  // ==========================================
  const redHoodie = new THREE.MeshStandardMaterial({ color: "#cc0000", roughness: 0.9 });
  const blueJeans = new THREE.MeshStandardMaterial({ color: "#1e4b85", roughness: 0.9 });
  const skinTone = new THREE.MeshStandardMaterial({ color: "#fcd0b4", roughness: 0.6 });
  const hairColor = new THREE.MeshStandardMaterial({ color: "#3b2818", roughness: 1.0 });
  
  const whiteBlanket = new THREE.MeshStandardMaterial({ color: "#e0e0e0", roughness: 1.0 });
  const etSkin = new THREE.MeshStandardMaterial({ color: "#8b5a2b", roughness: 0.8 });
  
  const bikeRed = new THREE.MeshStandardMaterial({ color: "#aa0000", roughness: 0.5, metalness: 0.3 });
  const darkGrey = new THREE.MeshStandardMaterial({ color: "#222222", roughness: 0.8 });
  const basketWood = new THREE.MeshStandardMaterial({ color: "#d4a373", roughness: 1.0 });

  const handleInteract = () => {
    openModal('about'); 
  };

  return (
    <group position={[0, 0, 0]}>
      
      {/* Trocamos o RigidBody por um Group simples. O onClick continua funcionando! */}
      <group 
        onClick={(e) => {
            e.stopPropagation();
            handleInteract();
        }}
        onPointerEnter={() => document.body.style.cursor = 'pointer'}
        onPointerLeave={() => document.body.style.cursor = 'auto'}
      >
        
        {/* ==========================================
            1. A BICICLETA
            ========================================== */}
        <mesh castShadow receiveShadow position={[-1.5, 0.6, 0]}>
          <boxGeometry args={[1.2, 1.2, 0.15]} />
          <primitive object={darkGrey} />
        </mesh>
        <mesh castShadow receiveShadow position={[1.5, 0.6, 0]}>
          <boxGeometry args={[1.2, 1.2, 0.15]} />
          <primitive object={darkGrey} />
        </mesh>
        <mesh castShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[3.0, 0.15, 0.15]} />
          <primitive object={bikeRed} />
        </mesh>
        <mesh castShadow position={[-0.5, 1.6, 0]}>
          <boxGeometry args={[0.15, 0.8, 0.15]} />
          <primitive object={bikeRed} />
        </mesh>
        <mesh castShadow position={[1.2, 1.8, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <primitive object={darkGrey} />
        </mesh>
        <mesh castShadow position={[1.2, 2.4, 0]}>
          <boxGeometry args={[0.2, 0.2, 1.2]} />
          <primitive object={darkGrey} />
        </mesh>
        <mesh castShadow receiveShadow position={[1.8, 1.8, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <primitive object={basketWood} />
        </mesh>

        {/* ==========================================
            2. ELLIOT
            ========================================== */}
        <mesh castShadow position={[-0.5, 1.1, 0.3]}>
          <boxGeometry args={[0.4, 1.0, 0.3]} />
          <primitive object={blueJeans} />
        </mesh>
        <mesh castShadow position={[-0.5, 1.1, -0.3]}>
          <boxGeometry args={[0.4, 1.0, 0.3]} />
          <primitive object={blueJeans} />
        </mesh>
        <mesh castShadow position={[-0.4, 2.0, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.6, 1.0, 0.7]} />
          <primitive object={redHoodie} />
        </mesh>
        <mesh castShadow position={[0.4, 2.2, 0.4]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[1.2, 0.25, 0.25]} />
          <primitive object={redHoodie} />
        </mesh>
        <mesh castShadow position={[0.4, 2.2, -0.4]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[1.2, 0.25, 0.25]} />
          <primitive object={redHoodie} />
        </mesh>
        <group position={[-0.1, 2.8, 0]}>
          <mesh castShadow position={[0.1, 0, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <primitive object={skinTone} />
          </mesh>
          <mesh castShadow position={[0.05, 0.25, 0]}>
            <boxGeometry args={[0.45, 0.15, 0.45]} />
            <primitive object={hairColor} />
          </mesh>
          <mesh castShadow position={[-0.1, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.6]} />
            <primitive object={redHoodie} />
          </mesh>
        </group>

        {/* ==========================================
            3. E.T. (ENROLADO NA COBERTA)
            ========================================== */}
        <group position={[1.8, 2.2, 0]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.6]} />
            <primitive object={whiteBlanket} />
          </mesh>
          <mesh castShadow position={[0.2, 0.5, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <primitive object={etSkin} />
          </mesh>
          <mesh castShadow position={[0.1, 0.6, 0]}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            <primitive object={whiteBlanket} />
          </mesh>
          <mesh castShadow position={[-0.05, 0.5, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.5]} />
            <primitive object={whiteBlanket} />
          </mesh>
        </group>

      </group>

     
    </group>
  );
};