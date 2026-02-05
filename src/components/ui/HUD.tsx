import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
 import { Progress } from '@/components/ui/progress';

export const HUD = () => {
  const { score, skills, isAbducting } = useGameStore();
  const totalSkills = skills.length;
  const collectedSkills = skills.filter(s => s.collected);
   const progressPercent = (score / totalSkills) * 100;
   const isComplete = score >= totalSkills;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-6">
      <div className="flex justify-between items-start max-w-7xl mx-auto">
        {/* Score Display */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
           className="score-badge flex-col gap-2"
        >
           <div className="flex items-center gap-3">
             <motion.span 
               className="text-2xl"
               animate={{ 
                 rotate: isComplete ? [0, 10, -10, 0] : 0,
                 scale: isComplete ? [1, 1.2, 1] : 1
               }}
               transition={{ repeat: isComplete ? Infinity : 0, duration: 1 }}
             >
               👽
             </motion.span>
             <div className="flex flex-col">
               <span className="text-xs text-muted-foreground uppercase tracking-wider">
                 {isComplete ? 'Missão Completa!' : 'Skills Coletadas'}
               </span>
               <span className="text-xl font-bold text-primary neon-text">
                 {score} / {totalSkills}
               </span>
             </div>
           </div>
           
           {/* Progress Bar */}
           <div className="w-full mt-2">
             <Progress 
               value={progressPercent} 
               className="h-2 bg-background/50"
             />
          </div>
        </motion.div>

        {/* Collected Skills */}
        {collectedSkills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
             className="flex flex-wrap gap-2 max-w-xs justify-end hidden md:flex"
          >
            {collectedSkills.map((skill, index) => (
              <motion.span
                key={skill.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="skill-tag"
              >
                {skill.name}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

       {/* Victory Message */}
       {isComplete && (
         <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
         >
           <div className="bg-background/80 backdrop-blur-md rounded-xl p-8 border border-primary/50 shadow-lg shadow-primary/20">
             <motion.div 
               className="text-6xl mb-4"
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ repeat: Infinity, duration: 1 }}
             >
               🛸✨
             </motion.div>
             <h2 className="text-2xl font-bold text-primary neon-text mb-2">
               Invasão Completa!
             </h2>
             <p className="text-muted-foreground">
               Você coletou todas as {totalSkills} skills!
             </p>
           </div>
         </motion.div>
       )}
 
      {/* Abduction Indicator */}
      {isAbducting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
           className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        >
          <div className="text-primary text-6xl animate-pulse neon-text">
            ⚡ ABDUZINDO ⚡
          </div>
        </motion.div>
      )}
    </div>
  );
};
