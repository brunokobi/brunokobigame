import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

const LOADING_DURATION = 5000;
const TOTAL_SKILLS = 8;

const skillNames = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'];

const LoadingScreen = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [skillCount, setSkillCount] = useState(0);

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);

      setProgress(newProgress);

      // Update skill count based on progress
      const newSkillCount = Math.min(Math.floor((newProgress / 100) * TOTAL_SKILLS), TOTAL_SKILLS);
      setSkillCount(newSkillCount);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            navigate('/game');
          }, 1000);
        }, 800);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-opacity duration-1000 flex flex-col items-center justify-center ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'rgb(5, 5, 16)' }}
    >
      {/* Subtle star background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 w-full max-w-lg">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="text-5xl mb-3">👽</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em]">
            <span className="text-primary neon-text">THE FULLSTACK</span>
          </h1>
          <h2 className="text-foreground/90 text-2xl md:text-3xl tracking-[0.3em] font-bold mt-1">
            INVASION
          </h2>
        </motion.div>

        {/* HUD-style progress section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full"
        >
          <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-lg">
            {/* Score header */}
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                className="text-3xl"
                animate={{
                  rotate: skillCount >= TOTAL_SKILLS ? [0, 10, -10, 0] : 0,
                  scale: skillCount >= TOTAL_SKILLS ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  repeat: skillCount >= TOTAL_SKILLS ? Infinity : 0,
                  duration: 1,
                }}
              >
                👽
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xs text-white/60 uppercase tracking-widest font-mono">
                  {skillCount >= TOTAL_SKILLS ? 'MISSÃO CUMPRIDA' : 'PROGRESSO'}
                </span>
                <span
                  className="text-2xl font-black drop-shadow-[0_0_5px_rgba(0,255,204,0.5)]"
                  style={{ fontFamily: 'monospace', color: '#00ffcc' }}
                >
                  {skillCount} / {TOTAL_SKILLS}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <Progress
              value={progress}
              className="h-1.5 bg-white/10"
            />

            {/* Collected skills list */}
            <div className="mt-4 flex flex-col gap-2">
              <AnimatePresence>
                {skillNames.slice(0, skillCount).map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border-l-4"
                    style={{ borderColor: '#00ffcc' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center border"
                      style={{
                        background: 'rgba(0, 255, 204, 0.2)',
                        borderColor: '#00ffcc',
                      }}
                    >
                      <span style={{ color: '#00ffcc' }} className="text-xs font-bold">✓</span>
                    </div>
                    <span className="text-white font-bold tracking-wide text-sm drop-shadow-md">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tutorial / Controls at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        {isMobile ? (
          /* Mobile controls preview */
          <div className="tutorial-bar flex items-center gap-4 text-xs px-4 py-2">
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">🕹️</span>
              <span className="text-muted-foreground">Joystick</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">👽</span>
              <span className="text-muted-foreground">Abduzir</span>
            </div>
          </div>
        ) : (
          /* Desktop controls preview */
          <div className="tutorial-bar flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">W</kbd>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">A</kbd>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">S</kbd>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">D</kbd>
              </div>
              <span className="text-muted-foreground">Voar</span>
            </div>

            <div className="w-px h-6 bg-border" />

            <div className="flex items-center gap-2">
              <kbd className="px-3 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-mono text-primary">
                ESPAÇO
              </kbd>
              <span className="text-muted-foreground">Abduzir</span>
            </div>

            <div className="w-px h-6 bg-border" />

            <div className="flex items-center gap-2">
              <span className="text-primary">🖱️</span>
              <span className="text-muted-foreground">Arrastar para girar câmera</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
