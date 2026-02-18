import { useEffect, useState } from 'react'; 
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Timer, Trophy } from 'lucide-react'; 

export const HUD = () => {
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
  
  // Variável que diz se o jogo acabou (pegou as 8 skills)
  const isComplete = score >= totalSkills;

  // --- FORMATAÇÃO DE TEMPO ---
  const formatTime = (ms: number) => {
    if (ms < 0) ms = 0;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const [displayTime, setDisplayTime] = useState("00:00.00");

  // --- LÓGICA DO RELÓGIO (CORRIGIDA) ---
  useEffect(() => {
    let interval: any;

    // Só roda o relógio se estiver jogando E AINDA NÃO COMPLETOU (Blindagem)
    if (isPlaying && startTime && !isComplete) {
      interval = setInterval(() => {
        setDisplayTime(formatTime(Date.now() - startTime));
      }, 10);
    } 
    // Se acabou (tem endTime), fixa o valor exato final
    else if (endTime && startTime) {
      setDisplayTime(formatTime(endTime - startTime));
    }

    return () => clearInterval(interval);
  }, [isPlaying, startTime, endTime, isComplete]); // Adicionei isComplete aqui

  // Cálculo final para o Modal
  const finalTime = (endTime && startTime) 
    ? formatTime(endTime - startTime) 
    : displayTime;

  const handleRestart = () => {
    resetGame();
    setTimeout(() => {
      useGameStore.getState().startGame();
    }, 50);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none p-6 z-50">
      
      <div className="flex flex-col items-start gap-4 max-w-7xl mx-auto pointer-events-none">
        
        <div className="flex items-start gap-4 pointer-events-auto">
          {/* PLACAR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg min-w-[200px]"
          >
             <div className="flex items-center gap-4 mb-2">
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
               <div className="flex flex-col">
                 <span className="text-xs text-white/60 uppercase tracking-widest font-mono">
                   {isComplete ? 'MISSÃO CUMPRIDA' : 'PROGRESSO'}
                 </span>
                 <span className="text-2xl font-black text-[#00ffcc] drop-shadow-[0_0_5px_rgba(0,255,204,0.5)] font-mono">
                   {score} / {totalSkills}
                 </span>
               </div>
             </div>
             <Progress value={progressPercent} className="h-1.5 bg-white/10" />
          </motion.div>

          {/* RELÓGIO */}
          {startTime && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-xl border-2 font-mono text-xl font-bold shadow-lg backdrop-blur-md h-[88px]
                ${isComplete
                  ? 'bg-yellow-500/90 border-yellow-300 text-black shadow-yellow-500/50' 
                  : 'bg-black/40 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'}
              `}
            >
              {isComplete ? <Trophy size={20}/> : <Timer className="animate-pulse" size={20}/>}
              
              {/* Se completou, mostra o finalTime travado. Se não, mostra o tempo correndo */}
              <span>{isComplete ? finalTime : displayTime}</span>
            </motion.div>
          )}
        </div>

        {/* LISTA DE SKILLS */}
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
                <div className="w-5 h-5 rounded-full bg-[#00ffcc]/20 flex items-center justify-center border border-[#00ffcc]">
                  <span className="text-[#00ffcc] text-xs font-bold">✓</span>
                </div>
                <span className="text-white font-bold tracking-wide text-sm shadow-black drop-shadow-md">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL DE VITÓRIA */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-auto bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-black/90 rounded-2xl p-10 border-2 border-[#00ffcc] shadow-[0_0_50px_rgba(0,255,204,0.3)] text-center max-w-md mx-4 relative overflow-hidden">
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
            
            {/* TEMPO FINAL */}
            <div className="bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-lg py-2 px-4 mb-4 inline-block">
               <span className="text-[#00ffcc] font-mono font-bold text-xl">
                 Tempo: {finalTime}
               </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 relative z-10">
              Você dominou todas as {totalSkills} tecnologias!
            </p>
            
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-[#00ffcc] hover:bg-[#00ccaa] text-black font-black tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative z-10"
            >
              <RotateCcw size={20} />
              JOGAR NOVAMENTE
            </button>
          </div>
        </motion.div>
      )}
 
      {/* INDICADOR DE ABDUÇÃO */}
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