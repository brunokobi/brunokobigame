import { useEffect, useState } from 'react';
// ATENÇÃO AQUI: O caminho muda pois estamos dentro de components/ui
import { useGameStore } from '../../store/gameStore'; 
import { Timer, Trophy } from 'lucide-react';

export const GameTimer = () => {
  const { startTime, endTime, isPlaying, cowsAbducted, totalCows } = useGameStore();
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

  if (!startTime) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <div className={`
        px-6 py-2 rounded-xl border-2 font-mono text-2xl font-bold shadow-lg backdrop-blur-md transition-all
        ${!isPlaying && endTime
          ? 'bg-yellow-500/90 border-yellow-300 text-black shadow-yellow-500/50 scale-110'
          : 'bg-slate-900/80 border-cyan-500 text-cyan-400 shadow-cyan-500/20'}
      `}>
        <div className="flex items-center gap-3">
          {!isPlaying && endTime ? <Trophy size={24}/> : <Timer className="animate-pulse" size={24}/>}
          <span>{displayTime}</span>
        </div>
      </div>

      
    </div>
  );
};