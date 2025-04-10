import { create } from 'zustand';
import { solveKnapsack, generateRandomItems } from '../utils/knapsackAlgorithm.js';

const useKnapsackStore = create((set, get) => ({
  capacity: 15,
  items: generateRandomItems(5),
  solution: null,
  currentStateIndex: 0,
  isAnimating: false,
  animationSpeed: 500,

  setItems: (items) => set({ items }),

  setCapacity: (capacity) => set({ capacity }),

  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: state.items.length }]
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
    const solution = solveKnapsack(items, capacity);
    set({ solution, currentStateIndex: 0, isAnimating: false });
    return solution;
  },

  generateRandomItems: (count) => {
    const items = generateRandomItems(count);
    set({ items, solution: null, currentStateIndex: 0 });
  },

  startAnimation: () => {
    const { solution, isAnimating } = get();
    if (!solution || isAnimating) return;

    set({ isAnimating: true });

    const animate = () => {
      const { currentStateIndex, animationSpeed, solution, isAnimating } = get();

      if (!isAnimating) return;

      if (currentStateIndex < solution.states.length - 1) {
        set({ currentStateIndex: currentStateIndex + 1 });
        setTimeout(animate, animationSpeed);
      } else {
        set({ isAnimating: false });
      }
    };

    setTimeout(animate, get().animationSpeed);
  },

  pauseAnimation: () => set({ isAnimating: false }),

  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  setCurrentStateIndex: (index) => set({ currentStateIndex: index }),

  reset: () => set({ solution: null, currentStateIndex: 0, isAnimating: false }),
}));

export default useKnapsackStore;
