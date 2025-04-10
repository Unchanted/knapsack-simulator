/**
 * @param {Array} items - Array of objects with weight and value properties
 * @param {Number} capacity - Maximum capacity of the knapsack
 * @returns {Object} The solution containing maxValue and selected items
 */
export function solveKnapsack(items, capacity) {
  const n = items.length;
  // Create a 2d array for the dynamic programming table
  // dp[i][w] will represent the maximum value that can be obtained
  // using the first i items and with a knapsack capacity of w
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

  // Track which items are included in the optimal solution
  const included = Array(n + 1).fill().map(() => Array(capacity + 1).fill(false));

  // Store all states for visualization
  const states = [];

  // Fill the dp table
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Save the current state for visualization
      states.push({
        currentItem: i > 0 ? i - 1 : null,
        currentCapacity: w,
        dpTable: JSON.parse(JSON.stringify(dp)),
      });

      if (i === 0 || w === 0) {
        dp[i][w] = 0;
      } else if (items[i - 1].weight <= w) {
        // If the current item can fit in the knapsack
        const includeValue = dp[i - 1][w - items[i - 1].weight] + items[i - 1].value;
        const excludeValue = dp[i - 1][w];

        if (includeValue > excludeValue) {
          dp[i][w] = includeValue;
          included[i][w] = true;
        } else {
          dp[i][w] = excludeValue;
          included[i][w] = false;
        }
      } else {
        // If the current item cannot fit, exclude it
        dp[i][w] = dp[i - 1][w];
        included[i][w] = false;
      }
    }
  }

  // Backtrack to find which items are in the optimal solution
  const selectedItems = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (included[i][w]) {
      selectedItems.push({ ...items[i - 1], index: i - 1 });
      w -= items[i - 1].weight;
    }
  }

  return {
    maxValue: dp[n][capacity],
    selectedItems: selectedItems.reverse(),
    dpTable: dp,
    states,
  };
}

/**
 * Generates random items for the knapsack problem
 * 
 * @param {Number} count - Number of items to generate
 * @returns {Array} Array of objects with weight, value, and color properties
 */
export function generateRandomItems(count) {
  const items = [];
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
    '#EF476F', '#FFC43D', '#1B9AAA', '#6F2DBD', '#F15BB5'
  ];

  for (let i = 0; i < count; i++) {
    const weight = Math.floor(Math.random() * 10) + 1; // Weight between 1-10
    const value = Math.floor(Math.random() * 20) + 5;  // Value between 5-24
    const color = colors[i % colors.length]; // Cycle through colors

    items.push({
      id: i,
      name: `Item ${i + 1}`,
      weight,
      value,
      color,
      // Generate a random shape for 3D rendering
      shape: ['cube', 'sphere', 'cylinder', 'cone', 'torus'][i % 5]
    });
  }

  return items;
}
