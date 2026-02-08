import { useState, useEffect } from 'react';

interface LoadingProgressProps {
  progress: number;
  isComplete: boolean;
}

const messages = [
  'Inicializando sistema...',
  'Conectando com o universo...',
  'Carregando módulos...',
  'Sincronizando dados...',
  'Estabelecendo conexão...',
];

const LoadingProgress = ({ progress, isComplete }: LoadingProgressProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const message = messages[messageIndex];
    let charIndex = 0;
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayedText(message.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [messageIndex]);

  return (
    <div className={`relative z-10 flex flex-col items-center gap-8 px-4 transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      {/* Main title */}
      <div className="text-center">
        <h1 
          className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-2 glitch"
          data-text="BRUNO KOBI"
        >
          BRUNO KOBI
        </h1>
        <div className="flex items-center justify-center gap-2 text-neon-green font-mono text-sm sm:text-base">
          <span className="text-nebula-light">&lt;</span>
          <span>developer</span>
          <span className="text-nebula-light">/&gt;</span>
        </div>
      </div>

      {/* Status message with typing effect */}
      <div className="h-8 flex items-center">
        <p className="font-mono text-sm sm:text-base text-muted-foreground border-r-2 border-neon-green pr-1 animate-[blink-cursor_1s_step-end_infinite]">
          {displayedText}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="relative h-1 bg-secondary/50 rounded-full overflow-hidden">
          {/* Progress fill */}
          <div 
            className="absolute inset-y-0 left-0 bg-neon-green rounded-full animate-progress-glow transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          
          {/* Glow effect */}
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-green to-transparent opacity-50 rounded-full blur-sm"
            style={{ width: `${progress + 5}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <div className="flex justify-between mt-3 font-mono text-xs text-muted-foreground">
          <span className="text-neon-green">[</span>
          <span>{Math.round(progress)}%</span>
          <span className="text-neon-green">]</span>
        </div>
      </div>

      {/* Tech decorations */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground/50">
        <span>SYS_INIT</span>
        <span className="text-neon-green">●</span>
        <span>v1.0.0</span>
        <span className="text-neon-green">●</span>
        <span>READY</span>
      </div>
    </div>
  );
};

export default LoadingProgress;
