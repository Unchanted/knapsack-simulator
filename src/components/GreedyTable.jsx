import React, { useEffect, useRef } from 'react';
import * as anime from 'animejs';

const GreedyTable = ({ items, capacity, step, solution, setSolution }) => {
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
  
  useEffect(() => {
    if (items.length === 0) return;
    
    if (step === 0) {
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
    
    if (step === 1) {
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
      if (step < itemStep) break;
      
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
      
      if (step === itemStep) {
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
  }, [items, capacity, step, setSolution]);
  
  useEffect(() => {
    if (solution.currentHighlight && highlightRef.current) {
      try {
        if (typeof anime === 'function') {
          anime({
            targets: highlightRef.current,
            scale: [1, 1.1, 1],
            backgroundColor: ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.7)', 'rgba(139, 92, 246, 0.3)'],
            duration: 800,
            easing: 'easeInOutQuad'
          });
        }
      } catch (error) {
        console.error('Animation error:', error);
      }
    }
  }, [solution.currentHighlight]);
  
  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg text-white/70">Add items to start the simulation</p>
      </div>
    );
  }
  
  const getItemsWithRatio = () => {
    return items.map(item => ({
      ...item,
      ratio: item.value / item.weight
    }));
  };
  
  const getSortedItemsWithRatio = () => {
    return [...getItemsWithRatio()].sort((a, b) => b.ratio - a.ratio);
  };
  
  const getTooltipText = (item, type) => {
    if (type === 'sort') {
      return `Sort by value/weight ratio: ${item.value}/${item.weight} = ${item.ratio.toFixed(2)}`;
    }
    
    if (solution.currentHighlight?.type === 'add' && solution.currentHighlight.item.id === item.id) {
      const remainingCap = solution.currentHighlight.remainingCapacity;
      if (remainingCap >= item.weight) {
        return `Add entire item (value: ${item.value}, weight: ${item.weight})`;
      } else if (remainingCap > 0) {
        const fraction = remainingCap / item.weight;
        return `Add ${(fraction * 100).toFixed(0)}% of item (partial value: ${(item.value * fraction).toFixed(2)})`;
      } else {
        return `Cannot add item (no capacity left)`;
      }
    }
    
    return `Value: ${item.value}, Weight: ${item.weight}, Ratio: ${item.ratio.toFixed(2)}`;
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Fractional Knapsack (Greedy Algorithm)</h2>
      
      <div className="flex-1 overflow-auto" ref={tableRef}>
        {step === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg text-white/70">Press play or step to start the simulation</p>
          </div>
        ) : (
          <>
            <p className="mb-4">
              {step === 1 ? 
                "Step 1: Sort items by value/weight ratio (highest first)" : 
                `Step ${step}: Add items greedily according to ratio`}
            </p>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 bg-white/20 text-center">Item</th>
                  <th className="p-2 bg-white/20 text-center">Value</th>
                  <th className="p-2 bg-white/20 text-center">Weight</th>
                  <th className="p-2 bg-white/20 text-center">Value/Weight Ratio</th>
                  <th className="p-2 bg-white/20 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(step === 1 ? getItemsWithRatio() : getSortedItemsWithRatio()).map((item, i) => {
                  const selectedItem = solution.selectedItems.find(si => si.id === item.id);
                  const isHighlighted = solution.currentHighlight?.type === 'add' && 
                                       solution.currentHighlight.item.id === item.id;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors duration-300 ${
                        selectedItem ? 'bg-green-600/20' : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title={getTooltipText(item, step === 1 ? 'sort' : 'add')}
                      ref={isHighlighted ? highlightRef : null}
                    >
                      <td className="p-3 text-center">Item {step === 1 ? i + 1 : item.index + 1}</td>
                      <td className="p-3 text-center font-mono">{item.value}</td>
                      <td className="p-3 text-center font-mono">{item.weight}</td>
                      <td className="p-3 text-center font-mono">{item.ratio.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        {selectedItem ? (
                          selectedItem.fraction === 1 ? (
                            <span className="text-green-400">Added (100%)</span>
                          ) : (
                            <span className="text-green-400">
                              Added ({(selectedItem.fraction * 100).toFixed(0)}%)
                            </span>
                          )
                        ) : step > 1 ? (
                          <span className="text-white/40">Not added</span>
                        ) : (
                          <span className="text-white/40">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
      
      {solution.currentHighlight && (
        <div className="mt-4 p-3 bg-white/20 rounded-lg">
          <p className="text-sm">
            {solution.currentHighlight.type === 'sort' ? 
              "Sorting items by value/weight ratio (highest first)" : 
              getTooltipText(solution.currentHighlight.item, 'add')}
          </p>
          {solution.currentHighlight.type === 'add' && (
            <p className="text-sm mt-2">
              Remaining capacity: {solution.currentHighlight.remainingCapacity.toFixed(1)} / {capacity}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GreedyTable; 