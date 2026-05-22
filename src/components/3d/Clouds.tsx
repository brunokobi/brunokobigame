import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudConfig {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  opacity?: number;
}

const cloudConfigs: CloudConfig[] = [
  { position: [-30, 35, -40], scale: 1.2, speed: 0.03, opacity: 0.12 },
  { position: [25, 38, -50], scale: 1.5, speed: 0.02, opacity: 0.1 },
  { position: [-50, 32, -35], scale: 0.9, speed: 0.04, opacity: 0.14 },
  { position: [40, 40, -55], scale: 1.3, speed: 0.025, opacity: 0.08 },
  { position: [-10, 36, -60], scale: 1.1, speed: 0.035, opacity: 0.11 },
  { position: [60, 34, -45], scale: 0.8, speed: 0.03, opacity: 0.09 },
];

// Geometria e materiais pré-construídos fora do componente (1 por nuvem)
const cloudPuffs = cloudConfigs.map(({ scale = 1, opacity }) => {
  const puffs = [];
  const count = 5; // Fixo para evitar random no render
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    puffs.push({
      pos: [
        Math.cos(angle) * 2.5 * scale,
        (i % 2 === 0 ? 0.5 : -0.3) * scale,
        Math.sin(angle) * 1.2 * scale,
      ] as [number, number, number],
      radius: (1.5 + (i % 3) * 0.7) * scale,
    });
  }
  return { puffs, opacity };
});

// Único useFrame para todas as nuvens — sem N hooks separados
export const Clouds = () => {
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    cloudConfigs.forEach(({ position, speed = 0.03 }, i) => {
      const ref = refs.current[i];
      if (!ref) return;
      ref.position.x = position[0] + Math.sin(t * speed) * 8;
      ref.position.y = position[1] + Math.sin(t * speed * 1.5) * 1;
    });
  });

  return (
    <group>
      {cloudConfigs.map(({ position }, ci) => (
        <group
          key={ci}
          ref={(el) => { refs.current[ci] = el; }}
          position={position}
        >
          {cloudPuffs[ci].puffs.map((puff, pi) => (
            <mesh key={pi} position={puff.pos}>
              <sphereGeometry args={[puff.radius, 6, 6]} />
              {/* meshBasicMaterial é muito mais leve que meshStandardMaterial para transparência simples */}
              <meshBasicMaterial
                color="#667799"
                transparent
                opacity={cloudPuffs[ci].opacity}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
