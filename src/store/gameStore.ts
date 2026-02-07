import { create } from 'zustand';
import * as THREE from 'three'; // <--- 1. IMPORTANTE: Importar THREE para usar Vector3

export type Section = 'about' | 'projects' | 'contact' | null;
export type ProjectId = 'ecommerce' | 'saas' | 'mobile' | null;

interface Skill {
  id: string;
  name: string;
  collected: boolean;
}

interface GameState {
  // UI State
  currentSection: Section;
  currentProject: ProjectId;
  isAbducting: boolean;
  
  // Game Stats
  score: number;
  skills: Skill[];

  // --- 2. NOVO: Posição do UFO para as vacas lerem ---
  ufoPosition: THREE.Vector3; 
  
  // Actions
  openModal: (section: Section) => void;
  closeModal: () => void;
  openProject: (projectId: ProjectId) => void;
  setAbducting: (value: boolean) => void;
  
  // --- 3. NOVO: Ação para atualizar posição do UFO ---
  setUfoPosition: (pos: THREE.Vector3) => void;

  // --- 4. NOVO: Ação genérica para quando abduzir uma vaca ---
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
  { id: 'graphql', name: 'GraphQL', collected: false },
  { id: 'postgresql', name: 'PostgreSQL', collected: false },
];

export const useGameStore = create<GameState>((set) => ({
  // Initial State
  currentSection: null,
  currentProject: null,
  isAbducting: false,
  score: 0,
  skills: initialSkills,
  
  // Inicializa a posição do UFO no centro
  ufoPosition: new THREE.Vector3(0, 0, 0),

  // Actions
  openModal: (section) => set({ currentSection: section, currentProject: null }),
  closeModal: () => set({ currentSection: null, currentProject: null }),
  openProject: (projectId) => set({ currentProject: projectId, currentSection: 'projects' }),
  
  setAbducting: (value) => set({ isAbducting: value }),
  
  // Atualiza a posição (Chamado pelo componente UFO.tsx a cada frame)
  setUfoPosition: (pos) => set({ ufoPosition: pos }),

  // Lógica da Abdução da Vaca
  abductCow: () => set((state) => {
    // 1. Aumenta o score
    const newScore = state.score + 1;

    // 2. (Opcional) Desbloqueia a próxima skill da lista que ainda não foi pega
    // Isso faz com que cada vaca dê uma skill nova
    const nextUncollectedSkill = state.skills.find(s => !s.collected);
    let newSkills = state.skills;

    if (nextUncollectedSkill) {
      newSkills = state.skills.map(s => 
        s.id === nextUncollectedSkill.id ? { ...s, collected: true } : s
      );
    }

    return { 
      score: newScore, 
      skills: newSkills 
    };
  }),
  
  // Mantivemos o collectSkill caso você tenha itens específicos flutuando (logos)
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
    ufoPosition: new THREE.Vector3(0, 0, 0),
  }),
}));