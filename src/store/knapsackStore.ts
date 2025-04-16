import { create } from 'zustand';
import { Item, KnapsackSolution, solveKnapsack, generateRandomItems } from '../algorithms/knapsack';

interface KnapsackState {
  items: Item[];
  capacity: number;
  solution: KnapsackSolution | null;
  currentStep: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isGeneratingItems: boolean;
  
  
  setItems: (items: Item[]) => void;
  setCapacity: (capacity: number) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, 'id'>>) => void;
  solve: () => void;
  reset: () => void;
  generateNewItems: (count: number) => void;
  
  
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  playSimulation: () => void;
  pauseSimulation: () => void;
  setPlaybackSpeed: (speed: number) => void;
}

const useKnapsackStore = create<KnapsackState>((set, get) => ({
  items: [],
  capacity: 50,
  solution: null,
  currentStep: 0,
  isPlaying: false,
  playbackSpeed: 1,
  isGeneratingItems: false,
  
  setItems: (items) => set({ items }),
  
  setCapacity: (capacity) => set({ capacity }),
  
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  solve: () => {
    const { items, capacity } = get();
    if (items.length === 0) return;
    
    const solution = solveKnapsack(items, capacity);
    set({ solution, currentStep: 0 });
  },
  
  reset: () => set({ 
    solution: null, 
    currentStep: 0,
    isPlaying: false
  }),
  
  generateNewItems: (count) => {
    set({ isGeneratingItems: true });
    
    setTimeout(() => {
      const items = generateRandomItems(count);
      set({ items, isGeneratingItems: false });
    }, 500);
  },
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => {
    if (!state.solution || state.currentStep >= state.solution.steps.length - 1) {
      return state;
    }
    return { currentStep: state.currentStep + 1 };
  }),
  
  prevStep: () => set((state) => {
    if (!state.solution || state.currentStep <= 0) {
      return state;
    }
    return { currentStep: state.currentStep - 1 };
  }),
  
  playSimulation: () => {
    set({ isPlaying: true });
    const playbackInterval = setInterval(() => {
      const { isPlaying, currentStep, solution, playbackSpeed } = get();
      
      if (!isPlaying || !solution) {
        clearInterval(playbackInterval);
        return;
      }
      
      if (currentStep >= solution.steps.length - 1) {
        set({ isPlaying: false });
        clearInterval(playbackInterval);
        return;
      }
      
      set({ currentStep: currentStep + 1 });
    }, 1000 / get().playbackSpeed);
    
    
    
    set({ playbackInterval });
  },
  
  pauseSimulation: () => {
    
    clearInterval(get().playbackInterval);
    set({ isPlaying: false });
  },
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed })
}));

export default useKnapsackStore; 