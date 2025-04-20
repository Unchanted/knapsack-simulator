import { useState, useEffect } from 'react';
import { zeroOneKnapsack, fractionalKnapsack } from '../utils/knapsackAlgorithms';

const useKnapsackSimulation = (items, capacity, mode, step) => {
  const [solution, setSolution] = useState({
    maxValue: 0,
    selectedItems: [],
    dpTable: [],
    currentHighlight: null
  });
  
  useEffect(() => {
    if (items.length === 0) {
      setSolution({
        maxValue: 0,
        selectedItems: [],
        dpTable: [],
        currentHighlight: null
      });
      return;
    }
    
    if (mode === 'dp') {
      simulateDPStep(step);
    } else {
      simulateGreedyStep(step);
    }
  }, [items, capacity, mode, step]);
  
  const simulateDPStep = (currentStep) => {
    const n = items.length;
    const w = capacity;
    
    const dp = Array(n + 1).fill().map(() => Array(w + 1).fill(0));
    const selected = Array(n + 1).fill().map(() => Array(w + 1).fill(false));
    
    if (currentStep === 0) {
      setSolution({
        ...solution,
        dpTable: dp,
        selectedItems: [],
        maxValue: 0,
        currentHighlight: null
      });
      return;
    }
    
    let stepCount = 0;
    let currHighlight = null;
    
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= w; j++) {
        stepCount++;
        
        if (stepCount > currentStep) {
          setSolution({
            ...solution,
            dpTable: dp,
            currentHighlight: currHighlight,
            maxValue: dp[n][w]
          });
          return;
        }
        
        currHighlight = { i, j };
        
        if (i === 0 || j === 0) {
          dp[i][j] = 0;
        } else {
          const itemIndex = i - 1;
          const itemWeight = items[itemIndex].weight;
          const itemValue = items[itemIndex].value;
          
          if (itemWeight <= j) {
            if (itemValue + dp[i-1][j-itemWeight] > dp[i-1][j]) {
              dp[i][j] = itemValue + dp[i-1][j-itemWeight];
              selected[i][j] = true;
            } else {
              dp[i][j] = dp[i-1][j];
              selected[i][j] = false;
            }
          } else {
            dp[i][j] = dp[i-1][j];
            selected[i][j] = false;
          }
        }
      }
    }
    
    if (currentStep >= (n + 1) * (w + 1)) {
      const selectedItems = [];
      let i = n;
      let j = w;
      
      while (i > 0 && j > 0) {
        if (selected[i][j]) {
          selectedItems.push({
            ...items[i - 1],
            fraction: 1
          });
          j -= items[i - 1].weight;
        }
        i--;
      }
      
      setSolution({
        ...solution,
        dpTable: dp,
        selectedItems,
        maxValue: dp[n][w],
        currentHighlight: null
      });
    }
  };
  
  const simulateGreedyStep = (currentStep) => {
    if (currentStep === 0) {
      setSolution({
        ...solution,
        selectedItems: [],
        maxValue: 0,
        currentHighlight: null
      });
      return;
    }
    
    const sortedItems = [...items]
      .map((item, index) => ({ 
        ...item, 
        index,
        ratio: item.value / item.weight 
      }))
      .sort((a, b) => b.ratio - a.ratio);
    
    if (currentStep === 1) {
      setSolution({
        ...solution,
        selectedItems: [],
        maxValue: 0,
        currentHighlight: { type: 'sort', items: sortedItems }
      });
      return;
    }
    
    const remainingCapacity = capacity;
    const selectedItems = [];
    let totalValue = 0;
    let remainingCap = remainingCapacity;
    let currentItem = null;
    
    for (let i = 0; i < sortedItems.length; i++) {
      const itemStep = i + 2;
      if (currentStep < itemStep) break;
      
      const item = sortedItems[i];
      currentItem = item;
      
      if (remainingCap >= item.weight) {
        selectedItems.push({
          ...item,
          fraction: 1
        });
        totalValue += item.value;
        remainingCap -= item.weight;
      } else if (remainingCap > 0) {
        const fraction = remainingCap / item.weight;
        selectedItems.push({
          ...item,
          fraction
        });
        totalValue += item.value * fraction;
        remainingCap = 0;
      }
      
      if (currentStep === itemStep) {
        setSolution({
          ...solution,
          selectedItems,
          maxValue: totalValue,
          currentHighlight: { type: 'add', item: currentItem, remainingCapacity: remainingCap }
        });
        return;
      }
    }
    
    setSolution({
      ...solution,
      selectedItems,
      maxValue: totalValue,
      currentHighlight: null
    });
  };
  
  return { solution, setSolution };
};

export default useKnapsackSimulation; 