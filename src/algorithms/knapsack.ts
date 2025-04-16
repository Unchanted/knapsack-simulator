export interface Item {
  id: string;
  value: number;
  weight: number;
}

export interface KnapsackStep {
  i: number;
  w: number;
  value: number;
  itemTaken: boolean;
  prev?: { i: number; w: number };
}

export interface KnapsackSolution {
  maxValue: number;
  selectedItems: Item[];
  table: number[][];
  steps: KnapsackStep[];
}

export function solveKnapsack(items: Item[], capacity: number): KnapsackSolution {
  const n = items.length;
  
  const table: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));
  
  const steps: KnapsackStep[] = [];

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const item = items[i - 1];
      
      if (item.weight <= w) {
        const valueWithItem = item.value + table[i - 1][w - item.weight];
        const valueWithoutItem = table[i - 1][w];
        
        table[i][w] = Math.max(valueWithItem, valueWithoutItem);
        
        const itemTaken = valueWithItem > valueWithoutItem;
        steps.push({
          i,
          w,
          value: table[i][w],
          itemTaken,
          prev: itemTaken ? { i: i - 1, w: w - item.weight } : { i: i - 1, w }
        });
      } else {
        table[i][w] = table[i - 1][w];
        
        steps.push({
          i,
          w,
          value: table[i][w],
          itemTaken: false,
          prev: { i: i - 1, w }
        });
      }
    }
  }

  const selectedItems: Item[] = [];
  let i = n;
  let w = capacity;
  
  while (i > 0 && w > 0) {
    if (table[i][w] !== table[i - 1][w]) {
      const item = items[i - 1];
      selectedItems.push(item);
      w -= item.weight;
    }
    i--;
  }

  return {
    maxValue: table[n][capacity],
    selectedItems,
    table,
    steps
  };
}

export function generateRandomItems(count: number, maxValue = 100, maxWeight = 50): Item[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    value: Math.floor(Math.random() * maxValue) + 1,
    weight: Math.floor(Math.random() * maxWeight) + 1
  }));
} 