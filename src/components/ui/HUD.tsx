import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export const HUD = () => {
  const { score, skills, isAbducting } = useGameStore();
  const totalSkills = skills.length;
  const collectedSkills = skills.filter(s => s.collected);
  const progressPercent = (score / totalSkills) * 100;
  const isComplete = score >= totalSkills;

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6">
      
      {/* Container Principal */}
      <div className="flex flex-col items-start gap-4 max-w-7xl mx-auto">
        
        {/* --- 1. PLACAR (SCORE) --- */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg min-w-[250px]"
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
               <span className="text-2xl font-black text-[#00ffcc] drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]" style={{ fontFamily: 'monospace' }}>
                 {score} / {totalSkills}
               </span>
             </div>
           </div>
           
           {/* Barra de Progresso */}
           <Progress 
             value={progressPercent} 
             className="h-1.5 bg-white/10" 
             // Se o componente Progress aceitar cor customizada, ótimo. Senão, é via CSS global ou tailwind.
           />
        </motion.div>

        {/* --- 2. LISTA DE SKILLS (EMBAIXO DO PLACAR) --- */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {collectedSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4 border-[#00ffcc]"
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

      {/* --- MENSAGEM DE VITÓRIA (CENTRO DA TELA) --- */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto"
        >
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-10 border-2 border-[#00ffcc] shadow-[0_0_50px_rgba(0,255,204,0.3)]">
            <motion.div 
              className="text-7xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🛸✨
            </motion.div>
            <h2 className="text-4xl font-black text-[#00ffcc] mb-2 tracking-widest">
              INVASÃO COMPLETA!
            </h2>
            <p className="text-gray-300 text-lg">
              Você dominou todas as {totalSkills} tecnologias!
            </p>
          </div>
        </motion.div>
      )}
 
      {/* --- INDICADOR DE ABDUÇÃO --- */}
      {isAbducting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-[#00ffcc] text-4xl font-black tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_#00ffcc]">
            ABDUZINDO...
          </div>
        </motion.div>
      )}

    </div>
  );
};