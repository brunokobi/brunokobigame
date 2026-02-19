import { useEffect, useState } from 'react'; 
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Timer, Trophy, Send, CheckCircle2, AlertTriangle } from 'lucide-react'; 
import { createClient } from "@supabase/supabase-js";

/* =========================================
   CONFIGURAÇÃO SUPABASE DIRETA NO ARQUIVO
   ========================================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/* =========================================
   LISTA DE PAÍSES (BANDEIRAS)
   ========================================= */
const COUNTRIES = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'US', name: 'EUA', flag: '🇺🇸' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'FR', name: 'França', flag: '🇫🇷' },
  { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
];

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
  const isComplete = score >= totalSkills;

  // --- ESTADOS DO PLACAR ---
  const [playerName, setPlayerName] = useState("");
  const [countryCode, setCountryCode] = useState("BR");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Estados da Lógica de Top 10
  const [isCheckingRank, setIsCheckingRank] = useState(false);
  const [isTop10, setIsTop10] = useState(false);
  const [checkedRank, setCheckedRank] = useState(false);

  // --- BUSCA IP AUTO ---
  useEffect(() => {
    if (isComplete) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          // Só seta se o país retornado estiver na nossa lista, senão deixa BR
          const exists = COUNTRIES.find(c => c.code === data.country_code);
          if (exists) setCountryCode(data.country_code);
        })
        .catch(() => {});
    }
  }, [isComplete]);

  // --- CHECA SE O TEMPO ENTROU NO TOP 10 ---
  useEffect(() => {
    const checkLeaderboard = async () => {
      if (!isComplete || !startTime || !endTime) return;
      
      setIsCheckingRank(true);
      const finalTimeMs = endTime - startTime;

      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('time')
          .order('time', { ascending: true })
          .limit(10);

        if (!error && data) {
          // Se tiver menos de 10 registros, qualquer tempo entra
          if (data.length < 10) {
            setIsTop10(true);
          } else {
            // Se tiver 10, compara com o pior tempo do Top 10 (o último do array)
            const worstTop10Time = data[9].time;
            if (finalTimeMs < worstTop10Time) {
              setIsTop10(true);
            } else {
              setIsTop10(false);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao checar placar", err);
      } finally {
        setIsCheckingRank(false);
        setCheckedRank(true);
      }
    };

    if (isComplete && !checkedRank) {
      checkLeaderboard();
    }
  }, [isComplete, startTime, endTime, checkedRank]);

  // --- SALVAR O TEMPO NO BANCO ---
  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !endTime || !startTime) return;

    setIsSaving(true);
    const finalTimeMs = endTime - startTime;
    const finalName = playerName.trim().toUpperCase().substring(0, 5);

    const { error } = await supabase
      .from('leaderboard')
      .insert([{ name: finalName, time: finalTimeMs, country: countryCode }]);

    setIsSaving(false);

    if (!error) {
      setIsSaved(true);
    } else {
      alert("Falha na transmissão. Tente novamente.");
    }
  };

  // --- FORMATAÇÃO DE TEMPO ---
  const formatTime = (ms: number) => {
    if (ms < 0) ms = 0;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const [displayTime, setDisplayTime] = useState("00:00.00");

  useEffect(() => {
    let interval: any;
    if (isPlaying && startTime && !isComplete) {
      interval = setInterval(() => {
        setDisplayTime(formatTime(Date.now() - startTime));
      }, 10);
    } else if (endTime && startTime) {
      setDisplayTime(formatTime(endTime - startTime));
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime, endTime, isComplete]);

  const finalTime = (endTime && startTime) ? formatTime(endTime - startTime) : displayTime;

  const handleRestart = () => {
    setIsSaved(false);
    setCheckedRank(false);
    setIsTop10(false);
    setPlayerName("");
    resetGame();
    setTimeout(() => {
      useGameStore.getState().startGame();
    }, 50);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none p-6 z-50">
      
      {/* Container Principal do HUD Esquerdo */}
      <div className="flex flex-col items-start gap-4 max-w-7xl mx-auto pointer-events-none">
        <div className="flex items-start gap-4 pointer-events-auto">
          {/* PLACAR DE PROGRESSO */}
          <motion.div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg min-w-[200px]">
             <div className="flex items-center gap-4 mb-2">
               <motion.div 
                 className="text-3xl"
                 animate={{ rotate: isComplete ? [0, 10, -10, 0] : 0, scale: isComplete ? [1, 1.2, 1] : 1 }}
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
            <motion.div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 font-mono text-xl font-bold shadow-lg backdrop-blur-md h-[88px] ${isComplete ? 'bg-yellow-500/90 border-yellow-300 text-black shadow-yellow-500/50' : 'bg-black/40 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10'}`}>
              {isComplete ? <Trophy size={20}/> : <Timer className="animate-pulse" size={20}/>}
              <span>{isComplete ? finalTime : displayTime}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* --- MODAL DE VITÓRIA E FORMULÁRIO DO PLACAR --- */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-auto bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-black/90 rounded-2xl p-8 border-2 border-[#00ffcc] shadow-[0_0_50px_rgba(0,255,204,0.3)] text-center max-w-md w-full mx-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00ffcc]/10 to-transparent pointer-events-none" />
            
            <motion.div className="text-7xl mb-4 inline-block" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              🛸✨
            </motion.div>
            
            <h2 className="text-3xl font-black text-[#00ffcc] mb-2 tracking-widest relative z-10">
              INVASÃO COMPLETA!
            </h2>
            
            <div className="bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-lg py-2 px-4 mb-6 inline-block">
               <span className="text-[#00ffcc] font-mono font-bold text-xl">
                 Tempo: {finalTime}
               </span>
            </div>

            {/* AVALIAÇÃO DO TOP 10 */}
            <div className="mb-6 relative z-10 text-left">
              {isCheckingRank ? (
                <div className="flex justify-center text-[#00ffcc]/70 animate-pulse text-sm font-bold tracking-widest uppercase">
                  Analisando ranking global...
                </div>
              ) : isSaved ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
                  <div className="flex justify-center mb-2"><CheckCircle2 size={48} className="text-[#00ffcc]" /></div>
                  <p className="text-[#00ffcc] font-bold tracking-widest uppercase">RECORDE ENVIADO À NAVE MÃE!</p>
                  <p className="text-slate-400 text-xs mt-2">Verifique o placar 3D na pista.</p>
                </motion.div>
              ) : isTop10 ? (
                <form onSubmit={handleSaveScore} className="space-y-4">
                  <div className="text-center mb-2">
                    <span className="inline-block bg-[#00ffcc] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                      NOVO RECORDE GLOBAL!
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-[#00ffcc] text-[10px] font-bold tracking-widest uppercase ml-1">PILOTO (MAX 5)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                        placeholder="ALIEN"
                        className="w-full bg-black border border-[#00ffcc]/40 rounded-lg px-4 py-3 text-[#00ffcc] font-black uppercase placeholder-[#00ffcc]/30 focus:outline-none focus:border-[#00ffcc] shadow-[inset_0_0_10px_rgba(0,255,204,0.1)] transition-all font-mono text-center text-xl tracking-[0.2em]"
                      />
                    </div>

                    <div className="w-[120px] space-y-1">
                      <label className="text-[#00ffcc] text-[10px] font-bold tracking-widest uppercase ml-1">PAÍS</label>
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full appearance-none bg-black border border-[#00ffcc]/40 rounded-lg pl-4 pr-8 py-3 text-[#00ffcc] font-black focus:outline-none focus:border-[#00ffcc] shadow-[inset_0_0_10px_rgba(0,255,204,0.1)] transition-all text-2xl"
                        >
                          {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.flag}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#00ffcc]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving || playerName.length < 2}
                    className="w-full py-3 bg-[#00ffcc] hover:bg-[#00ccaa] text-black font-black tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  >
                    {isSaving ? "TRANSMITINDO..." : <><Send size={18} /> GRAVAR NO PLACAR</>}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex justify-center mb-2"><AlertTriangle size={32} className="text-yellow-500" /></div>
                  <p className="text-white font-bold tracking-widest uppercase text-sm">Bom trabalho, mas...</p>
                  <p className="text-slate-400 text-xs mt-1 px-4">Seu tempo não foi rápido o suficiente para entrar no TOP 10 global desta vez.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-4 bg-transparent border-2 border-[#00ffcc] hover:bg-[#00ffcc] text-[#00ffcc] hover:text-black font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 relative z-10 uppercase"
            >
              <RotateCcw size={20} /> JOGAR NOVAMENTE
            </button>
          </div>
        </motion.div>
      )}

      {isAbducting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-[#00ffcc] text-4xl font-black tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_#00ffcc]">ABDUZINDO...</div>
        </motion.div>
      )}
    </div>
  );
};