import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/* =========================================
   CONFIGURAÇÃO SUPABASE
   ========================================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/* =========================================
   TIPAGENS E FUNÇÕES AUXILIARES
   ========================================= */
interface PlayerScore {
  id: string;
  name: string;
  time: number;
  country: string;
}

// Formata ms para 00:00.00
const formatScoreTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

/* =========================================
   COMPONENTE: SCOREBOARD 3D
   ========================================= */
export const Scoreboard3D = ({ position = [0, 0, 0], rotation = [0, 0, 0] }: any) => {
  const [topScores, setTopScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealScores = async (isBackgroundUpdate = false) => {
      if (!isBackgroundUpdate) setLoading(true);
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('time', { ascending: true }) // Menor tempo primeiro
        .limit(10); // Top 10

      if (error) {
        console.error("Falha na interceptação de dados:", error.message);
      } else if (data) {
        setTopScores(data as PlayerScore[]);
      }
      
      if (!isBackgroundUpdate) setLoading(false);
    };

    fetchRealScores(false);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leaderboard' },
        (payload) => {
          console.log('Nova pontuação detectada na rede Alien!', payload);
          fetchRealScores(true); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <group position={position} rotation={rotation}>
      
      {/* 1. ESTRUTURA DE SUSTENTAÇÃO */}
      <mesh position={[-5, -6, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 12, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-5, -3, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      </mesh>

      <mesh position={[5, -6, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 12, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[5, -3, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 32]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      </mesh>

      {/* 2. CARCAÇA PRINCIPAL */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12.5, 10, 0.6]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.6} />
        
        <mesh position={[0, 0, 0.31]}>
            <planeGeometry args={[12.7, 10.2]} />
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1.5} side={2} transparent opacity={0.15} />
        </mesh>
      </mesh>

      {/* 3. TELA DIGITAL (HTML EM 3D) */}
      <Html
        transform
        occlude
        distanceFactor={4.8} 
        position={[0, 0, 0.32]}
        className="w-[1000px] h-[800px] overflow-hidden bg-[#050505] border-4 border-[#00ffcc]/40 p-8 flex flex-col rounded-xl shadow-[0_0_40px_rgba(0,255,204,0.3)] select-none"
      >
        <div 
          className="w-full h-full text-[#00ffcc] font-mono flex flex-col select-none" 
          style={{ 
            textShadow: '0 0 10px rgba(0, 255, 204, 0.8), 0 0 20px rgba(0, 255, 204, 0.4)',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          
          <div className="text-center mb-6 shrink-0">
            <h1 className="text-7xl font-black tracking-[0.3em] text-white" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(0, 255, 204, 0.8)' }}>
              TOP 10
            </h1>
            <p className="text-2xl tracking-widest text-[#00ffcc]/70 mt-3 uppercase font-sans font-bold">Fullstack Invasion - Leaderboard</p>
          </div>

          {/* Cabeçalho da Tabela - Atualizado para "NOME" e ajustado o layout do grid */}
          <div className="grid grid-cols-[1fr_auto_100px] gap-4 border-b-2 border-[#00ffcc]/30 pb-3 mb-4 text-3xl font-bold uppercase tracking-widest text-white/80 shrink-0">
            {/* Adicionado padding para centralizar o cabeçalho 'NOME' visualmente */}
            <div className="text-center pl-10">Nome</div> 
            <div className="text-center">Tempo</div>
            <div className="text-right pr-6">País</div>
          </div>

          <div className="flex flex-col flex-1 gap-3 pb-2 overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center animate-pulse text-[#00ffcc]/50 text-4xl tracking-widest">
                SINCRONIZANDO DADOS...
              </div>
            ) : topScores.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[#00ffcc]/50 text-4xl tracking-widest">
                NENHUM REGISTRO ENCONTRADO
              </div>
            ) : (
              topScores.map((score, index) => (
                <div 
                  key={score.id} 
                  className={`grid grid-cols-[1fr_auto_100px] gap-4 items-center py-2 px-6 rounded-lg transition-colors
                    ${index === 0 ? 'bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-white font-black text-5xl' : 'text-[#00ffcc]/90 text-4xl'}`
                  }
                >
                  {/* Centralizado o texto do nome dentro da div */}
                  <div className="text-center flex items-center justify-center gap-4">
                    <span className={`w-14 text-right absolute left-8 ${index === 0 ? 'text-[#00ffcc]' : 'text-[#00ffcc]/50'}`}>
                      {index + 1}.
                    </span>
                    <span className="tracking-[0.2em] pl-8">
                      {score.name.substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-center font-bold tracking-[0.1em]">
                    {formatScoreTime(score.time)}
                  </div>
                  
                  <div className="text-right flex justify-end items-center h-full">
                    {score.country ? (
                      <img 
                        src={`https://flagcdn.com/w80/${score.country.toLowerCase()}.png`} 
                        alt={score.country}
                        // Bandeira aumentada (w-16 h-10) e forçada proporção com object-cover
                        className="w-16 h-10 object-cover rounded-sm border border-[#00ffcc]/30"
                      />
                    ) : (
                      <span className="text-white/50">--</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </Html>
    </group>
  );
};