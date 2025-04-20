import { useEffect, useRef } from 'react';
import * as anime from 'animejs';
import { motion } from 'framer-motion';

const KnapsackVisualizer = ({ items, capacity, selectedItems, mode }) => {
  const knapsackRef = useRef(null);
  const lastSelectedItems = useRef([]);

  useEffect(() => {
    if (!knapsackRef.current) return;

    const newItems = selectedItems.filter(
      (item) => !lastSelectedItems.current.some((lastItem) => lastItem.id === item.id)
    );

    if (newItems.length > 0) {
      const itemElements = Array.from(knapsackRef.current.querySelectorAll('.item'))
        .filter((el) => newItems.some((item) => parseInt(el.dataset.id) === item.id));

      try {
        if (typeof anime === 'function') {
          anime({
            targets: itemElements,
            translateY: [50, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 800,
            delay: anime.stagger(150),
            easing: 'easeOutElastic(1, .8)'
          });
        }
      } catch (error) {
        console.error('Animation error:', error);
      }
    }

    lastSelectedItems.current = selectedItems;
  }, [selectedItems]);

  const calculateTotalWeight = () => {
    return selectedItems.reduce((sum, item) => sum + (item.weight * item.fraction), 0);
  };

  const calculateTotalValue = () => {
    return selectedItems.reduce((sum, item) => sum + (item.value * item.fraction), 0);
  };

  const getRandomColor = (value, weight) => {
    const hue = ((value * 10) + (weight * 5)) % 360;
    return `hsl(${hue}, 80%, 65%)`;
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Knapsack</h2>

      <div className="flex justify-between mb-2">
        <div>
          <span className="text-sm">Capacity:</span>
          <span className="ml-2 font-mono">{capacity}</span>
        </div>
        <div>
          <span className="text-sm">Used:</span>
          <span className="ml-2 font-mono">{calculateTotalWeight().toFixed(1)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 border-2 border-white/30 rounded-lg overflow-hidden relative flex flex-col-reverse"
          ref={knapsackRef}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-indigo-600/30"
            initial={{ height: '0%' }}
            animate={{ height: `${Math.min(100, (calculateTotalWeight() / capacity) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />

          <div className="relative z-10 p-2 flex flex-col-reverse gap-1">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                data-id={item.id}
                className="item p-2 rounded-md flex justify-between items-center"
                style={{
                  backgroundColor: getRandomColor(item.value, item.weight),
                  height: `${Math.max(40, (item.weight / capacity) * 200)}px`,
                  opacity: item.fraction < 1 ? 0.7 : 1
                }}
              >
                <div className="text-black">
                  <div className="font-bold text-sm">Value: {item.value}</div>
                  <div className="text-xs">Weight: {item.weight}</div>
                </div>
                {item.fraction < 1 && (
                  <div className="bg-white/80 text-black px-2 py-1 rounded-md text-xs font-bold">
                    {(item.fraction * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedItems.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              Empty knapsack
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-white/20 rounded-lg">
          <div className="flex justify-between">
            <span>Total Value:</span>
            <span className="font-mono">{calculateTotalValue().toFixed(1)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Total Weight:</span>
            <span className="font-mono">{calculateTotalWeight().toFixed(1)} / {capacity}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Items:</span>
            <span className="font-mono">{selectedItems.length} / {items.length}</span>
          </div>
          {selectedItems.length > 0 && mode === 'greedy' && selectedItems.some(item => item.fraction < 1) && (
            <div className="mt-2 text-xs text-white/70">
              * Fractional items are partially used
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnapsackVisualizer; 
