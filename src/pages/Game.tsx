import { HUD } from '@/components/ui/HUD';
import { Tutorial } from '@/components/ui/Tutorial';
import { Modals } from '@/components/ui/Modals';
import { SkillToast } from '@/components/ui/SkillToast';
import { MobileControls } from '@/components/ui/MobileControls';
import LoadingScreen from '@/components/loading/LoadingScreen';
import { useGameStore } from '@/store/gameStore';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

type SceneComponent = ComponentType<{ onReady?: () => void }>;

// Depois que a cena está pronta, segura um instante pra "respirar" antes do fade,
// e o próprio fade (ligado ao duration-1000 do LoadingScreen) precisa desse tempo pra terminar.
const READY_HOLD_MS = 500;
const FADE_OUT_MS = 1500;

const Game = () => {
  // --- Carregamento real da cena 3D ---
  const [hasStarted, setHasStarted] = useState(false);
  const [SceneComp, setSceneComp] = useState<SceneComponent | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // --- Configuração do Áudio (música de fundo do jogo) ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicToast, setShowMusicToast] = useState(false);

  const handleStart = useCallback(() => setHasStarted(true), []);

  // Só baixa o chunk pesado da cena 3D (three + rapier + supabase) depois do clique —
  // mantém o carregamento inicial da página leve.
  useEffect(() => {
    if (!hasStarted) return;
    let cancelled = false;

    import('@/components/3d/Scene').then((mod) => {
      if (!cancelled) setSceneComp(() => mod.Scene);
    });

    return () => {
      cancelled = true;
    };
  }, [hasStarted]);

  // Progresso "honesto": anima suavemente em direção a um teto, mas só chega
  // a 100% quando a cena avisar de verdade que está pronta (ver handleSceneReady).
  useEffect(() => {
    if (!hasStarted || isSceneReady) return;
    let frameId: number;

    const tick = () => {
      setProgress((prev) => prev + (92 - prev) * 0.02);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, isSceneReady]);

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
    setProgress(100);
  }, []);

  // Cena pronta de verdade -> segura um instante, funde a tela de loading,
  // e só então revela o jogo e inicia o cronômetro de pontuação.
  useEffect(() => {
    if (!isSceneReady) return;

    const holdTimer = setTimeout(() => {
      setIsFadingOut(true);
      const revealTimer = setTimeout(() => {
        setRevealed(true);
        useGameStore.getState().startGame();
      }, FADE_OUT_MS);
      return () => clearTimeout(revealTimer);
    }, READY_HOLD_MS);

    return () => clearTimeout(holdTimer);
  }, [isSceneReady]);

  // Reseta o jogo se este componente sair de tela.
  useEffect(() => {
    return () => {
      useGameStore.getState().resetGame();
    };
  }, []);

  // Música de fundo do jogo — só começa quando o jogo é revelado de verdade.
  useEffect(() => {
    if (!revealed) return;

    const audio = new Audio('/sounds/fundo.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setShowMusicToast(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [revealed]);

  useEffect(() => {
    if (!showMusicToast) return;
    const timer = setTimeout(() => setShowMusicToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showMusicToast]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      setShowMusicToast(true);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene — montada assim que o download termina, ainda escondida atrás do loading */}
      {SceneComp && <SceneComp onReady={handleSceneReady} />}

      {revealed && (
        <>
          <HUD />
          <Tutorial />
          <Modals />
          <SkillToast />
          <MobileControls />

          <AnimatePresence>
            {showMusicToast && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.5 } }}
                className="fixed top-24 right-6 z-50 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-lg shadow-cyan-500/10 flex items-center gap-4 max-w-xs pointer-events-none"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex shrink-0 items-center justify-center border border-cyan-500/50">
                  <Music size={18} className="text-cyan-400 animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em] mb-1">
                    Tocando Agora
                  </span>
                  <span className="text-sm text-white font-bold leading-tight line-clamp-2">
                    Williams: E.T., Flying Theme 1982
                  </span>
                  <span className="text-xs text-slate-400 mt-1 truncate">
                    John Williams & The Boston Pops
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleAudio}
            className="fixed top-6 right-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all text-white shadow-lg shadow-cyan-500/20"
          >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] font-space">
              <span className="text-primary neon-text">THE FULLSTACK</span>
              <br />
              <span className="text-foreground/90 text-2xl md:text-3xl tracking-[0.3em]">INVASION</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-2 tracking-widest uppercase">
              🛸 Explore o mapa e descubra meus projetos
            </p>
          </motion.div>
        </>
      )}

      {!revealed && (
        <LoadingScreen
          hasStarted={hasStarted}
          onStart={handleStart}
          progress={progress}
          isReady={isSceneReady}
          isFadingOut={isFadingOut}
        />
      )}
    </div>
  );
};

export default Game;
