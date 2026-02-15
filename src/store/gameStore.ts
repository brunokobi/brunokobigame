import { create } from 'zustand';
import * as THREE from 'three'; 

export type Section = 'about' | 'projects' | 'contact' | null;
export type ProjectId = 'ecommerce' | 'mapas' | 'projetos' | null;

interface Skill {
  id: string;
  name: string;
  collected: boolean;
}

interface GameState {
  // UI State
  currentSection: Section;
  currentProject: ProjectId;
  
  // Estado para o Pop-up de texto simples (Toast)
  holocubeContent: string | null; 
  
  isAbducting: boolean;
  
  // Game Stats Existing
  score: number;
  skills: Skill[];

  // --- NOVO: ESTADOS DO CRONÔMETRO E VACAS ---
  startTime: number | null;
  endTime: number | null;
  isPlaying: boolean;
  totalCows: number;
  cowsAbducted: number;
  // -------------------------------------------

  // Posição do UFO
  ufoPosition: THREE.Vector3; 
  
  // Actions
  openModal: (section: Section) => void;
  closeModal: () => void;
  openProject: (projectId: ProjectId) => void; 
  interactWithHolocube: (content: string) => void; 

  setAbducting: (value: boolean) => void;
  setUfoPosition: (pos: THREE.Vector3) => void;
  
  // Actions de Gameplay atualizadas
  startGame: () => void; // NOVO
  abductCow: () => void; 
  collectSkill: (skillId: string) => void;
  resetGame: () => void;
}

const initialSkills: Skill[] = [
  { id: 'react', name: 'React', collected: false },
  { id: 'typescript', name: 'TypeScript', collected: false },
  { id: 'nodejs', name: 'Node.js', collected: false },
  { id: 'python', name: 'Python', collected: false },
  { id: 'aws', name: 'AWS', collected: false },
  { id: 'docker', name: 'Docker', collected: false },
  { id: 'php', name: 'PHP', collected: false },
  { id: 'postgresql', name: 'PostgreSQL', collected: false },
];

export const useGameStore = create<GameState>((set) => ({
  // Initial State
  currentSection: null,
  currentProject: null,
  holocubeContent: null,
  isAbducting: false,
  score: 0,
  skills: initialSkills,
  ufoPosition: new THREE.Vector3(0, 0, 0),

  // --- NOVO: VALORES INICIAIS DO JOGO ---
  startTime: null,
  endTime: null,
  isPlaying: false,
  totalCows: 5, // Defina aqui quantas vacas existem na cena (TechCows)
  cowsAbducted: 0,
  // --------------------------------------

  // Actions
  openModal: (section) => set({ 
    currentSection: section, 
    currentProject: null, 
    holocubeContent: null 
  }),
  
  closeModal: () => set({ 
    currentSection: null, 
    currentProject: null, 
    holocubeContent: null 
  }),
  
  openProject: (projectId) => set({ 
    currentProject: projectId, 
    currentSection: 'projects',
    holocubeContent: null 
  }),
  
  interactWithHolocube: (content) => set({ holocubeContent: content }),

  setAbducting: (value) => set({ isAbducting: value }),
  
  setUfoPosition: (pos) => set({ ufoPosition: pos }),

  // --- NOVO: INICIAR O JOGO (Chamado no useEffect do App ou Scene) ---
  startGame: () => set({ 
    startTime: Date.now(), 
    endTime: null, 
    isPlaying: true, 
    cowsAbducted: 0,
    score: 0,
    skills: initialSkills.map(s => ({...s, collected: false}))
  }),

  // --- ATUALIZADO: LÓGICA DE ABDUÇÃO COM VITORIA ---
  abductCow: () => set((state) => {
    // 1. Lógica do Cronômetro/Vitória
    const newAbductedCount = state.cowsAbducted + 1;
    let isPlaying = state.isPlaying;
    let endTime = state.endTime;

    // Se pegou a última vaca, para o jogo
    if (isPlaying && newAbductedCount >= state.totalCows) {
      isPlaying = false;
      endTime = Date.now();
    }

    // 2. Lógica Original das Skills e Score
    const newScore = state.score + 1;
    const nextUncollectedSkill = state.skills.find(s => !s.collected);
    let newSkills = state.skills;

    if (nextUncollectedSkill) {
      newSkills = state.skills.map(s => 
        s.id === nextUncollectedSkill.id ? { ...s, collected: true } : s
      );
    }

    return { 
      score: newScore, 
      skills: newSkills,
      cowsAbducted: newAbductedCount,
      isPlaying: isPlaying,
      endTime: endTime
    };
  }),
  
  collectSkill: (skillId) => set((state) => {
    const skill = state.skills.find(s => s.id === skillId);
    if (skill && !skill.collected) {
      return {
        score: state.score + 1,
        skills: state.skills.map(s => 
          s.id === skillId ? { ...s, collected: true } : s
        ),
      };
    }
    return state;
  }),
  
  resetGame: () => set({
    score: 0,
    skills: initialSkills,
    currentSection: null,
    currentProject: null,
    holocubeContent: null,
    ufoPosition: new THREE.Vector3(0, 0, 0),
    // Reset timer vars
    startTime: null,
    endTime: null,
    isPlaying: false,
    cowsAbducted: 0,
  }),
}));