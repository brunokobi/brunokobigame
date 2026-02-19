import { Scene } from '@/components/3d/Scene';
import { HUD } from '@/components/ui/HUD';
import { Tutorial } from '@/components/ui/Tutorial';
import { Modals } from '@/components/ui/Modals';
import { SkillToast } from '@/components/ui/SkillToast';
import { MobileControls } from '@/components/ui/MobileControls';
// --- 1. NOVOS IMPORTS ---
import { useGameStore } from '@/store/gameStore';
// -----------------------

// --- IMPORTANTE: Adicionado AnimatePresence e o ícone Music ---
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react'; 

const Index = () => {
  // --- Configuração do Áudio ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --- NOVO: Estado para controlar o popup de música ---
  const [showMusicToast, setShowMusicToast] = useState(false);

  // --- 2. LÓGICA DE INÍCIO DO JOGO ---
  useEffect(() => {
    // Inicia o cronômetro e reseta pontuação
    useGameStore.getState().startGame();

    // Limpeza: Reseta quando sair da página
    return () => {
      useGameStore.getState().resetGame();
    };
  }, []);
  // -----------------------------------

  // --- LÓGICA DO ÁUDIO ---
  useEffect(() => {
    audioRef.current = new Audio('/sounds/fundo.mp3');
    audioRef.current.loop = true; 
    audioRef.current.volume = 0.3; 

    const tryPlay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowMusicToast(true); // Exibe o popup quando toca com sucesso
        }
      } catch (err) {
        console.log("Autoplay bloqueado, aguardando clique do usuário.");
        setIsPlaying(false);
      }
    };
    tryPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- NOVO: Efeito para esconder o popup após 3 segundos ---
  useEffect(() => {
    if (showMusicToast) {
      const timer = setTimeout(() => {
        setShowMusicToast(false);
      }, 3000); // 3000ms = 3 segundos
      
      // Limpa o timer se o componente desmontar ou se o toast mudar de estado
      return () => clearTimeout(timer); 
    }
  }, [showMusicToast]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      setShowMusicToast(true); // Exibe o popup quando o usuário clica no botão Play
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <Scene />

      {/* Outras UIs */}
      <HUD />
      <Tutorial />
      <Modals />
      <SkillToast />
      <MobileControls />

      {/* --- POPUP DE MÚSICA (Canto Superior Direito) --- */}
      <AnimatePresence>
        {showMusicToast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.5 } }}
            className="fixed top-24 right-6 z-50 bg-black/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-lg shadow-cyan-500/10 flex items-center gap-4 max-w-xs pointer-events-none"
          >
            {/* Ícone Animado */}
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex shrink-0 items-center justify-center border border-cyan-500/50">
              <Music size={18} className="text-cyan-400 animate-pulse" />
            </div>
            
            {/* Informações da Música */}
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

      {/* --- Botão de Música --- */}
      <button 
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all text-white shadow-lg shadow-cyan-500/20"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Title */}
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
    </div>
  );
};

export default Index;