import { create } from 'zustand';
import * as THREE from 'three'; 

export type Section = 'about' | 'projects' | 'contact' | null;

// CORREÇÃO AQUI: Atualizei os nomes para baterem com o seu Modals.tsx
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
  
  // Game Stats
  score: number;
  skills: Skill[];

  // Posição do UFO
  ufoPosition: THREE.Vector3; 
  
  // Actions
  openModal: (section: Section) => void;
  closeModal: () => void;
  openProject: (projectId: ProjectId) => void; // Abre o modal de projetos com o ID específico
  
  interactWithHolocube: (content: string) => void; // Abre apenas o toast de texto

  setAbducting: (value: boolean) => void;
  setUfoPosition: (pos: THREE.Vector3) => void;
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

  // Actions
  
  // Abre modais gerais (Sobre, Contato)
  openModal: (section) => set({ 
    currentSection: section, 
    currentProject: null, 
    holocubeContent: null 
  }),
  
  // Fecha tudo
  closeModal: () => set({ 
    currentSection: null, 
    currentProject: null, 
    holocubeContent: null 
  }),
  
  // Abre modal de Projeto Específico (Mapas, Projetos, Ecommerce)
  openProject: (projectId) => set({ 
    currentProject: projectId, 
    currentSection: 'projects', // Isso força o Modals.tsx a renderizar o <ProjectModal />
    holocubeContent: null 
  }),
  
  // Abre apenas mensagem de texto
  interactWithHolocube: (content) => set({ holocubeContent: content }),

  setAbducting: (value) => set({ isAbducting: value }),
  
  setUfoPosition: (pos) => set({ ufoPosition: pos }),

  abductCow: () => set((state) => {
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
      skills: newSkills 
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
  }),
}));