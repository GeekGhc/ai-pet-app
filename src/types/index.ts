export interface Pet {
  id: string;
  name: string;
  level: number;
  stage: 'egg' | 'baby' | 'young' | 'adult';
  stats: PetStats;
  evolutionEnergy: number;
  appearance: PetAppearance;
  createdAt: number;
}

export interface PetStats {
  rational: number;
  poetic: number;
  exploratory: number;
  social: number;
}

export interface PetAppearance {
  bodyColor: string;
  wingType: 'none' | 'rational' | 'poetic' | 'exploratory' | 'social';
  auraType: 'none' | 'rational' | 'poetic' | 'exploratory' | 'social';
  expression: 'happy' | 'excited' | 'concerned' | 'encouraging' | 'calm';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'pet';
  content: string;
  timestamp: number;
}

export interface Task {
  id: string;
  type: 'math' | 'chinese' | 'science' | 'english';
  title: string;
  description: string;
  reward: number;
  rewardType: keyof PetStats;
  completed: boolean;
}

export interface AppState {
  pet: Pet | null;
  chatHistory: ChatMessage[];
  tasks: Task[];
  totalStudyDays: number;
}