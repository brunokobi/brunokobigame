import { motion } from 'framer-motion';
 import { useIsMobile } from '@/hooks/use-mobile';

export const Tutorial = () => {
   const isMobile = useIsMobile();
 
   // Mobile tutorial - shows at top, simpler
   if (isMobile) {
     return (
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
         className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
       >
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
       </motion.div>
     );
   }
 
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="tutorial-bar flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">W</kbd>
            <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">A</kbd>
            <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">S</kbd>
            <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">D</kbd>
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
    </motion.div>
  );
};
