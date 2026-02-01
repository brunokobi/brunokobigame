import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export const HUD = () => {
  const { score, skills, isAbducting } = useGameStore();
  const totalSkills = skills.length;
  const collectedSkills = skills.filter(s => s.collected);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-6">
      <div className="flex justify-between items-start max-w-7xl mx-auto">
        {/* Score Display */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="score-badge"
        >
          <span className="text-2xl">👽</span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Skills</span>
            <span className="text-xl font-bold text-primary neon-text">
              {score} / {totalSkills}
            </span>
          </div>
        </motion.div>

        {/* Collected Skills */}
        {collectedSkills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2 max-w-xs justify-end"
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

      {/* Abduction Indicator */}
      {isAbducting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="text-primary text-6xl animate-pulse neon-text">
            ⚡ ABDUZINDO ⚡
          </div>
        </motion.div>
      )}
    </div>
  );
};
