import { motion } from 'framer-motion';

export const Tutorial = () => {
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
          <span className="text-muted-foreground">ou Setas para Voar</span>
        </div>
        
        <div className="w-px h-6 bg-border" />
        
        <div className="flex items-center gap-2">
          <kbd className="px-3 py-1 bg-primary/20 border border-primary/30 rounded text-xs font-mono text-primary">
            ESPAÇO
          </kbd>
          <span className="text-muted-foreground">Abduzir</span>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="text-xs text-muted-foreground italic">
          Clique na tela para ativar controles
        </div>
      </div>
    </motion.div>
  );
};
