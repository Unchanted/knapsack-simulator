import React, { useMemo } from 'react';
import useKnapsackStore from '../store/knapsackStore';
import { KnapsackStep } from '../algorithms/knapsack';

interface KnapsackTableProps {
  className?: string;
}

const KnapsackTable: React.FC<KnapsackTableProps> = ({ className = '' }) => {
  const { solution, currentStep, items, capacity } = useKnapsackStore();

  const optimalPath = useMemo(() => {
    if (!solution || !solution.table) return [];
    
    const table = solution.table;
    const path: Array<{row: number, col: number}> = [];
    let i = items.length;
    let w = capacity;
    
    while (i > 0 && w > 0) {
      if (table[i][w] !== table[i - 1][w]) {
        path.push({ row: i, col: w });
        const item = items[i - 1];
        w -= item.weight;
      } else {
        path.push({ row: i, col: w });
      }
      i--;
    }
    
    return path;
  }, [solution, items, capacity]);
  
  if (!solution || !solution.table) {
    return (
      <div className={`bg-black/60 backdrop-blur-md border border-nebula-primary/30 rounded-lg p-4 ${className}`}>
        <h2 className="text-lg font-bold bg-gradient-to-r from-nebula-secondary to-nebula-accent bg-clip-text text-transparent mb-4">
          Dynamic Programming Table
        </h2>
        <div className="text-center py-8 text-gray-500 italic">
          Run the algorithm to see the DP table
        </div>
      </div>
    );
  }

  const table = solution.table;
  const rowCount = table.length;
  const colCount = table[0].length;

  const activeStep = solution.steps[currentStep] || { i: -1, w: -1 };
  
  const isOnOptimalPath = (row: number, col: number) => {
    return optimalPath.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className={`bg-black/60 backdrop-blur-md border border-nebula-primary/30 rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-bold bg-gradient-to-r from-nebula-secondary to-nebula-accent bg-clip-text text-transparent mb-4">
        Dynamic Programming Table
      </h2>
      
      <div className="overflow-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-nebula-primary/30 scrollbar-track-black/20">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-nebula-primary/30 bg-black/50 p-2 text-xs text-gray-400">
                Item / Weight
              </th>
              {Array.from({ length: colCount }).map((_, col) => (
                <th 
                  key={col} 
                  className="border border-nebula-primary/30 bg-black/50 p-2 text-xs text-nebula-accent"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, row) => (
              <tr key={row}>
                <td className="border border-nebula-primary/30 bg-black/50 p-2 text-xs text-nebula-secondary">
                  {row === 0 ? 'Base' : `Item ${row}`}
                  {row > 0 && (
                    <span className="block text-[10px] text-gray-400">
                      (V:{items[row-1]?.value}, W:{items[row-1]?.weight})
                    </span>
                  )}
                </td>
                {Array.from({ length: colCount }).map((_, col) => {
                  const isActive = activeStep.i === row && activeStep.w === col;
                  const isOptimal = isOnOptimalPath(row, col);
                  
                  return (
                    <td 
                      key={col}
                      className={`
                        border border-nebula-primary/30 p-2 text-sm text-center transition-all duration-300
                        ${isActive ? 'bg-nebula-secondary/20 text-nebula-secondary font-bold animate-pulse' : ''}
                        ${isOptimal && !isActive ? 'bg-nebula-accent/20 text-nebula-accent' : ''}
                        ${!isActive && !isOptimal ? 'bg-black/40' : ''}
                      `}
                    >
                      {table[row][col]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-nebula-secondary/20 border border-nebula-secondary/30"></div>
          <span className="text-gray-400">Current cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-nebula-accent/20 border border-nebula-accent/30"></div>
          <span className="text-gray-400">Optimal path</span>
        </div>
      </div>
    </div>
  );
};

export default KnapsackTable; 