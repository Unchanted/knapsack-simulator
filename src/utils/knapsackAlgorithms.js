export const zeroOneKnapsack = (items, capacity) => {
  const n = items.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  const selected = Array(n + 1).fill().map(() => Array(capacity + 1).fill(false));
  
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (i === 0 || w === 0) {
        dp[i][w] = 0;
      } else {
        const item = items[i - 1];
        
        if (item.weight <= w) {
          const includeValue = item.value + dp[i - 1][w - item.weight];
          const excludeValue = dp[i - 1][w];
          
          if (includeValue > excludeValue) {
            dp[i][w] = includeValue;
            selected[i][w] = true;
          } else {
            dp[i][w] = excludeValue;
            selected[i][w] = false;
          }
        } else {
          dp[i][w] = dp[i - 1][w];
          selected[i][w] = false;
        }
      }
    }
  }
  
  const selectedItems = [];
  let i = n;
  let w = capacity;
  
  while (i > 0 && w > 0) {
    if (selected[i][w]) {
      selectedItems.push({
        ...items[i - 1],
        fraction: 1
      });
      w -= items[i - 1].weight;
    }
    i--;
  }
  
  return {
    maxValue: dp[n][capacity],
    selectedItems,
    dpTable: dp
  };
};

export const fractionalKnapsack = (items, capacity) => {
  const sortedItems = [...items]
    .map((item, index) => ({ 
      ...item, 
      index,
      ratio: item.value / item.weight 
    }))
    .sort((a, b) => b.ratio - a.ratio);
  
  let remainingCapacity = capacity;
  const selectedItems = [];
  let totalValue = 0;
  
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    
    if (remainingCapacity >= item.weight) {
      selectedItems.push({
        ...item,
        fraction: 1
      });
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else if (remainingCapacity > 0) {
      const fraction = remainingCapacity / item.weight;
      selectedItems.push({
        ...item,
        fraction
      });
      totalValue += item.value * fraction;
      remainingCapacity = 0;
    } else {
      break;
    }
  }
  
  return {
    maxValue: totalValue,
    selectedItems
  };
}; 