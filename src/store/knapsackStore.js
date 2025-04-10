import { create } from 'zustand';
import { solveKnapsack, generateRandomItems } from '../utils/knapsackAlgorithm';

const useKnapsackStore = create((set, get) => ({
  capacity: 15,
  items: [],
  solution: null,
  currentStateIndex: 0,
  isAnimating: false,
  animationSpeed: 500,
  animationTimer: null,

  setCapacity: (capacity) => set({ capacity }),

  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: state.items.length }]
  })),

  generateRandomItems: (count) => {
    const items = generateRandomItems(count);
    set({ items, solution: null, currentStateIndex: 0 });
  },

  solve: () => {
    const { items, capacity } = get();
    const solution = solveKnapsack(items, capacity);
    set({ solution, currentStateIndex: 0, isAnimating: false });
    return solution;
  },

  reset: () => {
    const { animationTimer } = get();
    if (animationTimer) clearTimeout(animationTimer);
    set({ solution: null, currentStateIndex: 0, isAnimating: false, animationTimer: null });
  },

  startAnimation: () => {
    const { solution, isAnimating, animationTimer } = get();
    if (!solution || isAnimating) return;

    if (animationTimer) clearTimeout(animationTimer);

    set({ isAnimating: true });

    const animate = () => {
      const { currentStateIndex, animationSpeed, solution, isAnimating } = get();

      if (!isAnimating) return;

      if (currentStateIndex < solution.states.length - 1) {
        const timer = setTimeout(() => {
          set({ currentStateIndex: currentStateIndex + 1 });
          animate();
        }, animationSpeed);

        set({ animationTimer: timer });
      } else {
        set({ isAnimating: false, animationTimer: null });
      }
    };

    animate();
  },

  pauseAnimation: () => {
    const { animationTimer } = get();
    if (animationTimer) clearTimeout(animationTimer);
    set({ isAnimating: false, animationTimer: null });
  },

  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  setCurrentStateIndex: (index) => set({ currentStateIndex: index }),
}));

export default useKnapsackStore;
