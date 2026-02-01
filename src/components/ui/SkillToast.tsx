import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export const SkillToast = () => {
  const { skills } = useGameStore();
  const lastCollected = skills.filter(s => s.collected).slice(-1)[0];

  if (!lastCollected) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={lastCollected.id}
        initial={{ opacity: 0, y: 50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -20, x: '-50%' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 left-1/2 z-50"
      >
        <div className="glass-card px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🐄✨</span>
          <div>
            <p className="text-sm text-muted-foreground">Skill Abduzida!</p>
            <p className="text-lg font-bold text-primary neon-text">
              Você aprendeu {lastCollected.name}!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
