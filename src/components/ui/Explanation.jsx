import { motion } from 'framer-motion';
import useKnapsackStore from '../../store/knapsackStore';

export default function Explanation() {
  const { solution, currentStateIndex, items } = useKnapsackStore();

  if (!solution || !solution.states[currentStateIndex]) return null;

  const state = solution.states[currentStateIndex];
  const itemIndex = state.currentItem;
  const capacity = state.currentCapacity;

  const currentItem = itemIndex !== null ? items[itemIndex] : null;

  let explanation = "";

  if (itemIndex === null || capacity === 0) {
    explanation = "Initializing the DP table with base cases (when no items are considered or when capacity is 0, the maximum value is 0).";
  } else {
    const itemWeight = currentItem.weight;
    const itemValue = currentItem.value;

    if (itemWeight > capacity) {
      explanation = `Item ${itemIndex + 1} (weight: ${itemWeight}) doesn't fit in capacity ${capacity}, so we take the value from the row above: ${state.dpTable[itemIndex][capacity]}.`;
    } else {
      const valueIfTaken = state.dpTable[itemIndex][capacity - itemWeight] + itemValue;
      const valueIfNotTaken = state.dpTable[itemIndex][capacity];

      if (valueIfTaken > valueIfNotTaken) {
        explanation = `For item ${itemIndex + 1} and capacity ${capacity}, we can either:
        1. Take the item: ${state.dpTable[itemIndex][capacity - itemWeight]} (previous items with capacity ${capacity - itemWeight}) + ${itemValue} (value of current item) = ${valueIfTaken}
        2. Skip the item: ${valueIfNotTaken} (previous items with full capacity)
        
        Taking the item gives higher value (${valueIfTaken} > ${valueIfNotTaken}), so we choose to include item ${itemIndex + 1}.`;
      } else {
        explanation = `For item ${itemIndex + 1} and capacity ${capacity}, we can either:
        1. Take the item: ${state.dpTable[itemIndex][capacity - itemWeight]} (previous items with capacity ${capacity - itemWeight}) + ${itemValue} (value of current item) = ${valueIfTaken}
        2. Skip the item: ${valueIfNotTaken} (previous items with full capacity)
        
        Skipping the item gives higher or equal value (${valueIfNotTaken} >= ${valueIfTaken}), so we choose to exclude item ${itemIndex + 1}.`;
      }
    }
  }

  return (
    <motion.div
      className="glass rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-3 text-accent-300">Algorithm Explanation</h3>

      <div className="p-3 bg-gray-800/70 rounded-lg">
        {currentItem && (
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-gray-300">Currently considering: </span>
              <span className="font-bold" style={{ color: currentItem.color }}>
                {currentItem.name} (Weight: {currentItem.weight}, Value: {currentItem.value})
              </span>
            </div>
            <div className="px-2 py-1 bg-gray-700 rounded text-xs">
              Step {currentStateIndex + 1} of {solution.states.length}
            </div>
          </div>
        )}

        <div className="whitespace-pre-line text-sm text-gray-200">
          {explanation}
        </div>
      </div>
    </motion.div>
  );
}
