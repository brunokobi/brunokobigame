import { Scene } from '@/components/3d/Scene';
import { HUD } from '@/components/ui/HUD';
import { Tutorial } from '@/components/ui/Tutorial';
import { Modals } from '@/components/ui/Modals';
import { SkillToast } from '@/components/ui/SkillToast';
import { MobileControls } from '@/components/ui/MobileControls';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react'; // Ícones de som

const Index = () => {
  // --- Configuração do Áudio ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 1. Cria o objeto de áudio
    audioRef.current = new Audio('/sounds/fundo.mp3');
    audioRef.current.loop = true; // Repetir música
    audioRef.current.volume = 0.3; // Volume baixo (30%)

    // 2. Tenta tocar (Autoplay policy pode bloquear)
    const tryPlay = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
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

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <Scene />

      {/* UI Overlay */}
      <HUD />
      <Tutorial />
      <Modals />
      <SkillToast />
      <MobileControls />

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