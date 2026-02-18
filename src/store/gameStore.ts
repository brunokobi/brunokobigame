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
  currentSection: Section;
  currentProject: ProjectId;
  holocubeContent: string | null; 
  isAbducting: boolean;
  score: number;
  skills: Skill[];

  // Estados do Cronômetro
  startTime: number | null;
  endTime: number | null;
  isPlaying: boolean;
  
  ufoPosition: THREE.Vector3; 
  
  openModal: (section: Section) => void;
  closeModal: () => void;
  openProject: (projectId: ProjectId) => void; 
  interactWithHolocube: (content: string) => void; 
  setAbducting: (value: boolean) => void;
  setUfoPosition: (pos: THREE.Vector3) => void;
  
  startGame: () => void;
  abductCow: () => void; 
  collectSkill: (skillId: string) => void;
  resetGame: () => void;
}

const INITIAL_SKILLS_DATA: Skill[] = [
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
  currentSection: null,
  currentProject: null,
  holocubeContent: null,
  isAbducting: false,
  score: 0,
  skills: INITIAL_SKILLS_DATA.map(s => ({ ...s })), 
  ufoPosition: new THREE.Vector3(0, 0, 0),

  startTime: null,
  endTime: null,
  isPlaying: false,

  openModal: (section) => set({ currentSection: section, currentProject: null, holocubeContent: null }),
  closeModal: () => set({ currentSection: null, currentProject: null, holocubeContent: null }),
  openProject: (projectId) => set({ currentProject: projectId, currentSection: 'projects', holocubeContent: null }),
  interactWithHolocube: (content) => set({ holocubeContent: content }),
  setAbducting: (value) => set({ isAbducting: value }),
  setUfoPosition: (pos) => set({ ufoPosition: pos }),

  startGame: () => set({ 
    startTime: Date.now(), 
    endTime: null, 
    isPlaying: true, 
    score: 0,
    skills: INITIAL_SKILLS_DATA.map(s => ({ ...s, collected: false })) 
  }),

  abductCow: () => set((state) => {
    if (!state.isPlaying) return {};

    // 1. Marca a próxima skill como coletada
    const nextUncollectedIndex = state.skills.findIndex(s => !s.collected);
    if (nextUncollectedIndex === -1) return {};

    const newSkills = [...state.skills];
    newSkills[nextUncollectedIndex] = { ...newSkills[nextUncollectedIndex], collected: true };

    // 2. Calcula Placar
    const newScore = newSkills.filter(s => s.collected).length;
    const totalSkills = newSkills.length; // 8

    // 3. Verifica Vitória
    const isVictory = newScore >= totalSkills;
    
    // Se ganhou, para o tempo AGORA
    const newEndTime = isVictory ? Date.now() : state.endTime;
    const newIsPlaying = isVictory ? false : state.isPlaying;

    return { 
      skills: newSkills,
      score: newScore,
      isPlaying: newIsPlaying,
      endTime: newEndTime
    };
  }),
  
  collectSkill: (skillId) => set((state) => {
     const skillIndex = state.skills.findIndex(s => s.id === skillId);
     if (skillIndex !== -1 && !state.skills[skillIndex].collected) {
        const newSkills = [...state.skills];
        newSkills[skillIndex] = { ...newSkills[skillIndex], collected: true };
        return { score: state.score + 1, skills: newSkills };
     }
     return {};
  }),
  
  resetGame: () => set({
    score: 0,
    skills: INITIAL_SKILLS_DATA.map(s => ({ ...s, collected: false })),
    currentSection: null,
    currentProject: null,
    holocubeContent: null,
    ufoPosition: new THREE.Vector3(0, 0, 0),
    startTime: null,
    endTime: null,
    isPlaying: false,
  }),
}));