import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react'; 

import StarField from './StarField';
import Nebula from './Nebula';
import CodeParticles from './CodeParticles';
import UFOElement from './UFOElement';
import GridOverlay from './GridOverlay';
import LoadingProgress from './LoadingProgress';

const LOADING_DURATION = 5000;

const LoadingScreen = () => {
  const navigate = useNavigate();
  
  // Estados
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Refs de Áudio
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const scanlineSfxRef = useRef<HTMLAudioElement | null>(null);

  // 1. Configuração Inicial
  useEffect(() => {
    // Música de Fundo (MP3)
    bgMusicRef.current = new Audio('/sounds/fundo.mp3'); // Ajuste a extensão se for .wav
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.5; // Começa com volume normal

    // Efeito Scanline (WAV)
    scanlineSfxRef.current = new Audio('/sounds/scanline.wav');
    scanlineSfxRef.current.loop = true;
    scanlineSfxRef.current.volume = 0.15;

    return () => {
      bgMusicRef.current?.pause();
      scanlineSfxRef.current?.pause();
    };
  }, []);

  // 2. Click do Usuário -> Toca SOMENTE o Scanline
  const handleStart = () => {
    // Toca o ruído de carregamento
    scanlineSfxRef.current?.play().catch(e => console.warn("Audio error:", e));
    setHasStarted(true);
  };

  // 3. Monitorar o Fim do Loading -> Toca a Música de Fundo
  useEffect(() => {
    if (isComplete) {
      // Para o barulho de scanline
      if (scanlineSfxRef.current) {
        scanlineSfxRef.current.pause();
        scanlineSfxRef.current.currentTime = 0;
      }

      // Inicia a música de fundo (Momento "Sistema Online")
      bgMusicRef.current?.play().catch(e => console.warn("Audio error:", e));
    }
  }, [isComplete]);

  // 4. Fade Out apenas na saída da tela
  useEffect(() => {
    if (isFadingOut) {
      const fadeInterval = setInterval(() => {
        const music = bgMusicRef.current;
        // Diminui o volume da música suavemente antes de mudar de página
        if (music && music.volume > 0.05) {
          music.volume -= 0.05;
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
      return () => clearInterval(fadeInterval);
    }
  }, [isFadingOut]);

  // --- Lógica Visual (Inalterada) ---
  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    let animationFrameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true); // <--- Isso dispara o useEffect da música acima
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            navigate('/game');
          }, 1500); // Dei um tempinho a mais (1.5s) pra ouvir o começo da música
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, navigate]);

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
            <LoadingProgress progress={progress} isComplete={isComplete} />
          </>
        )}
      </div>

      <div className="absolute inset-0 scanline pointer-events-none z-40" />
    </div>
  );
};

export default LoadingScreen;