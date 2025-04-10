import { useRef, useEffect } from 'react';
import useKnapsackStore from '../../store/knapsackStore';

export default function DPTable() {
  const { solution, items, capacity, currentStateIndex } = useKnapsackStore();
  const tableRef = useRef(null);

  useEffect(() => {
    if (solution && tableRef.current && solution.states[currentStateIndex]) {
      const state = solution.states[currentStateIndex];
      const rowIndex = state.currentItem !== null ? state.currentItem + 1 : 0;
      const colIndex = state.currentCapacity;

      const cellId = `cell-${rowIndex}-${colIndex}`;
      const cell = document.getElementById(cellId);

      if (cell) {
        cell.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [currentStateIndex, solution]);

  if (!solution) return null;

  const currentState = solution.states[currentStateIndex];
  const dpTable = currentState.dpTable;

  return (
    <div className="glass rounded-lg p-4 mb-4 overflow-hidden">
      <h3 className="text-xl font-bold mb-3 text-accent-300">DP Table Visualization</h3>

      <div className="overflow-x-auto" style={{ maxHeight: '300px' }} ref={tableRef}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 bg-gray-800 sticky top-0 left-0 z-10">Items / Capacity</th>
              {[...Array(capacity + 1).keys()].map(w => (
                <th
                  key={w}
                  className={`p-2 sticky top-0 z-10 ${w === currentState.currentCapacity ? 'bg-primary-900' : 'bg-gray-800'}`}
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <td
                  className={`p-2 bg-gray-800 sticky left-0 ${i === currentState.currentItem + 1 ? 'bg-primary-900' : 'bg-gray-800'}`}
                >
                  {i === 0 ? '0 (No items)' : `${i} (${items[i - 1]?.name || `Item ${i}`})`}
                </td>

                {row.map((cell, j) => {
                  const isCurrentCell = i === (currentState.currentItem !== null ? currentState.currentItem + 1 : 0) &&
                    j === currentState.currentCapacity;

                  let cellClass = "p-2 text-center";
                  if (isCurrentCell) {
                    cellClass += " bg-accent-700 animate-pulse";
                  } else if (i === solution.dpTable.length - 1 && j === capacity) {
                    // final answer cell
                    cellClass += " bg-green-900 font-bold";
                  } else if (i === (currentState.currentItem !== null ? currentState.currentItem + 1 : 0)) {
                    // current row
                    cellClass += " bg-primary-900/50";
                  } else if (j === currentState.currentCapacity) {
                    // current column
                    cellClass += " bg-primary-800/30";
                  } else {
                    cellClass += " bg-gray-700";
                  }

                  return (
                    <td
                      key={j}
                      className={cellClass}
                      id={`cell-${i}-${j}`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-300">
        <p>
          <span className="inline-block w-3 h-3 bg-accent-700 mr-1"></span>
          <span>Current Cell Being Processed</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 bg-primary-900/50 mr-1"></span>
          <span>Current Row (Item Being Considered)</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 bg-green-900 mr-1"></span>
          <span>Final Solution Value</span>
        </p>
      </div>
    </div>
  );
}
