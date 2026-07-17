import { useState, useEffect, useCallback, useRef } from 'react';
import { Play } from 'lucide-react';

import StarField from './StarField';
import Nebula from './Nebula';
import CodeParticles from './CodeParticles';
import UFOElement from './UFOElement';
import GridOverlay from './GridOverlay';
import LoadingProgress from './LoadingProgress';

interface LoadingScreenProps {
  /** true assim que o usuário clicou em "Inicializar Sistema". */
  hasStarted: boolean;
  /** Progresso real (0-100) do carregamento da cena 3D — nunca chega a 100 antes de estar pronto de verdade. */
  progress: number;
  /** true quando a cena 3D já renderizou de verdade (física + texturas + primeiros frames). */
  isReady: boolean;
  /** true durante a transição de saída, controlada por quem monta este componente. */
  isFadingOut: boolean;
  onStart: () => void;
}

const LoadingScreen = ({ hasStarted, progress, isReady, isFadingOut, onStart }: LoadingScreenProps) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Ref de Áudio — só o efeito sonoro de scanline durante o carregamento.
  // A música de fundo do jogo é responsabilidade de quem revela o jogo (Game.tsx),
  // pra não termos duas trilhas concorrendo entre a tela de loading e o jogo.
  const scanlineSfxRef = useRef<HTMLAudioElement | null>(null);

  // 1. Configuração Inicial
  useEffect(() => {
    scanlineSfxRef.current = new Audio('/sounds/scanline.wav');
    scanlineSfxRef.current.loop = true;
    scanlineSfxRef.current.volume = 0.15;

    return () => {
      scanlineSfxRef.current?.pause();
    };
  }, []);

  // 2. Click do Usuário -> Toca o Scanline e avisa quem monta este componente pra começar a carregar de verdade
  const handleStart = () => {
    scanlineSfxRef.current?.play().catch(e => console.warn("Audio error:", e));
    onStart();
  };

  // 3. Quando a cena estiver pronta de verdade, para o scanline
  useEffect(() => {
    if (isReady && scanlineSfxRef.current) {
      scanlineSfxRef.current.pause();
      scanlineSfxRef.current.currentTime = 0;
    }
  }, [isReady]);

  // Mouse Parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMouseOffset({
      x: ((e.clientX - centerX) / centerX) * 50,
      y: ((e.clientY - centerY) / centerY) * 50,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: `linear-gradient(180deg, hsl(var(--space-deep)) 0%, hsl(var(--space-mid)) 50%, hsl(var(--space-light)) 100%)`,
      }}
    >
      <StarField count={200} layer="back" mouseOffset={mouseOffset} />
      <StarField count={100} layer="mid" mouseOffset={mouseOffset} />
      <Nebula mouseOffset={mouseOffset} />
      <GridOverlay />
      
      <div className="absolute inset-0 flex items-center justify-center z-50">
        {!hasStarted ? (
          <button
            onClick={handleStart}
            className="group relative px-8 py-4 bg-transparent border border-[#42c920] text-[#42c920] font-mono text-xl tracking-widest uppercase transition-all duration-300 hover:bg-[#42c920] hover:text-black hover:shadow-[0_0_20px_rgba(66,201,32,0.6)]"
          >
            <span className="flex items-center gap-3">
              <Play className="w-6 h-6 animate-pulse" />
              Inicializar Sistema
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
          </button>
        ) : (
          <>
            <CodeParticles />
            <UFOElement mouseOffset={mouseOffset} />
            <LoadingProgress progress={progress} isComplete={isReady} />
          </>
        )}
      </div>

      <div className="absolute inset-0 scanline pointer-events-none z-40" />
    </div>
  );
};

export default LoadingScreen;