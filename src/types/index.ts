export interface Item {
  id: string;
  value: number;
  weight: number;
  position?: [number, number, number]; // x, y, z
  selected?: boolean;
  animationState?: 'idle' | 'hover' | 'selected' | 'rejected';
}

export interface KnapsackState {
  capacity: number;
  items: Item[];
  currentStep: number;
  table: number[][];
  selectedItems: Item[];
  totalValue: number;
  totalWeight: number;
  isRunning: boolean;
  isComplete: boolean;
}

export type AlgorithmSpeed = 'slow' | 'normal' | 'fast';

export interface Visual {
  theme: 'cosmic' | 'cyberspace' | 'ethereal';
  particleDensity: number;
  showEffects: boolean;
  showPerformance: boolean;
}
