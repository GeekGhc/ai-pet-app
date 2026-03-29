import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Pet, ChatMessage, Task, PetStats } from '../types';

type Action =
  | { type: 'SET_PET'; payload: Pet }
  | { type: 'UPDATE_STATS'; payload: Partial<PetStats> }
  | { type: 'ADD_ENERGY'; payload: { type: keyof PetStats; amount: number } }
  | { type: 'SET_PET_EXPRESSION'; payload: Pet['appearance']['expression'] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'EVOLVE'; payload: Pet['stage'] };

const initialTasks: Task[] = [
  { id: '1', type: 'math', title: '数学练习', description: '完成数学练习题', reward: 20, rewardType: 'rational', completed: false },
  { id: '2', type: 'chinese', title: '语文写作', description: '完成语文写作任务', reward: 20, rewardType: 'poetic', completed: false },
  { id: '3', type: 'science', title: '科学实验', description: '完成科学探索任务', reward: 20, rewardType: 'exploratory', completed: false },
  { id: '4', type: 'english', title: '英语对话', description: '完成英语口语练习', reward: 20, rewardType: 'social', completed: false },
];

function createInitialPet(): Pet {
  return {
    id: Date.now().toString(),
    name: '小灵',
    level: 1,
    stage: 'egg',
    stats: { rational: 0, poetic: 0, exploratory: 0, social: 0 },
    evolutionEnergy: 0,
    appearance: {
      bodyColor: '#6C5CE7',
      wingType: 'none',
      auraType: 'none',
      expression: 'happy',
    },
    createdAt: Date.now(),
  };
}

const initialState: AppState = {
  pet: null,
  chatHistory: [],
  tasks: initialTasks,
  totalStudyDays: 1,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PET':
      return { ...state, pet: action.payload };
    case 'UPDATE_STATS':
      if (!state.pet) return state;
      return {
        ...state,
        pet: {
          ...state.pet,
          stats: { ...state.pet.stats, ...action.payload },
        },
      };
    case 'ADD_ENERGY':
      if (!state.pet) return state;
      const currentValue = state.pet.stats[action.payload.type];
      const newValue = Math.min(100, currentValue + action.payload.amount);
      const energyGain = action.payload.amount;
      return {
        ...state,
        pet: {
          ...state.pet,
          stats: { ...state.pet.stats, [action.payload.type]: newValue },
          evolutionEnergy: state.pet.evolutionEnergy + energyGain,
        },
      };
    case 'SET_PET_EXPRESSION':
      if (!state.pet) return state;
      return {
        ...state,
        pet: {
          ...state.pet,
          appearance: { ...state.pet.appearance, expression: action.payload },
        },
      };
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: true } : task
        ),
      };
    case 'EVOLVE':
      if (!state.pet) return state;
      return {
        ...state,
        pet: { ...state.pet, stage: action.payload, level: state.pet.level + 1 },
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addEnergy: (type: keyof PetStats, amount: number) => void;
  sendMessage: (content: string) => void;
  completeTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedPet = localStorage.getItem('spirit-pet');
    if (savedPet) {
      try {
        const pet = JSON.parse(savedPet);
        dispatch({ type: 'SET_PET', payload: pet });
      } catch {
        dispatch({ type: 'SET_PET', payload: createInitialPet() });
      }
    } else {
      dispatch({ type: 'SET_PET', payload: createInitialPet() });
    }
  }, []);

  useEffect(() => {
    if (state.pet) {
      localStorage.setItem('spirit-pet', JSON.stringify(state.pet));
    }
  }, [state.pet]);

  const addEnergy = (type: keyof PetStats, amount: number) => {
    dispatch({ type: 'ADD_ENERGY', payload: { type, amount } });
    
    const expressions: Record<keyof PetStats, Pet['appearance']['expression']> = {
      rational: 'excited',
      poetic: 'happy',
      exploratory: 'encouraging',
      social: 'happy',
    };
    dispatch({ type: 'SET_PET_EXPRESSION', payload: expressions[type] });
    
    setTimeout(() => {
      dispatch({ type: 'SET_PET_EXPRESSION', payload: 'happy' });
    }, 2000);
  };

  const getPetResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const responses = [
      { keywords: ['累', '困', '疲惫', '辛苦'], response: '哎呀，看你这么辛苦，快去休息一下吧！学习重要，但身体更重要哦～💪' },
      { keywords: ['加油', '努力', '坚持', '奋斗'], response: '加油！我相信你一定可以的！让我陪你一起努力！✨' },
      { keywords: ['开心', '高兴', '快乐', '兴奋'], response: '太棒了！看到你开心我也好开心呀！🎉' },
      { keywords: ['难过', '伤心', '失望', '沮丧'], response: '别难过，一切都会好起来的。我会一直陪着你～💜' },
      { keywords: ['考试', '成绩', '分数'], response: '考试只是检验学习的一种方式，相信自己，你一定可以的！📚' },
    ];

    for (const rule of responses) {
      if (rule.keywords.some((k) => lowerMessage.includes(k))) {
        return rule.response;
      }
    }

    const defaultResponses = [
      '今天学习了什么新知识呀？好奇宝宝想知道更多！',
      '我在这里陪你一起学习呀～有任何问题都可以问我！',
      '哇，听起来你今天过得很充实呢！',
      '记得要劳逸结合哦，休息一下再来继续！',
      '我相信你一定能做得更好！加油！',
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    setTimeout(() => {
      const petResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'pet',
        content: getPetResponse(content),
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: petResponse });
    }, 500);
  };

  const completeTask = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      addEnergy(task.rewardType, task.reward);
      dispatch({ type: 'COMPLETE_TASK', payload: taskId });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addEnergy, sendMessage, completeTask }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}