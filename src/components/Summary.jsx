import { motion } from 'framer-motion';

const Summary = ({ maxValue, selectedItems, items, mode }) => {
  const calculateTotalWeight = () => {
    return selectedItems.reduce((sum, item) => sum + (item.weight * item.fraction), 0);
  };
  
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Simulation Completed</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Result</h3>
          <div className="flex justify-between">
            <span>Algorithm:</span>
            <span className="font-mono">
              {mode === 'dp' ? '0/1 Knapsack (DP)' : 'Fractional Knapsack (Greedy)'}
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Maximum Value:</span>
            <span className="font-mono text-green-400">{maxValue.toFixed(1)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Total Weight:</span>
            <span className="font-mono">{calculateTotalWeight().toFixed(1)}</span>
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-lg col-span-2">
          <h3 className="font-bold mb-2">Selected Items</h3>
          {selectedItems.length === 0 ? (
            <p className="text-white/60">No items selected</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="bg-white/20 p-2 rounded-lg">
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span className="font-mono">{item.weight}</span>
                  </div>
                  {item.fraction < 1 && (
                    <div className="flex justify-between">
                      <span>Fraction:</span>
                      <span className="font-mono">{(item.fraction * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <h3 className="font-bold mb-2">Algorithm Explanation</h3>
        {mode === 'dp' ? (
          <p>
            The 0/1 Knapsack algorithm uses dynamic programming to find the optimal selection of items 
            without allowing fractional items. It builds a table where each cell [i][j] represents the 
            maximum value achievable with the first i items and a capacity of j. The final solution 
            is found at cell [n][W].
          </p>
        ) : (
          <p>
            The Fractional Knapsack algorithm uses a greedy approach by sorting items by value-to-weight ratio. 
            It then adds items in order of decreasing ratio, taking fractions of items when the capacity doesn't 
            allow for a whole item to be included. This approach always finds the optimal solution for the 
            fractional knapsack problem.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Summary; 