// Posição do OVNI compartilhada entre componentes como objeto mutável.
// Atualizado todo frame em UFO.tsx, lido em TechCows.tsx.
// Usar um objeto simples evita chamadas ao Zustand (e re-renders) a 60fps.
export const ufoPositionRef = {
  x: 0,
  y: 0,
  z: 0,
};
