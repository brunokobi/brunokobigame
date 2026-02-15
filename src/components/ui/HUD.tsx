import { useEffect, useState } from 'react'; // Adicionado useState e useEffect
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Timer, Trophy } from 'lucide-react'; // Ícones adicionados

export const HUD = () => {
  // 1. Pegamos os dados da store (incluindo tempo)
  const { 
    score, 
    skills, 
    isAbducting, 
    resetGame, 
    startTime, 
    endTime, 
    isPlaying 
  } = useGameStore();
  
  const totalSkills = skills.length;
  const collectedSkills = skills.filter(s => s.collected);
  const progressPercent = (score / totalSkills) * 100;
  const isComplete = score >= totalSkills;

  // --- LÓGICA DO CRONÔMETRO ---
  const [displayTime, setDisplayTime] = useState("00:00.00");

  useEffect(() => {
    let interval: any;

    if (isPlaying && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - startTime;
        setDisplayTime(formatTime(diff));
      }, 10);
    } else if (endTime && startTime) {
      const diff = endTime - startTime;
      setDisplayTime(formatTime(diff));
    }

    return () => clearInterval(interval);
  }, [isPlaying, startTime, endTime]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };
  // -----------------------------

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none p-6 z-50">
      
      {/* Container Principal do HUD (Topo Esquerdo) */}
      <div className="flex flex-col items-start gap-4 max-w-7xl mx-auto pointer-events-none">
        
        {/* GRUPO: PLACAR + CRONÔMETRO (Lado a Lado) */}
        <div className="flex items-start gap-4 pointer-events-auto">
          
          {/* --- 1. PLACAR (SCORE) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg min-w-[200px]"
          >
             <div className="flex items-center gap-4 mb-2">
               {/* Ícone Alien Animado */}
               <motion.div 
                 className="text-3xl"
                 animate={{ 
                   rotate: isComplete ? [0, 10, -10, 0] : 0,
                   scale: isComplete ? [1, 1.2, 1] : 1
                 }}
                 transition={{ repeat: isComplete ? Infinity : 0, duration: 1 }}
               >
                 👽
               </motion.div>

               {/* Texto do Placar */}
               <div className="flex flex-col">
                 <span className="text-xs text-white/60 uppercase tracking-widest font-mono">
                   {isComplete ? 'MISSÃO CUMPRIDA' : 'PROGRESSO'}
                 </span>
                 <span className="text-2xl font-black text-[#00ffcc] drop-shadow-[0_0_5px_rgba(0,255,204,0.5)] font-mono">
                   {score} / {totalSkills}
                 </span>
               </div>
             </div>
             
             {/* Barra de Progresso */}
             <Progress 
               value={progressPercent} 
               className="h-1.5 bg-white/10" 
             />
          </motion.div>

          {/* --- 2. CRONÔMETRO (NOVO) --- */}
          {startTime && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-xl border-2 font-mono text-xl font-bold shadow-lg backdrop-blur-md h-[88px]
                ${!isPlaying && endTime
                  ? 'bg-yellow-500/90 border-yellow-300 text-black shadow-yellow-500/50' 
                  : 'bg-black/40 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'}
              `}
            >
              {!isPlaying && endTime ? <Trophy size={20}/> : <Timer className={isPlaying ? "animate-pulse" : ""} size={20}/>}
              <span>{displayTime}</span>
            </motion.div>
          )}

        </div>

        {/* --- 3. LISTA DE SKILLS (EMBAIXO) --- */}
        <div className="flex flex-col gap-2 pointer-events-auto mt-2">
          <AnimatePresence>
            {collectedSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4 border-[#00ffcc] w-fit"
              >
                {/* Checkmark */}
                <div className="w-5 h-5 rounded-full bg-[#00ffcc]/20 flex items-center justify-center border border-[#00ffcc]">
                  <span className="text-[#00ffcc] text-xs font-bold">✓</span>
                </div>
                
                {/* Nome da Skill */}
                <span className="text-white font-bold tracking-wide text-sm shadow-black drop-shadow-md">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- BOTÃO DE REINICIAR (CANTO SUPERIOR DIREITO) --- */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 pointer-events-auto"
      >
        <button
          onClick={() => {
            if(window.confirm("Reiniciar a missão? Todo o progresso será perdido.")) {
               resetGame();
            }
          }}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 border border-red-500/50 px-4 py-2 rounded-lg backdrop-blur-md transition-all group"
        >
          <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
          <span className="font-bold text-sm tracking-wide">REINICIAR</span>
        </button>
      </motion.div>

      {/* --- MENSAGEM DE VITÓRIA (CENTRO DA TELA) --- */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-auto bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-black/90 rounded-2xl p-10 border-2 border-[#00ffcc] shadow-[0_0_50px_rgba(0,255,204,0.3)] text-center max-w-md mx-4 relative overflow-hidden">
            {/* Efeito de Confete/Brilho (Opcional) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00ffcc]/10 to-transparent pointer-events-none" />
            
            <motion.div 
              className="text-7xl mb-6 inline-block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🛸✨
            </motion.div>
            <h2 className="text-4xl font-black text-[#00ffcc] mb-2 tracking-widest relative z-10">
              INVASÃO COMPLETA!
            </h2>
            
            {/* TEMPO FINAL NO MODAL DE VITÓRIA */}
            <div className="bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-lg py-2 px-4 mb-4 inline-block">
               <span className="text-[#00ffcc] font-mono font-bold text-xl">Tempo: {displayTime}</span>
            </div>

            <p className="text-gray-300 text-lg mb-8 relative z-10">
              Você dominou todas as {totalSkills} tecnologias!
            </p>
            
            <button
              onClick={resetGame}
              className="w-full py-4 bg-[#00ffcc] hover:bg-[#00ccaa] text-black font-black tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative z-10"
            >
              <RotateCcw size={20} />
              JOGAR NOVAMENTE
            </button>
          </div>
        </motion.div>
      )}
 
      {/* --- INDICADOR DE ABDUÇÃO --- */}
      {isAbducting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        >
          <div className="text-[#00ffcc] text-4xl font-black tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_#00ffcc]">
            ABDUZINDO...
          </div>
        </motion.div>
      )}

    </div>
  );
};