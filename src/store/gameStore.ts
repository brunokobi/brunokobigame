import { create } from 'zustand';

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
  
  // Actions
  openModal: (section: Section) => void;
  closeModal: () => void;
  openProject: (projectId: ProjectId) => void;
  setAbducting: (value: boolean) => void;
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

  // Actions
  openModal: (section) => set({ currentSection: section, currentProject: null }),
  closeModal: () => set({ currentSection: null, currentProject: null }),
  openProject: (projectId) => set({ currentProject: projectId, currentSection: 'projects' }),
  setAbducting: (value) => set({ isAbducting: value }),
  
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
  }),
}));
