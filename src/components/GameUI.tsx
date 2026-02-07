import { useGameStore } from "@/store/gameStore";

export const GameUI = () => {
  // 1. Pega os dados do estado global
  const { score, skills } = useGameStore();

  // 2. Filtra apenas as skills que já foram coletadas
  const collectedSkills = skills.filter((s) => s.collected);

  return (
    // 'pointer-events-none' é IMPORTANTE: permite clicar no jogo 3D através da UI
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 p-8">
      
      <div className="flex flex-col gap-6">
        
        {/* --- PLACAR --- */}
        <div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg" style={{ fontFamily: 'monospace' }}>
            SKILLS: <span className="text-[#00ffcc]">{score}</span> / {skills.length}
          </h1>
        </div>

        {/* --- LISTA DE SKILLS --- */}
        <div className="flex flex-col gap-3">
          {collectedSkills.map((skill) => (
            <div 
              key={skill.id}
              className="flex items-center gap-3 text-white font-bold text-xl animate-in slide-in-from-left-10 fade-in duration-300"
            >
              {/* Bolinha neon */}
              <div className="w-3 h-3 rounded-full bg-[#00ffcc] shadow-[0_0_10px_#00ffcc]" />
              
              {/* Nome da Skill */}
              <span className="drop-shadow-md tracking-wide">
                {skill.name}
              </span>
            </div>
          ))}

          {/* Mensagem se não tiver nada ainda */}
          {collectedSkills.length === 0 && (
            <span className="text-white/40 italic text-sm ml-1">
              Explore o mapa para encontrar projetos...
            </span>
          )}
        </div>

      </div>
    </div>
  );
};